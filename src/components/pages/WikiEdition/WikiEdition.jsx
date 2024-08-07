import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { store, fetchWiki } from "../../../store/store";
import { useParams } from "react-router-dom";
import ErrorComponent from "../../ErrorBoundaries/ErrorComponent";

import WikiEditor from "../../UI/organisms/wikiEditor/WikiEditor";

import forgeLogoTxt from "../../../assets/logo/logo_texte.svg";
import defaultWikiImage from "../../../assets/wiki_default.png";

import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import CardCreate from "../../UI/molecules/CardCreate/CardCreate";
import NewRpgForm from "../../templates/NewRpgForm/NewRpgForm";
import CardRpg from "../../UI/organisms/CardRpg/CardRpg";

const WikiEdition = ({ ...props }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const wiki = useSelector((state) => state.wikis.wikiInfo);
  const wikiStatus = useSelector((state) => state.wikis.status);

  useEffect(() => {
    if (wikiStatus === "idle") {
      dispatch(fetchWiki(id));
    }
  }, [wikiStatus, dispatch]);

  const WikiElements = (wikiPram) => {
    if (wikiStatus === "idle") return <p>On load</p>;
    try {
      return (
        <div id={wikiPram._id} key={wikiPram.id}>
          Wiki n°{wikiPram.id}
          <br></br>
          Nom : {wikiPram.Name} <br></br>
          Status: {wikiPram.Status}
          <br></br>
          Owner : {wikiPram.user.pseudo}
          <br></br>
          Content : {wikiPram.Content}
          <br></br>
          CreateAt : {wikiPram.createdAt}
          <br></br>
          {wikiPram.imageFile ? (
            <img
              src={wikiPram.imageFile.fichierImage}
              alt="image"
              width={150}
              height={150}
            />
          ) : (
            "Pas d'image"
          )}
          <br></br>
          Jobs :{" "}
          {wikiPram.Jobs.map((job) => {
            return (
              <div key={job.id}>
                Nom du job :{job.name}
                <br></br> Content : {job.Content}
              </div>
            );
          })}{" "}
          <br></br>
          Races :{" "}
          {wikiPram.Races.map((race) => {
            return (
              <div key={race.id}>
                Nom du job :{race.name}
                <br></br> Content : {race.Content}
              </div>
            );
          })}{" "}
          <br></br>
          Bestiaire :{" "}
          {wikiPram.bestiaries.map((bes) => {
            return (
              <div key={bes.id}>
                Nom du job :{bes.name}
                <br></br> Content : {bes.Content}
                <br></br> Type : {bes.Type}
                <br></br> Image : {bes.imageUrl}
              </div>
            );
          })}{" "}
          <br></br>
          Scenarios :{" "}
          {wikiPram.Scenarios.map((scenario) => {
            return (
              <div key={scenario.id}>
                Nom du job :{scenario.name}
                <br></br> Content : {scenario.Content}
              </div>
            );
          })}{" "}
          <br></br>
        </div>
      );
    } catch (error) {
      return <ErrorComponent />;
    }
  };

  return (
    <>
      <div className="background creation">
        <div className="background-hexa image">
          <ConnectedNavbar></ConnectedNavbar>

          <div className="main-contaner personnal-caracter">
            <WikiEditor>
              <div onLoad={() => store.dispatch(fetchWiki(id))}>
                {WikiElements(wiki)}
              </div>
            </WikiEditor>
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

export default WikiEdition;
