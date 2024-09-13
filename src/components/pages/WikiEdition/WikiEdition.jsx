import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateWiki, fetchWiki } from "../../../store/store";
import ErrorComponent from "../../ErrorBoundaries/ErrorComponent";
import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import WikiEditor from "../../UI/organisms/wikiEditor/WikiEditor";
import Footer from "../../UI/organisms/footer/Footer";

import "./wikiEdition.css";

const WikiEdition = ({ ...props }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const wiki = useSelector((state) => state.wikis.wikiInfo);
  const wikiStatus = useSelector((state) => state.wikis.status);

  // Ajouter un état local pour le nom du JDR (wiki)
  const [wikiName, setWikiName] = useState("");
  const [wikiContent, setWikiContent] = useState(""); // Nouvel état pour le contenu

  useEffect(() => {
    if (wikiStatus === "idle") {
      dispatch(fetchWiki(id));
    }
  }, [wikiStatus, dispatch, id]);

  // Met à jour le nom du wiki et son contenu lorsqu'ils sont chargés
  useEffect(() => {
    if (wiki && wiki.Name) {
      setWikiName(wiki.Name);
      setWikiContent(wiki.Content); // Mettre à jour le contenu JSON du wiki
    }
  }, [wiki]);

  // Fonction de sauvegarde qui sera appelée par WikiEditor
  const handleSave = (updatedContent) => {
    const dataToUpdate = {
      Name: wikiName, // Utilise le nom modifié
      Content: JSON.stringify(updatedContent), // Sauvegarde du contenu modifié
    };

    dispatch(updateWiki({ id, dataToUpdate }));
  };

  const handleNameChange = (e) => {
    setWikiName(e.target.value); // Met à jour l'état local du nom
  };

  const WikiElements = (wikiPram) => {
    if (wikiStatus === "idle" || !wikiPram) return <p>Chargement...</p>;

    try {
      return (
        <div key={wikiPram.id}>
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
        </div>
      );
    } catch (error) {
      return <ErrorComponent />;
    }
  };

  return (
    <>
      <div className="background-hexa image edition-rpg">
        <div className="background-edition">
          <ConnectedNavbar />
          <div className="main-contaner rpg-editor">
            <div className="title-rpg-editor">
              <input
                type="text"
                id="wikiName"
                value={wikiName}
                onChange={handleNameChange}
              />
            </div>
            <div className="rpg-editor">
              {/* Passer le contenu actuel (wikiContent) à WikiEditor */}
              <WikiEditor defaultContent={wikiContent} onSave={handleSave}>
                <div>{WikiElements(wiki)}</div>
              </WikiEditor>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default WikiEdition;
