import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import "./caracters.css";

import forgeLogoTxt from "../../../assets/logo/logo_texte.svg";

import AnonymeHome from "../../templates/home/anonymeHome/AnonymeHome";
import ConnectedHome from "../../templates/home/connectedHome/ConnectedHome";
import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import CardCaracter from "../../UI/organisms/CardCaracter/CardCaracter";
import CardCreate from "../../UI/molecules/CardCreate/CardCreate";
import NewCaracterForm from "../../templates/NewCaracterForm/NewCaracterForm";

import imageTest from "../../../assets/home/fonc3.jpg";

const Caracters = () => {
  const { t } = useTranslation();

  const [isDisplayFormNew, setIsDisplayFormNew] = useState(false);

  const displayForm = () => {
    setIsDisplayFormNew(!isDisplayFormNew);
  };

  const caracterList = [
    {
      srcImg: imageTest,
      nameCaracter: "Alchi",
      rpgName: "Oniris",
    },
    {
      srcImg: imageTest,
      nameCaracter: "Stryf",
      rpgName: "Oniris",
    },
  ];

  return (
    <>
      <div className="background creation">
        <div className="background-hexa image">
          <ConnectedNavbar></ConnectedNavbar>
          {isDisplayFormNew && <NewCaracterForm closeForm={displayForm} />}
          <div className="main-contaner personnal-caracter">
            <div className="title-personnal-page">
              <p>{t("caracter.title")}</p>
            </div>
            <div className="card-container caracter creation inline-content">
              {caracterList.map((caracter, index) => (
                <div key={index} className="personnal-caracter-card caracter">
                  <CardCaracter
                    srcImg={caracter.srcImg}
                    nameCaracter={caracter.nameCaracter}
                    rpgName={caracter.rpgName}
                  />
                </div>
              ))}
              <div className="personnal-caracter-card new rpg">
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
    </>
  );
};

export default Caracters;
