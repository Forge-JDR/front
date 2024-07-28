import React from "react";
import { useTranslation } from "react-i18next";

import "./connectedHome.css";

import forgeLogoTxt from "../../../../assets/logo/logo_texte.svg";

import NavBar from "../../../UI/organisms/navBar/NavBar";
import ConnectedNavbar from "../../connectedNavBar/ConnectedNavbar";
import CardCreate from "../../../UI/molecules/CardCreate/CardCreate";

const ConnectedHome = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="connected-home background">
        <div className="background-hexa image">
          <ConnectedNavbar />
          <div className="main-contaner personnal-home">
            <div className="my-content">
              <div className="left rpg-creation">
                <div className="box-content">
                  <CardCreate
                    width="100%"
                    height="30%"
                    title="Nouveau JDR"
                  ></CardCreate>
                  <CardCreate
                    width="100%"
                    height="30%"
                    title="Nouveau JDR"
                  ></CardCreate>
                </div>
              </div>
              <div className="right content">
                <div className="my-caracters">
                  <div className="box-content inline-content">
                    <CardCreate
                      width="20%"
                      height="100%"
                      title="Nouveau Personnage"
                    ></CardCreate>
                    <CardCreate
                      width="20%"
                      height="100%"
                      title="Nouveau Personnage"
                    ></CardCreate>
                  </div>
                </div>
                <div className="my-games">
                  <div className="comming-soon">Comming soon !</div>
                  <div className="box-content inline-content">
                    <CardCreate
                      width="20%"
                      height="100%"
                      title="Nouvelle partie"
                    ></CardCreate>
                  </div>
                </div>
              </div>
            </div>
            <div className="discover list"></div>
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

export default ConnectedHome;
