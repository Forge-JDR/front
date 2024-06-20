import React from "react";

import Home from "../components/pages/Home/Home";
import Login from "../components/pages/Login/Login";
import Signup from "../components/pages/Signup/Signup";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

export const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "login",
      element: <Login />
    },
    {
      path: "signup",
      element: <Signup />
    }
  ]);

  return <RouterProvider router={router} />;
};
