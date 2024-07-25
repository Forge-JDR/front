import React from "react";

import "./home.css";

import AnonymeHome from "../../templates/home/anonymeHome/AnonymeHome";
import ConnectedHome from "../../templates/home/connectedHome/ConnectedHome";

const Home = () => {
  const isConnected = true;

  if (isConnected) {
    return <ConnectedHome></ConnectedHome>;
  } else {
    return <AnonymeHome></AnonymeHome>;
  }
};

export default Home;
