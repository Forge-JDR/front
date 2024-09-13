import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { store, fetchWikis } from "../../../../store/store";
import { fetchCurrentUser } from "../../../../store/slices/auth.slice"; // Import de l'action fetchCurrentUser

import "./connectedHome.css";

import forgeLogoTxt from "../../../../assets/logo/logo_texte.svg";
import defaultWikiImage from "../../../../assets/wiki_default.png";

import Footer from "../../../UI/organisms/footer/Footer";
import ConnectedNavbar from "../../connectedNavBar/ConnectedNavbar";
import CardCreate from "../../../UI/molecules/CardCreate/CardCreate";
import NewCaracterForm from "../../NewCaracterForm/NewCaracterForm";
import CardRpgDiscoverHome from "../../../UI/organisms/CardRpgDiscoverHome/CardRpgDiscoverHome";
import CardRpgHome from "../../../UI/organisms/CardRpgHome/CardRpgHome";

const ConnectedHome = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wiki = useSelector((state) => state.wikis.wikisList);
  const wikiStatus = useSelector((state) => state.wikis.status);
  const ConnectedUser = useSelector((state) => state.auth.user);

  const [isDisplayFormNew, setIsDisplayFormNew] = useState(false);

  const displayForm = () => {
    setIsDisplayFormNew(!isDisplayFormNew);
  };

  // Fetch des wikis au montage du composant si nécessaire
  useEffect(() => {
    if (wikiStatus === "idle") {
      dispatch(fetchWikis());
    }
  }, [wikiStatus, dispatch]);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const wikis = useSelector((state) => state.wikis.userWikis);

  const userWikis = ConnectedUser?.Wikis;

  const ListDiscoverWikis = () => {
    if (!wiki[0]) return <p>On load</p>;

    return wiki[0].map((el) => {
      return (
        el.Status === "published" && (
          <div
            className="discover-rpg-card rpg"
            key={el.id}
            onClick={() => {
              navigate(`/wiki/${el.id}`);
            }}
          >
            <CardRpgDiscoverHome
              className="list-rpg-published home"
              id={el.id}
              srcImg={el.imageFile ? el.imageFile.path : defaultWikiImage}
              nameRpg={el.Name}
              owner={el.user?.pseudo}
            />
          </div>
        )
      );
    });
  };

  const RecentRpg = () => {
    if (!ConnectedUser) {
      return <p>Chargement des JDR...</p>;
    }

    // Filtrer les 3 JDR les plus récents de l'utilisateur
    const recentUserWikis = ConnectedUser.Wikis.slice(0, 3);

    return (
      <>
        {recentUserWikis.map((wiki) => (
          <div
            className="my-rpg-card rpg"
            key={wiki.id}
            onClick={() => {
              navigate(`/wiki/edit/${wiki.id}`);
            }}
          >
            <CardRpgHome
              className="home user-jdr"
              id={wiki.id}
              srcImg={wiki.imageFile ? wiki.imageFile.path : defaultWikiImage}
              nameRpg={wiki.Name}
              owner={wiki.pseudo}
            />
          </div>
        ))}
        {/* Afficher une carte de création si l'utilisateur a moins de 3 JDR */}
        {recentUserWikis.length < 3 && (
          <CardCreate
            width="100%"
            height="30%"
            title={t("connectedHome.newRPG")}
          />
        )}
      </>
    );
  };

  return (
    <>
      <div className="connected-home background">
        <ConnectedNavbar />
        <div className="background-hexa image home"></div>
        {isDisplayFormNew && <NewCaracterForm closeForm={displayForm} />}
        <div className="main-contaner personnal-home">
          <div className="home-user content" id="home-user-content"></div>
          <div className="my-content">
            <div className="left rpg-creation">
              {/* JDR de l'utilisateur connecté */}
              <div className="box-content">{RecentRpg()}</div>
            </div>
            <div className="right content">
              <div className="my-caracters">
                <div className="box-content inline-content">
                  {/* Personnages de l'utilisateur connecté */}
                  <CardCreate
                    width="20%"
                    height="100%"
                    title={t("connectedHome.newCharactere")}
                    onClick={displayForm}
                  ></CardCreate>
                </div>
              </div>
              <div className="my-games">
                {/* Parties de l'utilisateur connecté */}
                <div className="comming-soon">{t("commun.commingSoon")}</div>
                <div className="box-content inline-content">
                  <CardCreate
                    width="20%"
                    height="100%"
                    title={t("connectedHome.newGame")}
                  ></CardCreate>
                </div>
              </div>
            </div>
          </div>
          {/* LListe des JDR publiés */}
          <div className="discover list">
            {ListDiscoverWikis()}
            <div
              className="button view-more "
              onClick={() => {
                navigate(`/discover`);
              }}
            >
              <p>Découvrir</p>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default ConnectedHome;
