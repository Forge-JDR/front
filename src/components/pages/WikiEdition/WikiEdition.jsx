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

  // État pour le nom du JDR (wiki)
  const [wikiName, setWikiName] = useState("");
  const [wikiContent, setWikiContent] = useState(""); // État pour le contenu principal du JDR (Univers)

  // État pour le bestiaire
  const [bestiaire, setBestiaire] = useState([]);
  const [newBeast, setNewBeast] = useState({
    name: "",
    content: "",
    type: "",
    imageUrl: "",
  });

  // État pour les classes
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({
    name: "",
    content: "",
  });

  // État pour les races
  const [races, setRaces] = useState([]);
  const [newRace, setNewRace] = useState({
    name: "",
    content: "",
    imageUrl: "",
  });

  // État pour gérer l'onglet actif
  const [activeTab, setActiveTab] = useState("univers");

  useEffect(() => {
    if (wikiStatus === "idle") {
      dispatch(fetchWiki(id));
    }
  }, [wikiStatus, dispatch, id]);

  useEffect(() => {
    if (wiki && wiki.Name) {
      setWikiName(wiki.Name);
      setWikiContent(wiki.Content); // Mettre à jour le contenu JSON du wiki (Univers)
      setBestiaire(wiki.Bestiaries || []); // Mettre à jour le bestiaire si existant
      setClasses(wiki.Jobs || []); // Mettre à jour les classes si existantes
      setRaces(wiki.Races || []); // Mettre à jour les races si existantes
    }
  }, [wiki]);

  // Fonction de sauvegarde du contenu principal (Univers)
  const handleSave = (updatedContent) => {
    const dataToUpdate = {
      Name: wikiName, // Utilise le nom modifié
      Content: JSON.stringify(updatedContent), // Sauvegarde du contenu modifié (Univers)
      // Bestiaries: bestiaire, // Sauvegarde du bestiaire
      // Jobs: classes, // Sauvegarde des classes
      // Races: races, // Sauvegarde des races
    };

    dispatch(updateWiki({ id, dataToUpdate }));
  };

  // Gestion des changements dans les champs de texte du bestiaire
  const handleBeastChange = (e) => {
    const { name, value } = e.target;
    setNewBeast((prev) => ({ ...prev, [name]: value }));
  };

  // Ajouter un nouvel objet au bestiaire
  const handleAddBeast = () => {
    if (
      newBeast.name &&
      newBeast.content &&
      newBeast.imageUrl &&
      newBeast.type
    ) {
      setBestiaire((prev) => [...prev, newBeast]);
      setNewBeast({ name: "", content: "", type: "", imageUrl: "" }); // Réinitialise les champs de texte
    }
  };

  const handleNameChange = (e) => {
    setWikiName(e.target.value); // Met à jour le nom du JDR
  };

  // Gestion des changements dans les champs de texte des classes
  const handleClassChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prev) => ({ ...prev, [name]: value }));
  };

  // Ajouter une nouvelle classe
  const handleAddClass = () => {
    if (newClass.name && newClass.content) {
      setClasses((prev) => [...prev, newClass]);
      setNewClass({ name: "", content: "" }); // Réinitialise les champs de texte
    }
  };

  // Gestion des changements dans les champs de texte des races
  const handleRaceChange = (e) => {
    const { name, value } = e.target;
    setNewRace((prev) => ({ ...prev, [name]: value }));
  };

  // Ajouter une nouvelle race
  const handleAddRace = () => {
    if (newRace.name && newRace.content && newRace.imageUrl) {
      setRaces((prev) => [...prev, newRace]);
      setNewRace({ name: "", content: "", imageUrl: "" }); // Réinitialise les champs de texte
    }
  };

  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
                onChange={() => handleNameChange()}
              />
            </div>

            {/* Section des onglets */}
            <div className="tabs">
              <button
                className={activeTab === "univers" ? "active-tab" : ""}
                onClick={() => handleTabChange("univers")}
              >
                Univers
              </button>
              <button
                className={activeTab === "classe" ? "active-tab" : ""}
                onClick={() => handleTabChange("classe")}
              >
                Classe
              </button>
              <button
                className={activeTab === "race" ? "active-tab" : ""}
                onClick={() => handleTabChange("race")}
              >
                Race
              </button>
              <button
                className={activeTab === "bestiaire" ? "active-tab" : ""}
                onClick={() => handleTabChange("bestiaire")}
              >
                Bestiaire
              </button>
            </div>

            {/* Contenu de l'onglet "Univers" */}
            {activeTab === "univers" && (
              <div className="rpg-editor">
                <WikiEditor defaultContent={wikiContent} onSave={handleSave} />
              </div>
            )}

            {/* Contenu de l'onglet "Classe" */}
            {activeTab === "classe" && (
              <div className="class-section">
                <div className="form">
                  <h3>Ajouter une nouvelle classe</h3>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nom de la classe"
                    value={newClass.name}
                    onChange={handleClassChange}
                  />
                  <textarea
                    name="content"
                    placeholder="Description de la classe"
                    value={newClass.content}
                    onChange={handleClassChange}
                  />
                  <button className="save-button" onClick={handleAddClass}>
                    Ajouter la classe
                  </button>
                </div>

                {/* Liste des classes */}
                <div className="class-list">
                  <h4>Classes</h4>
                  {classes.length === 0 ? (
                    <p>Aucune classe ajoutée</p>
                  ) : (
                    <ul>
                      {classes.map((classItem, index) => (
                        <li key={index}>
                          <h5>{classItem.name}</h5>
                          <p>{classItem.content}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Contenu de l'onglet "Race" */}
            {activeTab === "race" && (
              <div className="race-section">
                <h3>Ajouter une nouvelle race</h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Nom de la race"
                  value={newRace.name}
                  onChange={handleRaceChange}
                />
                <textarea
                  name="content"
                  placeholder="Description de la race"
                  value={newRace.content}
                  onChange={handleRaceChange}
                />
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Lien de l'image"
                  value={newRace.imageUrl}
                  onChange={handleRaceChange}
                />
                <button className="save-button" onClick={handleAddRace}>
                  Ajouter la race
                </button>

                {/* Liste des races */}
                <div className="race-list">
                  <h4>Races</h4>
                  {races.length === 0 ? (
                    <p>Aucune race ajoutée</p>
                  ) : (
                    <ul>
                      {races.map((race, index) => (
                        <li key={index}>
                          <h5>{race.name}</h5>
                          <p>{race.content}</p>
                          <img
                            src={race.imageUrl}
                            alt={race.name}
                            width={100}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Contenu de l'onglet "Bestiaire" */}
            {activeTab === "bestiaire" && (
              <div className="bestiary-section">
                <h3>Ajouter un nouvel objet au bestiaire</h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Nom du monstre"
                  value={newBeast.name}
                  onChange={handleBeastChange}
                />
                <textarea
                  name="content"
                  placeholder="Description"
                  value={newBeast.content}
                  onChange={handleBeastChange}
                />
                <input
                  type="text"
                  name="type"
                  placeholder="Type de monstre"
                  value={newBeast.type}
                  onChange={handleBeastChange}
                />
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Lien de l'image"
                  value={newBeast.imageUrl}
                  onChange={handleBeastChange}
                />
                <button className="save-button" onClick={handleAddBeast}>
                  Ajouter au Bestiaire
                </button>

                {/* Liste des objets du bestiaire */}
                <div className="bestiary-list">
                  <h4>Bestiaire</h4>
                  {bestiaire.length === 0 ? (
                    <p>Aucun objet dans le bestiaire</p>
                  ) : (
                    <ul>
                      {bestiaire.map((beast, index) => (
                        <li key={index}>
                          <h5>{beast.name}</h5>
                          <p>{beast.content}</p>
                          <p>Type : {beast.type}</p>
                          <img
                            src={beast.imageUrl}
                            alt={beast.name}
                            width={100}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default WikiEdition;
