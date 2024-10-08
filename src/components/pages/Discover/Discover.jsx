import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { store, fetchWikis } from "../../../store/store";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./discover.css";

import forgeLogoTxt from "../../../assets/logo/logo_texte.svg";
import defaultWikiImage from "../../../assets/wiki_default.png";
import Footer from "../../UI/organisms/footer/Footer";
import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import CardRpgDiscover from "../../UI/organisms/CardRpgDiscover/CardRpgDiscover";

const Discover = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const wiki = useSelector((state) => state.wikis.wikisList);
  const wikiStatus = useSelector((state) => state.wikis.status);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(""); // État pour la recherche

  useEffect(() => {
    // Vérifiez si la liste des wikis est vide ou si le statut est "idle" avant de récupérer les wikis
    if (wikiStatus === "idle" || wiki.length === 0) {
      dispatch(fetchWikis());
    }
  }, [wikiStatus, dispatch, wiki.length]);

  // Filtrer les wikis en fonction du terme de recherche
  const filteredWikis = wiki?.filter((wiki) =>
    wiki.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const WikisElements = (wikiList) => {
    if (!wikiList) return <p>Chargement en cours...</p>;

    return wikiList.map((wiki) => {
      return (
        wiki.Status === "published" && (
          <div
            className="published-rpg-card"
            key={wiki.id}
            onClick={() => {
              navigate(`/wiki/${wiki.id}`);
            }}
          >
            <CardRpgDiscover
              id={wiki.id}
              srcImg={wiki.imageFile ? wiki.imageFile.path : defaultWikiImage}
              nameRpg={wiki.Name}
              owner={wiki.user?.username}
            />
          </div>
        )
      );
    });
  };

  return (
    <>
      <div className="background-hexa image discover"></div>
      <div className="background discover">
        <ConnectedNavbar />
        <div className="list-published-rpg-main-container">
          <div className="filter-bar">
            <input
              type="text"
              placeholder="Rechercher un RPG"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
          </div>
          <div className="grid-rpg-published">
            <div className="card-container-published-rpg">
              {wikiStatus === "loading" ? (
                <p>Chargement en cours...</p>
              ) : (
                WikisElements(filteredWikis)
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Discover;
