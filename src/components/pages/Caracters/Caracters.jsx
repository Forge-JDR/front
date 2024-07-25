import React from "react";

import "./caracters.css";

import AnonymeHome from "../../templates/home/anonymeHome/AnonymeHome";
import ConnectedHome from "../../templates/home/connectedHome/ConnectedHome";
import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";

const Caracters = () => {
  return (
    <div className="background creation">
      <ConnectedNavbar></ConnectedNavbar>
      <div>Hello</div>
    </div>
  );
};

export default Caracters;
