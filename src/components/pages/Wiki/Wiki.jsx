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
        univers: (
          <div
            dangerouslySetInnerHTML={{
              __html: renderDeltaToHtml(wikiPram.Content),
            }}
          />
        ),
        race: (
          <div>
            {wikiPram?.Races?.length === 0
              ? "Aucun contenu"
              : wikiPram.Races.map((race) => (
                  <div key={race.id}>
                    <h4>{race.Name}</h4>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderDeltaToHtml(race.Content),
                      }}
                    />
                  </div>
                ))}
          </div>
        ),
        classe:
          wikiPram?.Jobs?.length === 0
            ? "Aucun contenu"
            : wikiPram.Jobs.map((job) => (
                <div key={job.id}>
                  <h4>{job.name}</h4>
                  {/* Conversion du contenu Delta pour les Jobs */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderDeltaToHtml(job.content),
                    }}
                  />
                </div>
              )),
        bestiaire:
          wikiPram?.bestiaries?.length === 0
            ? "Aucun contenu"
            : wikiPram.bestiaries.map((bes) => (
                <div key={bes.id}>
                  <h4>{bes.Name}</h4>
                  {/* Conversion du contenu Delta pour les bestiaires */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderDeltaToHtml(bes.Content),
                    }}
                  />
                  <p>Type : {bes.Type}</p>
                  {bes.imageUrl && (
                    <img src={bes.imageUrl} alt={bes.Name} width={100} />
                  )}
                </div>
              )),
      };

      return (
        <div className="wiki-content">
          {/* Affichage dynamique du contenu en fonction de l'onglet actif */}
          <div /> {contentMap[activeTab] || "Aucun contenu disponible."},
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
