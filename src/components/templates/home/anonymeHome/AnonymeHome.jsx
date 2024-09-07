import React from "react";
import { useTranslation } from "react-i18next";

import "./anonymeHome.css";
import forgeLogo from "../../../../assets/logo/logo_complet.svg";

import screen from "../../../../assets/screenshot.png";
import step1 from "../../../../assets/home/step_createAccount.svg";
import step2 from "../../../../assets/home/step_imagine.svg";
import step3 from "../../../../assets/home/step_share.svg";
import step4 from "../../../../assets/home/step_cara.svg";
import step5 from "../../../../assets/home/step_group.svg";
import fonct1 from "../../../../assets/home/fonc1.jpg";
import fonct2 from "../../../../assets/home/fonc2.jpg";
import fonct3 from "../../../../assets/home/fonc3.jpg";
import fonct4 from "../../../../assets/home/fonc4.jpg";

import NavBar from "../../../UI/organisms/navBar/NavBar";
import Footer from "../../../UI/organisms/footer/Footer";

const AnonymeHome = () => {
  const { t } = useTranslation();

  const links = [];

  return (
    <div className="home">
      <NavBar links={links} />
      <div className="main-presentation home background">
        <div className="container-content main-vue">
          <div className="presentation" id="discover-app">
            <div className="content">
              <div className="left-side">
                <div className="pitch">
                  <p>{t("home.pitch")}</p>
                </div>
                <div className="logo">
                  <img className="logo" src={forgeLogo} alt="Logo" />
                </div>
              </div>
              <div className="right-side">
                <div className="image screenshot">
                  <img className="screenshot" src={screen} alt="screenshop" />
                </div>
              </div>
            </div>
            <div className="bottom">
              <div className="button-container">
                <button className="cta-button">
                  <a href="/signup" className="button">
                    {t("home.createAccount")}
                  </a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="step-presentation">
        <div className="step-card step1">
          <img
            className="icone step1 createAcount"
            src={step1}
            alt="icone_createAccount"
          />
          <p>{t("home.step1")}</p>
        </div>
        <div className="step-card step2">
          <img
            className="icone step1 createAcount"
            src={step2}
            alt="icone_createAccount"
          />
          <p>{t("home.step2")}</p>
        </div>
        <div className="step-card step3">
          <img
            className="icone step1 createAcount"
            src={step3}
            alt="icone_createAccount"
          />
          <p>{t("home.step3")}</p>
        </div>
        <div className="step-card step4">
          <img
            className="icone step1 createAcount"
            src={step4}
            alt="icone_createAccount"
          />
          <p>{t("home.step4")}</p>
        </div>
        <div className="step-card step5">
          <img
            className="icone step1 createAcount"
            src={step5}
            alt="icone_createAccount"
          />
          <p>{t("home.step5")}</p>
        </div>
      </div>
      <div className="fonctionalities-presentation">
        <div className="fonctionality-card fonc1">
          <img className="fonc-img" src={fonct1} alt="image_fonctionnality1" />
          <div className="overlay">
            <p>{t("home.fonc1")}</p>
          </div>
        </div>
        <div className="fonctionality-card fonc2">
          <img className="fonc-img" src={fonct2} alt="image_fonctionnality2" />
          <div className="overlay">
            <p>{t("home.fonc2")}</p>
          </div>
        </div>
        <div className="fonctionality-card fonc3">
          <img className="fonc-img" src={fonct3} alt="image_fonctionnality3" />
          <div className="overlay">
            <p>{t("home.fonc3")}</p>
          </div>
        </div>
        <div className="fonctionality-card fonc4">
          <img className="fonc-img" src={fonct4} alt="image_fonctionnality4" />
          <div className="overlay">
            <p>{t("home.fonc4")}</p>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default AnonymeHome;
