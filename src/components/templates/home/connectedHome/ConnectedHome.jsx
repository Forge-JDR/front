import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { fetchWikis } from "../../../../store/store";
import { fetchCurrentUser } from "../../../../store/slices/auth.slice";
import "./connectedHome.css";

import forgeLogoTxt from "../../../../assets/logo/logo_texte.svg";
import defaultWikiImage from "../../../../assets/wiki_default.png";
import defaultCaraImage from "../../../../assets/home/fonc2.jpg";
import defaultPubliImage from "../../../../assets/home/fonc4.jpg";

import Footer from "../../../UI/organisms/footer/Footer";
import ConnectedNavbar from "../../connectedNavBar/ConnectedNavbar";
import CardCreate from "../../../UI/molecules/CardCreate/CardCreate";
import NewCaracterForm from "../../NewCaracterForm/NewCaracterForm";
import CardRpgDiscoverHome from "../../../UI/organisms/CardRpgDiscoverHome/CardRpgDiscoverHome";
import CardRpgHome from "../../../UI/organisms/CardRpgHome/CardRpgHome";
import NewRpgForm from "../../../templates/NewRpgForm/NewRpgForm";
import CardCaraHome from "../../../UI/organisms/CardCaraHome/CardCaraHome";

const ConnectedHome = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wikis = useSelector((state) => state.wikis.wikisList);
  const wikiStatus = useSelector((state) => state.wikis.status);
  const ConnectedUser = useSelector((state) => state.auth.user);
  const caracters = ConnectedUser?.caracters;

  const [isDisplayFormNew, setIsDisplayFormNew] = useState(false);
  const [isDisplayFormNewRpg, setIsDisplayFormNewRpg] = useState(false);

  const displayForm = () => {
    setIsDisplayFormNew(!isDisplayFormNew);
  };

  const displayFormRpg = () => {
    setIsDisplayFormNewRpg(!isDisplayFormNewRpg);
  };

  // Fetch wikis if necessary
  useEffect(() => {
    if (wikiStatus === "idle") {
      dispatch(fetchWikis());
    }
  }, [wikiStatus, dispatch]);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const ListDiscoverWikis = () => {
    // Check if `wikis` is an array and map over it if it has elements
    if (!Array.isArray(wikis) || wikis.length === 0) {
      return <p>Chargement des JDR...</p>;
    }

    return wikis.map(
      (el) =>
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
              srcImg={el.imageFile ? el.imageFile.path : defaultPubliImage}
              nameRpg={el.Name}
              owner={el.user?.username}
            />
          </div>
        )
    );
  };

  const RecentRpg = () => {
    if (!ConnectedUser) {
      return <p>Chargement des JDR...</p>;
    }

    // Filter the 3 most recent RPGs
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
        {/* Show creation card if user has less than 3 RPGs */}
        {recentUserWikis.length < 3 && (
          <CardCreate
            width="100%"
            height="30%"
            title={t("connectedHome.newRPG")}
            onClick={displayFormRpg}
          />
        )}
      </>
    );
  };

  const RecentCara = () => {
    if (!ConnectedUser) {
      return <p>Chargement des personnages...</p>;
    }

    // Filter the 3 most recent RPGs
    const recentUserCaracters = ConnectedUser.Caracters.slice(0, 5);

    return (
      <>
        {recentUserCaracters.map((cara) => (
          <div
            className="my-caracter-card caracter"
            key={cara.id}
            onClick={() => {
              navigate(`/caracters/edit/${cara.id}`);
            }}
          >
            <CardCaraHome
              className="home user-jdr"
              id={cara.id}
              srcImg={cara.imageFile ? cara.imageFile.path : defaultCaraImage}
              nameCaracter={cara.Name}
            />
          </div>
        ))}
        {/* Show creation card if user has less than 3 RPGs */}
        {recentUserCaracters.length < 5 && (
          <CardCreate
            width="20%"
            height="100%"
            title={t("connectedHome.newRPG")}
            onClick={displayFormRpg}
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
        {isDisplayFormNewRpg && <NewRpgForm closeForm={displayFormRpg} />}
        <div className="main-contaner personnal-home">
          <div className="home-user content" id="home-user-content"></div>
          <div className="my-content">
            <div className="left rpg-creation">
              {/* User's RPGs */}
              <div className="box-content">{RecentRpg()}</div>
            </div>
            <div className="right content">
              <div className="my-caracters">
                <div className="box-content inline-content">
                  {/* User's characters */}
                  {RecentCara()}
                </div>
              </div>
              <div className="my-games">
                {/* User's games */}
                <div className="comming-soon">{t("commun.commingSoon")}</div>
                <div className="box-content inline-content">
                  <CardCreate
                    width="20%"
                    height="100%"
                    title={t("connectedHome.newGame")}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* List of published RPGs */}
          <div className="discover list">
            {ListDiscoverWikis()}
            <div
              className="button view-more"
              onClick={() => {
                navigate(`/discover`);
              }}
            >
              <p>Découvrir</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ConnectedHome;
