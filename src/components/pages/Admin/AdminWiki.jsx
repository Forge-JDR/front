import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchWikiAdmin, updateWiki } from "../../../store/slices/Wikis.slice";
import "./AdminWiki.css";
import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";

const AdminWiki = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wikis = useSelector((state) => state.wikis.adminWikis) || []; // Fallback to an empty array
  const loading = useSelector((state) => state.wikis.status === 'loading'); // Loading state from Redux
  const [statusFilter, setStatusFilter] = useState(""); // State for the status filter

  // Fetch wikis on component mount
  useEffect(() => {
    dispatch(fetchWikiAdmin());
  }, [dispatch]);

  // Handler for the status filter change
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handle changing the publication status
  const handleChangePublicationStatus = (id, newStatus) => {
    const dataToUpdate = { Status: newStatus };

    dispatch(updateWiki({ id, dataToUpdate }))
      .then(() => {
        alert(`Changed status of wiki with ID ${id} to ${newStatus}`);
        dispatch(fetchWikiAdmin());
        navigate("/admin/wiki");
      })
      .catch((error) => {
        console.error("Error changing publication status:", error);
      });
  };

  // Placeholder functions for other button actions
  const handleViewWiki = (id) => {
    navigate(`/wiki/${id}`);
  };

  const handleEditWiki = (id) => {
    navigate(`/wiki/edit/${id}`);
  };

  // Filter wikis based on the selected status
  const filteredWikis = statusFilter
    ? wikis.filter((wiki) => wiki.Status === statusFilter)
    : wikis;

  return (
    <div className="admin-panel-background">
      <ConnectedNavbar />
      <div className="admin-wiki-page">
        <h2>Administration des Wikis</h2>

        {/* Loading Indicator */}
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <>
            {/* Filter Section */}
            <div className="filter-section">
              <label htmlFor="statusFilter">Filtrer par statut :</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={handleStatusChange}
              >
                <option value="">Tous</option>
                <option value="published">Publié</option>
                <option value="inProgress">En cours</option>
                <option value="pendingToPublish">En attente de publication</option>
              </select>
            </div>

            {/* Wikis List */}
            <div className="wikis-list">
              {filteredWikis.length > 0 ? (
                filteredWikis.map((wiki) => (
                  <div key={wiki.id} className="wiki-item">
                    <h3>{wiki.Name}</h3>
                    <p>ID: {wiki.id}</p>
                    <p>Status: {wiki.Status}</p>
                    {wiki.user && (
                      <p>
                        Utilisateur: {wiki.user.pseudo} (ID: {wiki.user.id})
                      </p>
                    )}
                    {/* Display image if available */}
                    {wiki.imageFile && wiki.imageFile.fichierImage ? (
                      <img
                        src={wiki.imageFile.fichierImage}
                        alt={wiki.Name}
                        className="wiki-image"
                      />
                    ) : (
                      <p>Aucune image disponible</p>
                    )}

                    {/* Action Buttons */}
                    <div className="action-buttons">
                      <button onClick={() => handleViewWiki(wiki.id)}>Voir</button>
                      <button onClick={() => handleEditWiki(wiki.id)}>Editer</button>
                      <select
                        onChange={(e) =>
                          handleChangePublicationStatus(wiki.id, e.target.value)
                        }
                        value={wiki.Status}
                      >
                        <option value="">Changer état publication</option>
                        <option value="published">Publié</option>
                        <option value="inProgress">En cours</option>
                        <option value="pendingToPublish">
                          En attente de publication
                        </option>
                      </select>
                    </div>
                  </div>
                ))
              ) : (
                <p>Aucun wiki trouvé.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminWiki;
