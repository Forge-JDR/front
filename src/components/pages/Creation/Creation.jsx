import React from "react";

import "./creation.css";

import forgeLogoTxt from "../../../assets/logo/logo_texte.svg";

import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import WikiEditor from "../../UI/organisms/wikiEditor/WikiEditor";
import CardCreate from "../../UI/molecules/CardCreate/CardCreate";

const Creation = () => {
  return (
    <>
      <div className="background creation">
        <div className="background-hexa image">
          <ConnectedNavbar></ConnectedNavbar>
          <div className="main-contaner personnal-rpg">
            <div className="title-personnal-page">
              <p>Mes Jeux de rôles</p>
            </div>
            <div className="card-container rpg creation inline-content">
              <div className="personnal-rpg-card new rpg">
                <CardCreate
                  width="100%"
                  height="100%"
                  title="Créer un nouveau JDR"
                ></CardCreate>
              </div>
              <div className="personnal-rpg-card">
                <CardCreate
                  width="100%"
                  height="100%"
                  title="Créer un nouveau JDR"
                ></CardCreate>
              </div>
              <div className="personnal-rpg-card">
                <CardCreate
                  width="100%"
                  height="100%"
                  title="Créer un nouveau JDR"
                ></CardCreate>
              </div>
            </div>
          </div>
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
