import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateWiki, fetchWiki } from "../../../store/store";
import ErrorComponent from "../../ErrorBoundaries/ErrorComponent";
import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import WikiEditor from "../../UI/organisms/wikiEditor/WikiEditor";
import Footer from "../../UI/organisms/footer/Footer";

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

  // Fonction de sauvegarde qui sera appelée par WikiEditor
  const handleSave = (updatedContent) => {
    const dataToUpdate = {
      Name: wiki.Name,
      Content: JSON.stringify(updatedContent)
    };
    
    dispatch(updateWiki({ id,  dataToUpdate }));
  };

  const WikiElements = (wikiPram) => {
    if (wikiStatus === "idle") return <p>On load</p>;
    try {
      return (
        <div id={wikiPram._id} key={wikiPram.id}>
          Wiki n°{wikiPram.id}
          <br />
          Nom : {wikiPram.Name} <br />
          Status: {wikiPram.Status}
          <br />
          Owner : {wikiPram.user.pseudo}
          <br />
          Content : {wikiPram.Content}
          <br />
          Created At : {wikiPram.createdAt}
          <br />
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
          <br />
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
          <ConnectedNavbar />

          <div className="main-contaner personnal-caracter">
            {/* Passer la fonction handleSave à WikiEditor */}
            <WikiEditor defaultContent={wiki} onSave={handleSave}>
              <div onLoad={() => dispatch(fetchWiki(id))}>
                {WikiElements(wiki)}
              </div>
            </WikiEditor>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WikiEdition;
