import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

// Exercise the actual modules without installing CRA or making HTTP requests.
async function moduleAt(path, bindings) {
    const source = await readFile(new URL('../../' + path, import.meta.url), 'utf8');
    const context = vm.createContext({ ...bindings });
    vm.runInContext(source.replace(/^import .*;\s*$/gm, '').replace('export default', 'globalThis.moduleExport ='), context);
    return context.moduleExport;
}

function storage() {
    const values = new Map();
    return {
        getItem: (key) => values.get(key) || null,
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: (key) => values.delete(key),
    };
}

async function interceptor(post) {
    const localStorage = storage();
    localStorage.setItem('token', 'old-access');
    localStorage.setItem('refresh_token', 'old-refresh');
    let request, failure;
    const retried = [];
    const ejected = [];
    const api = async (config) => { retried.push(request(config)); return { data: 'ok' }; };
    api.post = post;
    api.interceptors = {
        request: { use: (fn) => { request = fn; return 1; }, eject: (id) => ejected.push(id) },
        response: { use: (_, fn) => { failure = fn; return 2; }, eject: (id) => ejected.push(id) },
    };
    const store = { dispatch: ({ type, payload }) => {
        if (type === 'reload') {
            localStorage.setItem('token', payload.token);
            localStorage.setItem('refresh_token', payload.refresh_token);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
        }
    } };
    const setup = await moduleAt('src/config/refreshTokenInterceptor.js', {
        axiosInstance: api, localStorage,
        reloadToken: (payload) => ({ type: 'reload', payload }), deleteToken: () => ({ type: 'delete' }),
    });
    const dispose = setup(store);
    const unauthorized = (url = '/api/me') => ({ config: request({ url }), response: { status: 401 } });
    return { failure, unauthorized, localStorage, retried, dispose, ejected };
}

test('login stores the refresh token separately from the access token', async () => {
    const localStorage = storage();
    const service = await moduleAt('src/services/auth.service.js', {
        localStorage, api: { post: async () => ({ data: { token: 'access', refresh_token: 'refresh' } }) },
    });
    await service.login('user@example.com', 'password');
    assert.equal(localStorage.getItem('token'), 'access');
    assert.equal(localStorage.getItem('refresh_token'), 'refresh');
});

test('login failures propagate and do not create a session', async () => {
    const localStorage = storage();
    const service = await moduleAt('src/services/auth.service.js', {
        localStorage, api: { post: async () => { throw Error('invalid credentials'); } },
    });
    await assert.rejects(service.login('user@example.com', 'wrong'), /invalid credentials/);
    assert.equal(localStorage.getItem('token'), null);
});

test('registration obtains a renewable session through login', async () => {
    const localStorage = storage();
    const urls = [];
    const service = await moduleAt('src/services/auth.service.js', {
        localStorage, api: { post: async (url) => {
            urls.push(url);
            return { data: url === '/register' ? { token: 'signup-access' } : { token: 'access', refresh_token: 'refresh' } };
        } },
    });
    await service.register('user@example.com', 'password', 'pseudo');
    assert.deepEqual(urls, ['/register', '/api/login_check']);
    assert.equal(localStorage.getItem('refresh_token'), 'refresh');
});

test('a 401 refreshes once and retries with the new access token', async () => {
    let calls = 0;
    const h = await interceptor(async (url, body) => {
        calls++;
        assert.equal(url, '/api/token/refresh');
        assert.equal(body.refresh_token, 'old-refresh');
        return { data: { token: 'new-access', refresh_token: 'new-refresh' } };
    });
    await h.failure(h.unauthorized());
    assert.equal(calls, 1);
    assert.equal(h.retried[0].headers.Authorization, 'Bearer new-access');
});

test('concurrent 401 responses share a single refresh request', async () => {
    let resolve, calls = 0;
    const h = await interceptor(() => { calls++; return new Promise((r) => { resolve = r; }); });
    const a = h.failure(h.unauthorized());
    const b = h.failure(h.unauthorized('/api/wikis'));
    resolve({ data: { token: 'new-access', refresh_token: 'new-refresh' } });
    await Promise.all([a, b]);
    assert.equal(calls, 1);
    assert.equal(h.retried.length, 2);
});

test('a delayed 401 uses the already refreshed token', async () => {
    let calls = 0;
    const h = await interceptor(async () => { calls++; return { data: { token: 'new-access', refresh_token: 'new-refresh' } }; });
    const delayed = h.unauthorized();
    await h.failure(h.unauthorized());
    await h.failure(delayed);
    assert.equal(calls, 1);
    assert.equal(h.retried.length, 2);
});

test('refresh failure clears the session and never retries the original request', async () => {
    const h = await interceptor(async () => { throw Error('expired refresh'); });
    await assert.rejects(h.failure(h.unauthorized()), /expired refresh/);
    assert.equal(h.localStorage.getItem('token'), null);
    assert.equal(h.retried.length, 0);
});

test('a second 401 cannot start an endless refresh loop', async () => {
    const h = await interceptor(async () => ({ data: { token: 'new-access', refresh_token: 'new-refresh' } }));
    const error = h.unauthorized();
    await h.failure(error);
    await assert.rejects(h.failure(error));
    assert.equal(h.localStorage.getItem('token'), null);
});

test('auth endpoints do not trigger token refresh', async () => {
    let calls = 0;
    const h = await interceptor(async () => { calls++; });
    for (const url of ['/api/login_check', '/api/token/refresh', '/register']) {
        await assert.rejects(h.failure(h.unauthorized(url)));
    }
    assert.equal(calls, 0);
});

test('logging out while refreshing does not restore the session', async () => {
    let resolve;
    const h = await interceptor(() => new Promise((r) => { resolve = r; }));
    const pending = h.failure(h.unauthorized());
    h.localStorage.removeItem('token');
    h.localStorage.removeItem('refresh_token');
    resolve({ data: { token: 'new-access', refresh_token: 'new-refresh' } });
    await assert.rejects(pending, /session a changé/);
    assert.equal(h.localStorage.getItem('token'), null);
    assert.equal(h.retried.length, 0);
});

test('missing refresh token expires the session; interceptors can be disposed', async () => {
    const h = await interceptor(async () => { throw Error('must not refresh'); });
    h.localStorage.removeItem('refresh_token');
    await assert.rejects(h.failure(h.unauthorized()));
    assert.equal(h.localStorage.getItem('token'), null);
    h.dispose();
    assert.deepEqual(h.ejected, [1, 2]);
});
