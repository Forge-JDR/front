import React from "react";

import "./home.css";

import AnonymeHome from "../../templates/home/anonymeHome/AnonymeHome";
import ConnectedHome from "../../templates/home/connectedHome/ConnectedHome";

const Home = () => {
  const isConnected = true;
  const token = localStorage.getItem("token");

  if (token) {
    return <ConnectedHome></ConnectedHome>;
  } else {
    return <AnonymeHome></AnonymeHome>;
  }
};

export default Home;
