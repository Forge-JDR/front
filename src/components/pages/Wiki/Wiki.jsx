import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { store, fetchWiki } from "../../../store/store";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ErrorComponent from "../../ErrorBoundaries/ErrorComponent";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";

import forgeLogoTxt from "../../../assets/logo/logo_texte.svg";
import Footer from "../../UI/organisms/footer/Footer";

import "./wiki.css";

const Wiki = ({ ...props }) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const wiki = useSelector((state) => state.wikis.wikiInfo);
  const wikiStatus = useSelector((state) => state.wikis.status);

  // État pour gérer les onglets
  const [activeTab, setActiveTab] = useState("univers");

  useEffect(() => {
    if (wikiStatus === "idle") {
      dispatch(fetchWiki(id));
    }
  }, [wikiStatus, dispatch]);

  const handleTabChange = (tab) => {
    setActiveTab(tab); // Permet de changer d'onglet
  };

  const renderDeltaToHtml = (delta) => {
    if (!delta) return ""; // Retourne une chaîne vide si le contenu est manquant

    try {
      const deltaObj = JSON.parse(delta); // Parse le Delta string en objet
      const converter = new QuillDeltaToHtmlConverter(deltaObj.ops, {}); // Utilise QuillDeltaToHtmlConverter
      return converter.convert(); // Retourne le HTML converti
    } catch (error) {
      return "Erreur lors de l'affichage du contenu.";
    }
  };

  const WikiElements = (wikiPram) => {
    if (wikiStatus === "idle") return <p>Chargement...</p>;
    try {
      // Onglets avec le contenu correspondant
      const contentMap = {
        univers: renderDeltaToHtml(wikiPram.Content),
        race:
          wikiPram?.Races?.length === 0
            ? "Aucun contenu"
            : wikiPram.Races.map((race) => (
                <div key={race.id}>
                  <h4>{race.name}</h4>
                  <p>{race.content}</p>
                </div>
              )),
        classe:
          wikiPram?.Jobs?.length === 0
            ? "Aucun contenu"
            : wikiPram.Jobs.map((job) => (
                <div key={job.id}>
                  <h4>{job.name}</h4>
                  <p>{job.content}</p>
                </div>
              )),

        bestiaire:
          wikiPram?.bestiaries?.length === 0
            ? "Aucun contenu"
            : wikiPram.bestiaries.map((bes) => (
                <div key={bes.id}>
                  <h4>{bes.name}</h4>
                  <p>{bes.content}</p>
                  <p>Type : {bes.type}</p>
                  <img src={bes.imageUrl} alt={bes.name} width={100} />
                </div>
              )),
      };

      return (
        <div className="wiki-content">
          {/* Affichage dynamique du contenu en fonction de l'onglet actif */}
          <div
            dangerouslySetInnerHTML={{
              __html: contentMap[activeTab] || "Aucun contenu disponible.",
            }}
          />
        </div>
      );
    } catch (error) {
      return <ErrorComponent />;
    }
  };

  return (
    <>
      <ConnectedNavbar></ConnectedNavbar>
      <div className="background-hexa image rpg-view" />
      <div className="main-contaner-rpg-view">
        {/* Bandeau avec l'image du Wiki */}
        {wiki.imageFile && (
          <div className="wiki-banner">
            <img src={wiki.imageFile.fichierImage} alt={wiki.Name} />
          </div>
        )}

        {/* Titre du Wiki */}
        <div className="wiki-title">
          <h1>{wiki.Name}</h1>
        </div>

        <div className="wiki-container">
          {/* Barre latérale avec les onglets */}
          <div className="wiki-sidebar">
            <ul>
              <li
                className={activeTab === "univers" ? "active" : ""}
                onClick={() => handleTabChange("univers")}
              >
                Univers
              </li>
              <li
                className={activeTab === "race" ? "active" : ""}
                onClick={() => handleTabChange("race")}
              >
                Races
              </li>
              <li
                className={activeTab === "classe" ? "active" : ""}
                onClick={() => handleTabChange("classe")}
              >
                Classes
              </li>
              <li
                className={activeTab === "bestiaire" ? "active" : ""}
                onClick={() => handleTabChange("bestiaire")}
              >
                Bestiaire
              </li>
            </ul>
          </div>

          {/* Contenu à droite */}
          <div className="wiki-content-container">
            <div onLoad={() => store.dispatch(fetchWiki(id))}>
              {WikiElements(wiki)}
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Wiki;
