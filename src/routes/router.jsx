import React from "react";

import Home from "../components/pages/Home/Home";
import Login from "../components/pages/Login/Login";
import Signup from "../components/pages/Signup/Signup";
import Creation from "../components/pages/Creation/Creation";
import Caracters from "../components/pages/Caracters/Caracters";

import Discover from "../components/pages/Discover/Discover";
import { RequireAuth } from "./requireAuth";
import Wiki from "../components/pages/Wiki/Wiki";
import Disconnect from "../components/pages/Disconnect/Disconnect";
import ErrorBoundary from "../components/ErrorBoundaries/ErrorBoundaries";

import Discover from "../components/pages/Discover/Discover";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RequireAuth } from "./requireAuth";
import Wiki from "../components/pages/Wiki/Wiki";
import Disconnect from "../components/pages/Disconnect/Disconnect";
import ErrorBoundary from "../components/ErrorBoundaries/ErrorBoundaries";

export const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <RequireAuth>
          <Home />
        </RequireAuth>
      ),
    },
    {
      path: "login",
      element: <Login />,
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
      path: "signup",
      element: <SignUp />,
    },
    {
      path: "discover",
      element: <Discover />,
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
    ,
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
  ]);

  return <RouterProvider router={router} />;
};
