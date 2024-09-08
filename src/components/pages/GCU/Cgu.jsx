import React from "react";
import { useTranslation } from "react-i18next";

import "./cgu.css"; // Import du fichier de style pour les CGU
import Footer from "../../UI/organisms/footer/Footer";
import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar"; // Ajout du Navbar si c'est cohérent avec la structure du site
import NavBar from "../../UI/organisms/navBar/NavBar";

const CGU = () => {
  const { t } = useTranslation();

  const links = [];
  const token = localStorage.getItem("token");

  return (
    <>
      <div className="background creation">
        <div className="background-hexa image"></div>
        {token ? <ConnectedNavbar /> : <NavBar links={links} />}
        <div className="main-container cgu-page">
          <div className="title-cgu-page">
            <p>{t("TCU.title")}</p>
          </div>

          <div className="cgu-content">
            <p className="cgu-date">{t("TCU.date")}</p>
            <p>{t("TCU.pitch")}</p>

            <section>
              <h2>{t("TCU.title1")}</h2>
              <p>{t("TCU.texte1")}</p>
            </section>

            <section>
              <h2>{t("TCU.title2")}</h2>
              <p>{t("TCU.texte2")}</p>
            </section>

            <section>
              <h2>{t("TCU.title3")}</h2>
              <p>{t("TCU.texte3")}</p>
            </section>

            <section>
              <h2>{t("TCU.title4")}</h2>
              <p>{t("TCU.texte4")}</p>
            </section>

            <section>
              <h2>{t("TCU.title5")}</h2>
              <p>{t("TCU.texte5")}</p>
            </section>

            <section>
              <h2>{t("TCU.title6")}</h2>
              <p>{t("TCU.texte6")}</p>
            </section>

            <section>
              <h2>{t("TCU.title7")}</h2>
              <p>{t("TCU.texte7")}</p>
            </section>

            <section>
              <h2>{t("TCU.title8")}</h2>
              <p>{t("TCU.texte8")}</p>
            </section>

            <section>
              <h2>{t("TCU.title9")}</h2>
              <p>{t("TCU.texte9")}</p>
            </section>

            <section>
              <h2>{t("TCU.title10")}</h2>
              <p>{t("TCU.texte10")}</p>
            </section>

            <section>
              <h2>{t("TCU.title11")}</h2>
              <p>{t("TCU.texte11")}</p>
            </section>

            <section>
              <h2>{t("TCU.title12")}</h2>
              <p>{t("TCU.texte12")}</p>
            </section>
          </div>
        </div>
      </div>
      <div className="footer-cgu">
        <Footer></Footer>
      </div>
    </>
  );
};

export default CGU;
