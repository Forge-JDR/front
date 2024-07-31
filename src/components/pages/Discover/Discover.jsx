import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { store, fetchWikis } from "../../../store/store";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./discover.css";

import forgeLogoTxt from "../../../assets/logo/logo_texte.svg";
import defaultWikiImage from "../../../assets/wiki_default.png";

import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import CardRpgDiscover from "../../UI/organisms/CardRpgDiscover/CardRpgDiscover";

const Discover = ({ ...props }) => {
  const dispatch = useDispatch();
  const wiki = useSelector((state) => state.wikis.wikisList);
  const wikiStatus = useSelector((state) => state.wikis.status);
  const navigate = useNavigate();

  useEffect(() => {
    if (wikiStatus === "idle") {
      dispatch(fetchWikis());
    }
  }, [wikiStatus, dispatch]);

  useEffect(() => {
    console.log(wiki);
  });

  const WikisElements = (wikiPram) => {
    if (!wikiPram[0]) return <p>On load</p>;

    return wikiPram[0].map((wiki) => {
      return (
        wiki.Status === "published" && (
          <div
            className="personnal-rpg-card rpg"
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

  return (
    <>
      <div className="background creation">
        <div className="background-hexa image">
          <ConnectedNavbar />
          <div className="main-contaner personnal-rpg">
            <div onLoad={() => store.dispatch(fetchWikis())}>
              <div className="card-container rpg creation inline-content">
                {WikisElements(wiki)}
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

export default Discover;
