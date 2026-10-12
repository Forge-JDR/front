import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Auth from "./Auth";
import { login, register } from "../../../store/slices/auth.slice";

jest.mock("../../../store/slices/auth.slice", () => ({
  login: jest.fn((payload) => ({ type: "login", payload })),
  register: jest.fn((payload) => ({ type: "register", payload })),
}));
function setup(signup, fail = false) {
  const state = { auth: { isLoggedIn: false } };
  const store = {
    getState: () => state,
    subscribe: () => () => {},
    dispatch: jest.fn(() => ({
      unwrap: async () => {
        if (fail) throw new Error("Invalid credentials");
        return { token: "test-access" };
      },
    })),
  };
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Auth signup={signup} />} />
          <Route path="/atelier" element={<p>Atelier ouvert</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
  return store;
}
beforeEach(() => jest.clearAllMocks());

test("mismatching signup passwords are explained without sending a request", () => {
  const store = setup(true);
  fireEvent.change(screen.getByLabelText("Pseudo"), {
    target: { value: "Ari" },
  });
  fireEvent.change(screen.getByLabelText("Adresse e-mail"), {
    target: { value: "ari@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Mot de passe"), {
    target: { value: "long-password" },
  });
  fireEvent.change(screen.getByLabelText("Confirmer le mot de passe"), {
    target: { value: "different-password" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Créer mon compte" }));
  expect(
    screen.getByText("Les mots de passe ne correspondent pas."),
  ).toBeInTheDocument();
  expect(store.dispatch).not.toHaveBeenCalled();
});

test("failed login stays on the form and reports an inline error", async () => {
  setup(false, true);
  fireEvent.change(screen.getByLabelText("Adresse e-mail"), {
    target: { value: "ari@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Mot de passe"), {
    target: { value: "long-password" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Connexion impossible.",
  );
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Se connecter" })).toBeEnabled(),
  );
  expect(screen.queryByText("Atelier ouvert")).not.toBeInTheDocument();
});

test("successful signup dispatches registration once and opens the atelier", async () => {
  setup(true);
  fireEvent.change(screen.getByLabelText("Pseudo"), {
    target: { value: "Ari" },
  });
  fireEvent.change(screen.getByLabelText("Adresse e-mail"), {
    target: { value: "ari@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Mot de passe"), {
    target: { value: "long-password" },
  });
  fireEvent.change(screen.getByLabelText("Confirmer le mot de passe"), {
    target: { value: "long-password" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Créer mon compte" }));
  expect(await screen.findByText("Atelier ouvert")).toBeInTheDocument();
  expect(register).toHaveBeenCalledTimes(1);
  expect(login).not.toHaveBeenCalled();
});
