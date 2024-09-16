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

  const [activeTab, setActiveTab] = useState("univers");

  useEffect(() => {
    if (wikiStatus === "idle") {
      dispatch(fetchWiki(id));
    }
  }, [wikiStatus, dispatch]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderDeltaToHtml = (delta) => {
    if (!delta) return "";

    try {
      const deltaObj = JSON.parse(delta);
      const converter = new QuillDeltaToHtmlConverter(deltaObj.ops, {});
      return converter.convert();
    } catch (error) {
      return "Erreur lors de l'affichage du contenu.";
    }
  };

  const WikiElements = (wikiPram) => {
    if (wikiStatus === "idle") return <p>Chargement...</p>;
    try {
      const contentMap = {
        univers: (
          <div className="rpg-items-list">
            <div className="rpg-items-content">
              <h4>Univers</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html: renderDeltaToHtml(wikiPram.Content),
                }}
              />
            </div>
            <div className="separator-item"></div>
          </div>
        ),
        race: (
          <div className="rpg-items-list">
            {wikiPram?.Races?.length === 0
              ? "Aucun contenu"
              : wikiPram.Races.map((race) => (
                  <div key={race.id} className="rpg-items-content">
                    <h4>{race.Name}</h4>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderDeltaToHtml(race.Content),
                      }}
                    />
                    <div className="separator-item"></div>
                  </div>
                ))}
          </div>
        ),
        classe: (
          <div className="rpg-items-list">
            {wikiPram?.Jobs?.length === 0
              ? "Aucun contenu"
              : wikiPram.Jobs.map((job) => (
                  <div key={job.id} className="rpg-items-content">
                    <h4>{job.name}</h4>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderDeltaToHtml(job.content),
                      }}
                    />
                    <div className="separator-item"></div>
                  </div>
                ))}
          </div>
        ),
        bestiaire: (
          <div className="rpg-items-list">
            {wikiPram?.bestiaries?.length === 0
              ? "Aucun contenu"
              : wikiPram.bestiaries.map((bes) => (
                  <div key={bes.id} className="rpg-items-content">
                    <h4>{bes.Name}</h4>
                    <p className="beast-type">Type : {bes.Type}</p>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderDeltaToHtml(bes.Content),
                      }}
                    />

                    {bes.imageUrl && (
                      <img src={bes.imageUrl} alt={bes.Name} width={100} />
                    )}
                    <div className="separator-item"></div>
                  </div>
                ))}
          </div>
        ),
        scenario: (
          <div className="rpg-items-list">
            {wikiPram?.Scenarios?.length === 0
              ? "Aucun contenu"
              : wikiPram.Scenarios.map((scenario) => (
                  <div key={scenario.id} className="rpg-items-content">
                    <h4>{scenario.name}</h4>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderDeltaToHtml(scenario.content),
                      }}
                    />
                    <div className="separator-item"></div>
                  </div>
                ))}
          </div>
        ),
      };

      return (
        <div className="wiki-content">
          {contentMap[activeTab] || "Aucun contenu disponible."}
        </div>
      );
    } catch (error) {
      return <ErrorComponent />;
    }
  };

  return (
    <>
      <ConnectedNavbar />
      <div className="background-hexa image rpg-view" />
      <div className="main-contaner-rpg-view">
        {wiki.imageFile && (
          <div className="wiki-banner">
            <img src={wiki.imageFile.fichierImage} alt={wiki.Name} />
          </div>
        )}

        <div className="wiki-title">
          <h1>{wiki.Name}</h1>
          <div className="owner-rpg">Par {wiki?.user?.pseudo}</div>
        </div>

        <div className="wiki-container">
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
              <li
                className={activeTab === "scenario" ? "active" : ""}
                onClick={() => handleTabChange("scenario")}
              >
                Scénarios
              </li>
            </ul>
          </div>

          <div className="wiki-content-container">
            <div onLoad={() => store.dispatch(fetchWiki(id))}>
              {WikiElements(wiki)}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wiki;
