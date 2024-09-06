import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { store, fetchWikis } from "../../../store/store";

import "./creation.css";

import forgeLogoTxt from "../../../assets/logo/logo_texte.svg";
import defaultWikiImage from "../../../assets/wiki_default.png";

import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import CardCreate from "../../UI/molecules/CardCreate/CardCreate";
import NewRpgForm from "../../templates/NewRpgForm/NewRpgForm";
import CardRpg from "../../UI/organisms/CardRpg/CardRpg";
import Footer from "../../UI/organisms/footer/Footer";

const Creation = () => {
  const userConnected = "admin";
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const wikis = useSelector((state) => state.wikis.wikisList);

  const links = [
    { name: t("navbar.sheet"), url: "/caracters" },
    { name: t("navbar.creation"), url: "/creation" },
    { name: t("navbar.discover"), url: "/discover" },
  ];

  useEffect(() => {
    dispatch(fetchWikis());
  }, [dispatch]);

  const [isDisplayFormNew, setIsDisplayFormNew] = useState(false);
  const [userWikis, setUserWikis] = useState([]);

  const displayForm = () => {
    setIsDisplayFormNew(!isDisplayFormNew);
  };

  useEffect(() => {
    console.log(wikis);
    console.log("userwiki: " + userWikis);
  }, [wikis]);

  return (
    <>
      <div className="background creation">
        <div className="background-hexa image">
          <ConnectedNavbar />
          {isDisplayFormNew && <NewRpgForm closeForm={displayForm} />}
          <div className="main-contaner personnal-rpg">
            <div className="title-personnal-page">
              <p>{t("creation.title")}</p>
            </div>
            <div className="card-container rpg creation inline-content">
              {Array.isArray(wikis) &&
                wikis.length > 0 &&
                wikis[0].map(
                  (rpg, index) =>
                    rpg.user?.pseudo === userConnected && (
                      <div key={index} className="personnal-rpg-card rpg">
                        <CardRpg
                          id={rpg.id}
                          srcImg={
                            rpg.imageFile
                              ? rpg.imageFile.path
                              : defaultWikiImage
                          }
                          nameRpg={rpg.Name}
                        />
                      </div>
                    )
                )}
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
      <Footer links={links}></Footer>
    </>
  );
};

export default Creation;
