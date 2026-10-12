import React from "react";
import { useSelector } from "react-redux";

import "./home.css";

import Landing from "../Landing/Landing";
import Workshop from "../Workshop/Workshop";

const Home = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (isLoggedIn) {
    return <Workshop />;
  } else {
    return <Landing />;
  }
};

export default Home;
