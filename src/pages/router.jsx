import React from "react";

import Home from "./Home/Home";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

export const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "connexion",
      element: <Login />,
    },
    {
      path: "inscription",
      element: <Signup />,
    },
  ]);

  return <RouterProvider router={router} />;
};
