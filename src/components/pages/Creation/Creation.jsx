import React, { useState } from "react";

import "./creation.css";

import forgeLogoTxt from "../../../assets/logo/logo_texte.svg";

import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import WikiEditor from "../../UI/organisms/wikiEditor/WikiEditor";
import CardCreate from "../../UI/molecules/CardCreate/CardCreate";
import NewRpgForm from "../../templates/NewRpgForm/NewRpgForm";
import CardRpg from "../../UI/organisms/CardRpg/CardRpg";

import imageTest from "../../../assets/home/fonc3.jpg";

const Creation = () => {
  const [isDisplayFormNew, setIsDisplayFormNew] = useState(false);

  const displayForm = () => {
    setIsDisplayFormNew(!isDisplayFormNew);
  };

  const rpgList = [
    {
      srcImg: imageTest,
      nameRpg: "Oniris",
    },
  ];

  return (
    <>
      <div className="background creation">
        <div className="background-hexa image">
          <ConnectedNavbar></ConnectedNavbar>
          {isDisplayFormNew && <NewRpgForm closeForm={displayForm} />}
          <div className="main-contaner personnal-rpg">
            <div className="title-personnal-page">
              <p>Mes Jeux de rôles</p>
            </div>
            <div className="card-container rpg creation inline-content">
              {rpgList.map((rpg, index) => (
                <div key={index} className="personnal-rpg-card rpg">
                  <CardRpg srcImg={rpg.srcImg} nameRpg={rpg.nameRpg} />
                </div>
              ))}
              <div className="personnal-rpg-card new rpg">
                <CardCreate
                  width="100%"
                  height="100%"
                  title="Créer un nouveau JDR"
                  role="button"
                  onClick={displayForm}
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
