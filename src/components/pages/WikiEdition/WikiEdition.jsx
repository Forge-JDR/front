import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateWiki,
  fetchWiki,
  addBestiary,
  updateBestiary,
  deleteBestiary,
  addRace,
  updateRace,
  deleteRace,
  addJob,
  updateJob,
  deleteJob,
} from "../../../store/store";
import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import WikiEditor from "../../UI/organisms/wikiEditor/WikiEditor";
import QuillEditor from "../../UI/molecules/QuillEditor/QuillEditor";
import Footer from "../../UI/organisms/footer/Footer";
import "./wikiEdition.css";

const WikiEdition = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const wiki = useSelector((state) => state.wikis.wikiInfo);
  const wikiStatus = useSelector((state) => state.wikis.status);

  // State for the wiki's name and content
  const [wikiName, setWikiName] = useState("");
  const [wikiContent, setWikiContent] = useState("");

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

  // State for handling the active tab
  const [activeTab, setActiveTab] = useState("univers");

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
    }
  }, [wiki]);

  // Handle saving the main content (universe)
  const handleSave = (updatedContent) => {
    if (activeTab === "univers") {
      const dataToUpdate = {
        Name: wikiName,
        Content: JSON.stringify(updatedContent),
      };
      dispatch(updateWiki({ id, dataToUpdate }));
    }
  };

  // Handlers for bestiary
  const handleBeastChange = (e) => {
    const { name, value } = e.target;
    setNewBeast((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setNewBeast((prev) => ({ ...prev, content }));
  };

  const handleAddOrUpdateBeast = () => {
    if (newBeast.name && newBeast.content && newBeast.type) {
      if (newBeast.id) {
        const dataToUpdate = {
          Name: newBeast.name,
          Content: JSON.stringify(newBeast.content),
          Type: newBeast.type,
        };

        dispatch(updateBestiary({ WikiId: id, id: newBeast.id, dataToUpdate }))
          .then((response) => {
            if (response.payload) {
              setBestiaire((prev) =>
                prev.map((beast) => (beast.id === newBeast.id ? response.payload : beast))
              );
              setNewBeast({ id: null, name: "", content: { ops: [] }, type: "" });
              setActiveTab("bestiaire");
            }
          })
          .catch((error) => {
            console.log("Erreur lors de la mise à jour du bestiaire :", error);
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
              setNewBeast({ id: null, name: "", content: { ops: [] }, type: "" });
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
  };

  const handleDeleteBeast = (beastId) => {
    dispatch(deleteBestiary({ WikiId: id, id: beastId }))
      .then(() => {
        setBestiaire((prev) => prev.filter((beast) => beast.id !== beastId));
        setNewBeast({ id: null, name: "", content: { ops: [] }, type: "" });
        setActiveTab("bestiaire");
      })
      .catch((error) => {
        console.log("Erreur lors de la suppression du bestiaire :", error);
      });
  };

  const handleEditBeast = (beast) => {
    setNewBeast({
      id: beast.id,
      name: beast.Name || "",
      content: beast.Content ? JSON.parse(beast.Content) : { ops: [] },
      type: beast.Type || "",
    });
  };

  // Handlers for race
  const handleRaceChange = (e) => {
    const { name, value } = e.target;
    setNewRace((prev) => ({ ...prev, [name]: value }));
  };

  const handleRaceContentChange = (content) => {
    setNewRace((prev) => ({ ...prev, content }));
  };

  const handleAddOrUpdateRace = () => {
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
                prev.map((race) => (race.id === newRace.id ? response.payload : race))
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
  };

  const handleDeleteRace = (raceId) => {
    dispatch(deleteRace({ WikiId: id, id: raceId }))
      .then(() => {
        setRaces((prev) => prev.filter((race) => race.id !== raceId));
        setNewRace({ id: null, name: "", content: { ops: [] } });
        setActiveTab("races");
      })
      .catch((error) => {
        console.log("Erreur lors de la suppression de la race :", error);
      });
  };

  const handleEditRace = (race) => {
    setNewRace({
      id: race.id,
      name: race.Name || "",
      content: race.Content ? JSON.parse(race.Content) : { ops: [] },
    });
  };

  // Handlers for jobs (similar to races)
  const handleJobChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleJobContentChange = (content) => {
    setNewJob((prev) => ({ ...prev, content }));
  };

  const handleAddOrUpdateJob = () => {
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
                prev.map((job) => (job.id === newJob.id ? response.payload : job))
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
  };

  const handleDeleteJob = (jobId) => {
    dispatch(deleteJob({ WikiId: id, id: jobId }))
      .then(() => {
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
        setNewJob({ id: null, name: "", content: { ops: [] } });
        setActiveTab("jobs");
      })
      .catch((error) => {
        console.log("Erreur lors de la suppression du job :", error);
      });
  };

  const handleEditJob = (job) => {
    setNewJob({
      id: job.id,
      name: job.name || "",
      content: job.Content ? JSON.parse(job.Content) : { ops: [] },
    });
  };

  const handleNameChange = (e) => {
    setWikiName(e.target.value);
  };

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
                onChange={handleNameChange}
              />
            </div>

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
            </div>

            {/* Universe Tab Content */}
            {activeTab === "univers" && (
              <div className="rpg-editor">
                <WikiEditor defaultContent={wikiContent} onSave={handleSave} />
              </div>
            )}

            {/* Bestiary Tab Content */}
            {activeTab === "bestiaire" && (
              <div className="bestiary-section">
                <h3>{newBeast.id ? "Modifier le monstre" : "Ajouter un nouvel objet au bestiaire"}</h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Nom du monstre"
                  value={newBeast.name}
                  onChange={handleBeastChange}
                  className="input-field"
                />
                <div className="ql-editor-container">
                  <QuillEditor
                    value={newBeast.content}
                    onChange={handleContentChange}
                  />
                </div>
                <input
                  type="text"
                  name="type"
                  placeholder="Type de monstre"
                  value={newBeast.type}
                  onChange={handleBeastChange}
                  className="input-field"
                />
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
                      <button onClick={() => handleEditBeast(beast)}>Modifier</button>
                      <button onClick={() => handleDeleteBeast(beast.id)}>Supprimer</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Races Tab Content */}
            {activeTab === "races" && (
              <div className="race-section">
                <h3>{newRace.id ? "Modifier la race" : "Ajouter une nouvelle race"}</h3>
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
                  {races.map((race) => (
                    <li key={race.id}>
                      <h5>{race.Name || "Nom indisponible"}</h5>
                      <button onClick={() => handleEditRace(race)}>Modifier</button>
                      <button onClick={() => handleDeleteRace(race.id)}>Supprimer</button>
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
                      <button onClick={() => handleEditJob(job)}>Modifier</button>
                      <button onClick={() => handleDeleteJob(job.id)}>Supprimer</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default WikiEdition;
