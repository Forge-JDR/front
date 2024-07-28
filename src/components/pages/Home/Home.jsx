import React from "react";

import "./home.css";

import AnonymeHome from "../../templates/home/anonymeHome/AnonymeHome";
import ConnectedHome from "../../templates/home/connectedHome/ConnectedHome";

const Home = () => {
  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_URL_BACK + "/login_check";
  console.log(API_URL);

  if (token) {
    return <ConnectedHome></ConnectedHome>;
  } else {
    return <AnonymeHome></AnonymeHome>;
  }
};

export default Home;
