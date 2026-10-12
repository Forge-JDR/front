import React from "react";
import { useSelector } from "react-redux";

import "./home.css";

import AnonymeHome from "../../templates/home/anonymeHome/AnonymeHome";
import Workshop from "../Workshop/Workshop";

const Home = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (isLoggedIn) {
    return <Workshop />;
  } else {
    return <AnonymeHome></AnonymeHome>;
  }
};

export default Home;
