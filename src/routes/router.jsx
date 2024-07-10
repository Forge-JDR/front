import React from "react";

import Home from "../components/pages/Home/Home";
import Login from "../components/pages/Login/Login";
import SignUp from "../components/pages/SignUp/SignUp";

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
      element: <Login />
    },
    {
      path : "disconnect",
      element: (
        <RequireAuth>
          <Disconnect />
        </RequireAuth>
          )
    },
    {
      path: "signup",
      element: <SignUp />
    },
    {
      path: "discover",
      element: <Discover />
    }, 
    {
      path : "wiki/:id",
      element: (
      <ErrorBoundary>
      <Wiki />
      </ErrorBoundary>)
    }
  ]);

  return <RouterProvider router={router}/>;
};
