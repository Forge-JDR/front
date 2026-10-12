import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RequireAuth } from './requireAuth';

test('an expired session redirects away from the protected page', () => {
  const store = configureStore({ reducer: { auth: (state = { isLoggedIn: true }, action) => action.type === 'expire' ? { isLoggedIn: false } : state } });
  render(<Provider store={store}><MemoryRouter initialEntries={['/atelier']}><Routes>
    <Route path="/atelier" element={<RequireAuth><p>Atelier privé</p></RequireAuth>} />
    <Route path="/login" element={<p>Connexion requise</p>} />
  </Routes></MemoryRouter></Provider>);
  expect(screen.getByText('Atelier privé')).toBeInTheDocument();
  act(() => store.dispatch({ type: 'expire' }));
  expect(screen.getByText('Connexion requise')).toBeInTheDocument();
  expect(screen.queryByText('Atelier privé')).not.toBeInTheDocument();
});
