import React from "react";

import "./creation.css";

import forgeLogoTxt from "../../../assets/logo/logo_texte.svg";

import AnonymeHome from "../../templates/home/anonymeHome/AnonymeHome";
import ConnectedHome from "../../templates/home/connectedHome/ConnectedHome";
import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import WikiEditor from "../../UI/organisms/wikiEditor/WikiEditor";

const Creation = () => {
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
      {/* <div className="wiki-editor">
        <WikiEditor />
      </div> */}
    </>
  );
};

export default Creation;
