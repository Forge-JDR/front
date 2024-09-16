import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateWiki,
  fetchWiki,
  addBestiary,
  uploadWikiImage,
  updateBestiary,
  deleteBestiary,
  addRace,
  updateRace,
  deleteRace,
  addJob,
  updateJob,
  deleteJob,
  addScenario,
  updateScenario,
  deleteScenario,
} from "../../../store/store";
import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import WikiEditor from "../../UI/organisms/wikiEditor/WikiEditor";
import QuillEditor from "../../UI/molecules/QuillEditor/QuillEditor";
import Footer from "../../UI/organisms/footer/Footer";
import "./wikiEdition.css";
import { Router, useNavigate } from "react-router-dom";
import Button from "../../UI/atoms/button/button";
import addImage from "../../../assets/add-image-icon.png";

const WikiEdition = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wiki = useSelector((state) => state.wikis.wikiInfo);
  const wikiStatus = useSelector((state) => state.wikis.status);

  // State for the wiki's name and content
  const [wikiName, setWikiName] = useState("");
  const [wikiContent, setWikiContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // State for managing bestiaries
  const [bestiaire, setBestiaire] = useState([]);
  const [newBeast, setNewBeast] = useState({
    id: null,
    name: "",
    content: { ops: [] },
    type: "",
  });

  // State for managing races
  const [races, setRaces] = useState([]);
  const [newRace, setNewRace] = useState({
    id: null,
    name: "",
    content: { ops: [] },
  });

  // State for managing jobs
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    id: null,
    name: "",
    content: { ops: [] },
  });

  // State for managing scenarios
  const [scenarios, setScenarios] = useState([]);
  const [newScenario, setNewScenario] = useState({
    id: null,
    name: "",
    content: { ops: [] },
  });

  // State for handling the active tab
  const [activeTab, setActiveTab] = useState("univers");

  // Handle image file change
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // Handle image upload
  const handleImageUpload = () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("file", selectedImage);

      dispatch(uploadWikiImage({ id, formData }))
        .then(() => {
          // Optionally fetch the updated wiki to display the new image
          dispatch(fetchWiki(id));
        })
        .catch((error) => {
          console.log("Erreur lors de l'upload de l'image :", error);
        });
    }
  };

  useEffect(() => {
    if (wikiStatus === "idle") {
      dispatch(fetchWiki(id));
    }
  }, [wikiStatus, dispatch, id]);

  useEffect(() => {
    if (wiki && wiki.Name) {
      setWikiName(wiki.Name);
      setWikiContent(wiki.Content || "");
      setBestiaire(wiki.bestiaries || []);
      setRaces(wiki.races || []);
      setJobs(wiki.jobs || []); // Load jobs
      setScenarios(wiki.scenarios || []); // Load scenarios
    }
  }, [wiki]);

  // Handle changing the wiki's status
  const handleChangeStatus = (newStatus) => {
    const dataToUpdate = { Status: newStatus };
    dispatch(updateWiki({ id, dataToUpdate }))
      .then(() => {
        // Optionally, fetch the updated wiki info after the status change
        dispatch(fetchWiki(id));
      })
      .catch((error) => {
        console.log("Erreur lors de la mise à jour du statut du wiki :", error);
      });
  };

  // Handle saving the main content (universe)
  const handleSave = (updatedContent) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      if (activeTab === "univers") {
        const dataToUpdate = {
          Name: wikiName,
          Content: JSON.stringify(updatedContent),
        };
        dispatch(updateWiki({ id, dataToUpdate }));
      }
    }
  };

  // Handlers for bestiary
  const handleBeastChange = (e) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      const { name, value } = e.target;
      setNewBeast((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleContentChange = (content) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      setNewBeast((prev) => ({ ...prev, content }));
    }
  };

  const handleAddOrUpdateBeast = () => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      if (newBeast.name && newBeast.content && newBeast.type) {
        if (newBeast.id) {
          const dataToUpdate = {
            Name: newBeast.name,
            Content: JSON.stringify(newBeast.content),
            Type: newBeast.type,
          };

          dispatch(
            updateBestiary({ WikiId: id, id: newBeast.id, dataToUpdate })
          )
            .then((response) => {
              if (response.payload) {
                setBestiaire((prev) =>
                  prev.map((beast) =>
                    beast.id === newBeast.id ? response.payload : beast
                  )
                );
                setNewBeast({
                  id: null,
                  name: "",
                  content: { ops: [] },
                  type: "",
                });
                setActiveTab("bestiaire");
              }
            })
            .catch((error) => {
              console.log(
                "Erreur lors de la mise à jour du bestiaire :",
                error
              );
            });
        } else {
          dispatch(
            addBestiary({
              WikiId: id,
              Name: newBeast.name,
              Content: JSON.stringify(newBeast.content),
              Type: newBeast.type,
            })
          )
            .then((response) => {
              if (response.payload) {
                setBestiaire((prev) => [...prev, response.payload]);
                setNewBeast({
                  id: null,
                  name: "",
                  content: { ops: [] },
                  type: "",
                });
                setActiveTab("bestiaire");
              }
            })
            .catch((error) => {
              console.log("Erreur lors de l'ajout au bestiaire :", error);
            });
        }
      } else {
        alert("Veuillez remplir tous les champs du bestiaire avant d'ajouter.");
      }
    }
  };

  const handleDeleteBeast = (beastId) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      dispatch(deleteBestiary({ WikiId: id, id: beastId }))
        .then(() => {
          setBestiaire((prev) => prev.filter((beast) => beast.id !== beastId));
          setNewBeast({ id: null, name: "", content: { ops: [] }, type: "" });
          setActiveTab("bestiaire");
        })
        .catch((error) => {
          console.log("Erreur lors de la suppression du bestiaire :", error);
        });
    }
  };

  const handleEditBeast = (beast) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      setNewBeast({
        id: beast.id,
        name: beast.Name || "",
        content: beast.Content ? JSON.parse(beast.Content) : { ops: [] },
        type: beast.Type || "",
      });
    }
  };

  // Handlers for race
  const handleRaceChange = (e) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      const { name, value } = e.target;
      setNewRace((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRaceContentChange = (content) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      setNewRace((prev) => ({ ...prev, content }));
    }
  };

  const handleAddOrUpdateRace = () => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      if (newRace.name && newRace.content) {
        if (newRace.id) {
          const dataToUpdate = {
            Name: newRace.name,
            Content: JSON.stringify(newRace.content),
          };

          dispatch(updateRace({ WikiId: id, id: newRace.id, dataToUpdate }))
            .then((response) => {
              if (response.payload) {
                setRaces((prev) =>
                  prev.map((race) =>
                    race.id === newRace.id ? response.payload : race
                  )
                );
                setNewRace({ id: null, name: "", content: { ops: [] } });
                setActiveTab("races");
              }
            })
            .catch((error) => {
              console.log("Erreur lors de la mise à jour de la race :", error);
            });
        } else {
          dispatch(
            addRace({
              WikiId: id,
              Name: newRace.name,
              Content: JSON.stringify(newRace.content),
            })
          )
            .then((response) => {
              if (response.payload) {
                setRaces((prev) => [...prev, response.payload]);
                setNewRace({ id: null, name: "", content: { ops: [] } });
                setActiveTab("races");
              }
            })
            .catch((error) => {
              console.log("Erreur lors de l'ajout de la race :", error);
            });
        }
      } else {
        alert("Veuillez remplir tous les champs de la race avant d'ajouter.");
      }
    }
  };

  const handleDeleteRace = (raceId) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      dispatch(deleteRace({ WikiId: id, id: raceId }))
        .then(() => {
          setRaces((prev) => prev.filter((race) => race.id !== raceId));
          setNewRace({ id: null, name: "", content: { ops: [] } });
          setActiveTab("races");
        })
        .catch((error) => {
          console.log("Erreur lors de la suppression de la race :", error);
        });
    }
  };

  const handleEditRace = (race) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      setNewRace({
        id: race.id,
        name: race.Name || "",
        content: race.Content ? JSON.parse(race.Content) : { ops: [] },
      });
    }
  };

  // Handlers for jobs (similar to races)
  const handleJobChange = (e) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      const { name, value } = e.target;
      setNewJob((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleJobContentChange = (content) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      setNewJob((prev) => ({ ...prev, content }));
    }
  };

  const handleAddOrUpdateJob = () => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      if (newJob.name && newJob.content) {
        if (newJob.id) {
          const dataToUpdate = {
            name: newJob.name,
            Content: JSON.stringify(newJob.content),
          };

          dispatch(updateJob({ WikiId: id, id: newJob.id, dataToUpdate }))
            .then((response) => {
              if (response.payload) {
                setJobs((prev) =>
                  prev.map((job) =>
                    job.id === newJob.id ? response.payload : job
                  )
                );
                setNewJob({ id: null, name: "", content: { ops: [] } });
                setActiveTab("jobs");
              }
            })
            .catch((error) => {
              console.log("Erreur lors de la mise à jour du job :", error);
            });
        } else {
          dispatch(
            addJob({
              WikiId: id,
              name: newJob.name,
              Content: JSON.stringify(newJob.content),
            })
          )
            .then((response) => {
              if (response.payload) {
                setJobs((prev) => [...prev, response.payload]);
                setNewJob({ id: null, name: "", content: { ops: [] } });
                setActiveTab("jobs");
              }
            })
            .catch((error) => {
              console.log("Erreur lors de l'ajout du job :", error);
            });
        }
      } else {
        alert("Veuillez remplir tous les champs du job avant d'ajouter.");
      }
    }
  };

  const handleDeleteJob = (jobId) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      dispatch(deleteJob({ WikiId: id, id: jobId }))
        .then(() => {
          setJobs((prev) => prev.filter((job) => job.id !== jobId));
          setNewJob({ id: null, name: "", content: { ops: [] } });
          setActiveTab("jobs");
        })
        .catch((error) => {
          console.log("Erreur lors de la suppression du job :", error);
        });
    }
  };

  const handleEditJob = (job) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      setNewJob({
        id: job.id,
        name: job.name || "",
        content: job.Content ? JSON.parse(job.Content) : { ops: [] },
      });
    }
  };

  // Handlers for scenarios
  const handleScenarioChange = (e) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      const { name, value } = e.target;
      setNewScenario((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleScenarioContentChange = (content) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      setNewScenario((prev) => ({ ...prev, content }));
    }
  };

  const handleAddOrUpdateScenario = () => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      if (newScenario.name && newScenario.content) {
        if (newScenario.id) {
          const dataToUpdate = {
            name: newScenario.name,
            content: JSON.stringify(newScenario.content),
          };

          dispatch(
            updateScenario({ WikiId: id, id: newScenario.id, dataToUpdate })
          )
            .then((response) => {
              if (response.payload) {
                setScenarios((prev) =>
                  prev.map((scenario) =>
                    scenario.id === newScenario.id ? response.payload : scenario
                  )
                );
                setNewScenario({ id: null, name: "", content: { ops: [] } });
                setActiveTab("scenarios");
              }
            })
            .catch((error) => {
              console.log("Erreur lors de la mise à jour du scénario :", error);
            });
        } else {
          dispatch(
            addScenario({
              WikiId: id,
              name: newScenario.name,
              content: JSON.stringify(newScenario.content),
            })
          )
            .then((response) => {
              if (response.payload) {
                setScenarios((prev) => [...prev, response.payload]);
                setNewScenario({ id: null, name: "", content: { ops: [] } });
                setActiveTab("scenarios");
              }
            })
            .catch((error) => {
              console.log("Erreur lors de l'ajout du scénario :", error);
            });
        }
      } else {
        alert("Veuillez remplir tous les champs du scénario avant d'ajouter.");
      }
    }
  };

  const handleDeleteScenario = (scenarioId) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      dispatch(deleteScenario({ WikiId: id, id: scenarioId }))
        .then(() => {
          setScenarios((prev) =>
            prev.filter((scenario) => scenario.id !== scenarioId)
          );
          setNewScenario({ id: null, name: "", content: { ops: [] } });
          setActiveTab("scenarios");
        })
        .catch((error) => {
          console.log("Erreur lors de la suppression du scénario :", error);
        });
    }
  };

  const handleEditScenario = (scenario) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      setNewScenario({
        id: scenario.id,
        name: scenario.name || "",
        content: scenario.content ? JSON.parse(scenario.content) : { ops: [] },
      });
    }
  };

  const handleNameChange = (e) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      setWikiName(e.target.value);
    }
  };

  const handleTabChange = (tab) => {
    if (wiki.Status === "published" || wiki.Status === "pendingToPublish") {
      alert(
        "La modification n'est pas possible pour un wiki publié ou en attente de publication."
      );
      navigate(`/wiki/${id}`);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <div className="background-hexa image edition-rpg"></div>
      <div className="background-edition">
        <ConnectedNavbar />
        <div className="main-contaner rpg-editor">
          <div className="title-status-bar">
            <div className="title-rpg-editor">
              <input
                type="text"
                id="wikiName"
                value={wikiName}
                onChange={handleNameChange}
                disabled={
                  wiki.Status === "published" ||
                  wiki.Status === "pendingToPublish"
                }
              />
            </div>
            {/* Image Display Section */}

            <div className="image-rpg-upload">
              <img
                src={wiki.imageFile ? wiki.imageFile.fichierImage : addImage}
                alt={"Ajouter image"}
                onClick={() => document.getElementById("file-upload").click()}
              />
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <button onClick={handleImageUpload}>Upload Image</button>
            </div>
            {/* Display Wiki Status */}
            <div className="wiki-status">
              {/* Your existing status change buttons here */}
            </div>

            {/* Display Wiki Status */}
            <div className="wiki-status">
              {wiki.Status === "inProgress" && (
                <Button
                  className="edit"
                  onClick={() => handleChangeStatus("pendingToPublish")}
                >
                  Demander la publication
                </Button>
              )}
              {wiki.Status === "pendingToPublish" && (
                <Button
                  className="edit"
                  onClick={() => handleChangeStatus("inProgress")}
                >
                  Annuler la demande de publication
                </Button>
              )}
              {wiki.Status === "published" && (
                <Button
                  className="edit"
                  onClick={() => handleChangeStatus("inProgress")}
                >
                  Annuler la publication
                </Button>
              )}
            </div>
          </div>
          <p>Status: {wiki.Status}</p>

          {/* Tabs Section */}
          <div className="tabs">
            <button
              className={activeTab === "univers" ? "active-tab" : ""}
              onClick={() => handleTabChange("univers")}
            >
              Univers
            </button>
            <button
              className={activeTab === "bestiaire" ? "active-tab" : ""}
              onClick={() => handleTabChange("bestiaire")}
            >
              Bestiaire
            </button>
            <button
              className={activeTab === "races" ? "active-tab" : ""}
              onClick={() => handleTabChange("races")}
            >
              Races
            </button>
            <button
              className={activeTab === "jobs" ? "active-tab" : ""}
              onClick={() => handleTabChange("jobs")}
            >
              Jobs
            </button>
            <button
              className={activeTab === "scenarios" ? "active-tab" : ""}
              onClick={() => handleTabChange("scenarios")}
            >
              Scénarios
            </button>
          </div>
        </div>

        {/* Universe Tab Content */}
        {activeTab === "univers" && (
          <div className="rpg-editor">
            <WikiEditor defaultContent={wikiContent} onSave={handleSave} />
          </div>
        )}

        {/* Scenarios Tab Content */}
        {activeTab === "scenarios" && (
          <div className="bestiary-section">
            <h3>
              {newScenario.id
                ? "Modifier le scénario"
                : "Ajouter un nouveau scénario"}
            </h3>
            <input
              type="text"
              name="name"
              placeholder="Titre du scénario"
              value={newScenario.name}
              onChange={handleScenarioChange}
              className="input-field"
            />
            <div className="ql-editor-container">
              <QuillEditor
                value={newScenario.content}
                onChange={handleScenarioContentChange}
              />
            </div>
            <button className="save-button" onClick={handleAddOrUpdateScenario}>
              {newScenario.id ? "Modifier" : "Ajouter"} le Scénario
            </button>
          </div>
        )}

        {/* Scenarios List */}
        {activeTab === "scenarios" && (
          <div className="bestiary-list">
            <h4>Liste des Scénarios</h4>
            <ul>
              {scenarios.map((scenario) => (
                <li key={scenario.id}>
                  <h5>{scenario.name || "Nom indisponible"}</h5>
                  <button
                    className="edit-list-item"
                    onClick={() => handleEditScenario(scenario)}
                  >
                    Modifier
                  </button>
                  <button
                    className="delete-list-item"
                    onClick={() => handleDeleteScenario(scenario.id)}
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bestiary Tab Content */}
        {activeTab === "bestiaire" && (
          <div className="bestiary-section">
            <h3>
              {newBeast.id
                ? "Modifier le monstre"
                : "Ajouter un nouvel objet au bestiaire"}
            </h3>
            <input
              type="text"
              name="name"
              placeholder="Nom du monstre"
              value={newBeast.name}
              onChange={handleBeastChange}
              className="input-field"
            />
            <input
              type="text"
              name="type"
              placeholder="Type de monstre"
              value={newBeast.type}
              onChange={handleBeastChange}
              className="input-field"
            />
            <div className="ql-editor-container">
              <QuillEditor
                value={newBeast.content}
                onChange={handleContentChange}
              />
            </div>

            <button className="save-button" onClick={handleAddOrUpdateBeast}>
              {newBeast.id ? "Modifier" : "Ajouter"} au Bestiaire
            </button>
          </div>
        )}

        {/* Bestiary List */}
        {activeTab === "bestiaire" && (
          <div className="bestiary-list">
            <h4>Liste des Bestiaires</h4>
            <ul>
              {bestiaire.map((beast) => (
                <li key={beast.id}>
                  <h5>{beast.Name || "Nom indisponible"}</h5>
                  <button
                    className="edit-list-item"
                    onClick={() => handleEditBeast(beast)}
                  >
                    Modifier
                  </button>
                  <button
                    className="delete-list-item"
                    onClick={() => handleDeleteBeast(beast.id)}
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Races Tab Content */}
        {activeTab === "races" && (
          <div className="race-section">
            <h3>
              {newRace.id ? "Modifier la race" : "Ajouter une nouvelle race"}
            </h3>
            <input
              type="text"
              name="name"
              placeholder="Nom de la race"
              value={newRace.name}
              onChange={handleRaceChange}
              className="input-field"
            />
            <div className="ql-editor-container">
              <QuillEditor
                value={newRace.content}
                onChange={handleRaceContentChange}
              />
            </div>
            <button className="save-button" onClick={handleAddOrUpdateRace}>
              {newRace.id ? "Modifier" : "Ajouter"} la Race
            </button>
          </div>
        )}

        {/* Races List */}
        {activeTab === "races" && (
          <div className="race-list">
            <h4>Liste des Races</h4>
            <ul>
              {races?.map((race) => (
                <li key={race.id}>
                  <h5>{race.Name || "Nom indisponible"}</h5>
                  <button
                    className="edit-list-item"
                    onClick={() => handleEditRace(race)}
                  >
                    Modifier
                  </button>
                  <button
                    className="delete-list-item"
                    onClick={() => handleDeleteRace(race.id)}
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Jobs Tab Content */}
        {activeTab === "jobs" && (
          <div className="bestiary-section">
            <h3>{newJob.id ? "Modifier le job" : "Ajouter un nouveau job"}</h3>
            <input
              type="text"
              name="name"
              placeholder="Nom du job"
              value={newJob.name}
              onChange={handleJobChange}
              className="input-field"
            />
            <div className="ql-editor-container">
              <QuillEditor
                value={newJob.content}
                onChange={handleJobContentChange}
              />
            </div>
            <button className="save-button" onClick={handleAddOrUpdateJob}>
              {newJob.id ? "Modifier" : "Ajouter"} le Job
            </button>
          </div>
        )}

        {/* Jobs List */}
        {activeTab === "jobs" && (
          <div className="bestiary-list">
            <h4>Liste des Jobs</h4>
            <ul>
              {jobs.map((job) => (
                <li key={job.id}>
                  <h5>{job.name || "Nom indisponible"}</h5>
                  <button
                    className="edit-list-item"
                    onClick={() => handleEditJob(job)}
                  >
                    Modifier
                  </button>
                  <button
                    className="delete-list-item"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default WikiEdition;
