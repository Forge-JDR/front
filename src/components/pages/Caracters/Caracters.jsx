import React from "react";

import "./caracters.css";

import forgeLogoTxt from "../../../assets/logo/logo_texte.svg";

import AnonymeHome from "../../templates/home/anonymeHome/AnonymeHome";
import ConnectedHome from "../../templates/home/connectedHome/ConnectedHome";
import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";

const Caracters = () => {
  return (
    <>
      <div className="background creation">
        <div className="background-hexa image">
          <ConnectedNavbar></ConnectedNavbar>
        </div>
      </div>
      <div className="footer">
        <img className="logo-text" src={forgeLogoTxt} alt="logo_text" />
        <p>Copyright 2024</p>
      </div>
    </>
  );
};

export default Caracters;
