import React from "react";

import Home from "../components/pages/Home/Home";
import Login from "../components/pages/Login/Login";
import SignUp from "../components/pages/SignUp/SignUp";

import Discover from "../components/pages/Discover/Discover";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RequireAuth } from "./requireAuth";


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
      path: "signup",
      element: <SignUp />
    },
    {
      path: "discover",
      element: <Discover />
    }
  ]);

  return <RouterProvider router={router}/>;
};
