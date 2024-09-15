import React from "react";

import Home from "../components/pages/Home/Home";
import Login from "../components/pages/Login/Login";
import Signup from "../components/pages/Signup/Signup";
import Creation from "../components/pages/Creation/Creation";
import Caracters from "../components/pages/Caracters/Caracters";
import CaractersEdition from "../components/pages/CaractersEdition/CaractersEdition";
import WikiEdition from "../components/pages/WikiEdition/WikiEdition";
import CGU from "../components/pages/GCU/Cgu";
import Contact from "../components/pages/Contact/Contact";
import User from "../components/pages/User/User";
import AdminWiki from "../components/pages/Admin/AdminWiki";

import Discover from "../components/pages/Discover/Discover";
import { RequireAuth } from "./requireAuth";
import Wiki from "../components/pages/Wiki/Wiki";
import Disconnect from "../components/pages/Disconnect/Disconnect";
import ErrorBoundary from "../components/ErrorBoundaries/ErrorBoundaries";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

export const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "signup",
      element: <Signup />,
    },
    {
      path: "disconnect",
      element: (
        <RequireAuth>
          <Disconnect />
        </RequireAuth>
      ),
    },
    {
      path: "creation",
      element: (
        <RequireAuth>
          <Creation />
        </RequireAuth>
      ),
    },
    {
      path: "caracters",
      element: (
        <RequireAuth>
          <Caracters />
        </RequireAuth>
      ),
    },
    {
      path: "caracters/edit/:id",
      element: (
        <RequireAuth>
          <CaractersEdition />
        </RequireAuth>
      ),
    },
    {
      path: "discover",
      element: (
        <RequireAuth>
          <Discover />
        </RequireAuth>
      ),
    },
    {
      path: "wiki/:id",
      element: (
        <ErrorBoundary>
          <Wiki />
        </ErrorBoundary>
      ),
    },
    {
      path: "wiki/edit/:id",
      element: (
        <ErrorBoundary>
          <WikiEdition />
        </ErrorBoundary>
      ),
    },
    {
      path: "contact",
      element: <Contact />,
    },
    {
      path: "cgu",
      element: <CGU />,
    },
    {
      path: "user",
      element: (
        <RequireAuth>
          <User />
        </RequireAuth>
      ),
    },

    {
      path: "admin/wiki",
      element: (
        <RequireAuth>
          <AdminWiki />
        </RequireAuth>
      ),
    }
  ]);

  return <RouterProvider router={router} />;
};
