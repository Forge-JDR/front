import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { store, fetchWikis } from "../../../../store/store";

import "./connectedHome.css";
import Footer from "../../../UI/organisms/footer/Footer";
import forgeLogoTxt from "../../../../assets/logo/logo_texte.svg";
import defaultWikiImage from "../../../../assets/wiki_default.png";

import NavBar from "../../../UI/organisms/navBar/NavBar";
import ConnectedNavbar from "../../connectedNavBar/ConnectedNavbar";
import CardCreate from "../../../UI/molecules/CardCreate/CardCreate";
import NewCaracterForm from "../../NewCaracterForm/NewCaracterForm";

import CardRpgDiscover from "../../../UI/organisms/CardRpgDiscover/CardRpgDiscover";

const ConnectedHome = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const wiki = useSelector((state) => state.wikis.wikisList);
  const wikiStatus = useSelector((state) => state.wikis.status);
  const navigate = useNavigate();

  const [isDisplayFormNew, setIsDisplayFormNew] = useState(false);

  const displayForm = () => {
    setIsDisplayFormNew(!isDisplayFormNew);
  };

  useEffect(() => {
    if (wikiStatus === "idle") {
      dispatch(fetchWikis());
    }
  }, [wikiStatus, dispatch]);

  const CardDiscover = (wikiPram) => {
    if (!wikiPram[0]) return <p>On load</p>;

    return wikiPram[0].map((wiki) => {
      return (
        wiki.Status === "published" && (
          <div
            className="discover-rpg-card rpg"
            key={wiki.id}
            onClick={() => {
              navigate(`/wiki/${wiki.id}`);
            }}
          >
            <CardRpgDiscover
              id={wiki.id}
              srcImg={wiki.imageFile ? wiki.imageFile.path : defaultWikiImage}
              nameRpg={wiki.Name}
              owner={wiki.user?.pseudo}
            />
          </div>
        )
      );
    });
  };

  const RecentRpg = (myWikis) => {
    if (!myWikis[0]) return <p>On load</p>;

    // Filter and slice to get only the first 3 wikis by the admin
    const adminWikis = myWikis[0]
      .filter((wiki) => wiki.user?.pseudo === "admin")
      .slice(0, 3);

    return (
      <>
        {adminWikis.map((wiki) => (
          <div
            className="discover-rpg-card rpg"
            key={wiki.id}
            onClick={() => {
              navigate(`/wiki/edit/${wiki.id}`);
            }}
          >
            <CardRpgDiscover
              id={wiki.id}
              srcImg={wiki.imageFile ? wiki.imageFile.path : defaultWikiImage}
              nameRpg={wiki.Name}
              owner={wiki.user?.pseudo}
            />
          </div>
        ))}
        {adminWikis.length < 3 && (
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
        <div className="background-hexa image">
          <ConnectedNavbar />
          {isDisplayFormNew && <NewCaracterForm closeForm={displayForm} />}
          <div className="main-contaner personnal-home">
            <div className="my-content">
              <div className="left rpg-creation">
                <div className="box-content">{RecentRpg(wiki)}</div>
              </div>
              <div className="right content">
                <div className="my-caracters">
                  <div className="box-content inline-content">
                    <CardCreate
                      width="20%"
                      height="100%"
                      title={t("connectedHome.newCharactere")}
                      onClick={displayForm}
                    ></CardCreate>
                  </div>
                </div>
                <div className="my-games">
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
            <div className="discover list">{CardDiscover(wiki)}</div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default ConnectedHome;
