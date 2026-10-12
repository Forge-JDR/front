const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const party = {
  id: 2,
  rpgId: 1,
  rpgName: "Astrée",
  name: "Les gardiens",
  description: "",
  notes: "Notes enregistrées.",
  sheets: [],
  journal: [
    {
      id: "session1",
      date: "2026-10-12",
      title: "Le départ",
      notes: "Une nouvelle aventure.",
    },
  ],
};
async function atelier(page, { worlds = true, parties = false } = {}) {
  await page.addInitScript(() => {
    localStorage.setItem("token", "browser-test-access");
    localStorage.setItem("refresh_token", "browser-test-refresh");
  });
  await page.route("http://localhost:8741/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    const body =
      path === "/api/me"
        ? { pseudo: "Ari", username: "ari@example.com", roles: ["ROLE_USER"] }
        : path === "/api/mvp/rpgs"
          ? worlds
            ? [
                {
                  id: 1,
                  name: "Astrée",
                  description: "Un monde de brumes.",
                  fields: [],
                  templateVersion: 1,
                },
              ]
            : []
          : path === "/api/mvp/campaigns"
            ? parties
              ? [party]
              : []
            : path === "/api/mvp/campaigns/2"
              ? party
              : [];
    await route.fulfill({
      contentType: "application/json",
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(body),
    });
  });
}

test("the landing page and signup form are usable on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Des mondes à inventer",
  );
  await page.getByRole("link", { name: "Ouvrir mon atelier" }).click();
  await expect(
    page.getByLabel("Adresse e-mail", { exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("Mot de passe", { exact: true })
    .fill("une-longue-phrase");
  await page
    .getByRole("button", { name: "Afficher : mot de passe", exact: true })
    .click();
  await expect(
    page.getByLabel("Mot de passe", { exact: true }),
  ).toHaveAttribute("type", "text");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});

test("creation dialogs trap focus, support Escape and return focus to the action", async ({
  page,
}) => {
  await atelier(page);
  await page.goto("/atelier");
  const action = page.getByRole("button", {
    name: "Créer un JDR",
    exact: true,
  });
  await action.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("Nom du JDR").fill("Brouillon");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(action).toBeFocused();
});

test("mobile navigation closes with Escape and links open the requested collection", async ({
  page,
}) => {
  await atelier(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/atelier");
  const menu = page.locator(
    '.mobile-bar button[aria-controls="navigation-atelier"]',
  );
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await page.getByRole("link", { name: "Mes JDR", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Mes JDR", exact: true, level: 1 }),
  ).toBeVisible();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});

test("search gives explicit feedback when there is no matching JDR", async ({
  page,
}) => {
  await atelier(page);
  await page.goto("/atelier?view=rpgs");
  await page.getByLabel("Rechercher dans mon atelier").fill("Inconnu");
  await expect(
    page.getByText("Aucun JDR ne correspond à votre recherche."),
  ).toBeVisible();
});

test("core public and authenticated pages have no automated WCAG A/AA violations", async ({
  page,
}) => {
  for (const route of ["/", "/login", "/signup"]) {
    await page.goto(route);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations, route).toEqual([]);
  }
  await atelier(page);
  for (const route of ["/atelier", "/user", "/atelier?view=characters"]) {
    await page.goto(route);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations, route).toEqual([]);
  }
});

test("campaign tabs support keyboard navigation and the journal is accessible", async ({
  page,
}) => {
  await atelier(page, { parties: true });
  await page.goto("/atelier?view=campaigns");
  await page.getByRole("button", { name: "Ouvrir Les gardiens" }).click();
  const first = page.getByRole("tab", { name: "La campagne" });
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Personnages (0)" }),
  ).toBeFocused();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "Journal (1)" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});
