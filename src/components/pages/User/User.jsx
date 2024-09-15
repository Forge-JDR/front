import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateAccount } from "../../../store/slices/auth.slice"; // Import the necessary actions
import "./User.css"; // Include some CSS for basic styling if needed
import { useNavigate } from "react-router-dom"; // Import useNavigate

import FieldForm from "../../UI/molecules/FieldForm/FieldForm";
import Button from "../../UI/atoms/button/button";
import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";

const User = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate(); // Initialize useNavigate

  // Local state for user details
  const [username, setUsername] = useState(user?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Handlers for form inputs
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

  // Handler for updating username
  const handleUpdateUsername = (e) => {
    e.preventDefault();
    if (username) {
      dispatch(updateAccount({ username }))
        .then(() => {
          alert("Nom d'utilisateur mis à jour avec succès");
          navigate("/"); // Redirect to the homepage
        })
        .catch((error) =>
          console.log(
            "Erreur lors de la mise à jour du nom d'utilisateur :",
            error
          )
        );
    }
  };

  // Handler for updating password
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (currentPassword && newPassword) {
      var password = newPassword;
      dispatch(updateAccount({ password }))
        .then(() => {
          alert("Mot de passe mis à jour avec succès");
          setCurrentPassword("");
          setNewPassword("");

          navigate("/"); // Redirect to the homepage
        })
        .catch((error) =>
          console.log("Erreur lors de la mise à jour du mot de passe :", error)
        );
    }
  };

  return (
    <div className="backgroud-user-account">
      <ConnectedNavbar />
      <div className="user-account-page">
        <h2>Gestion de compte</h2>

        {/* Update Username Section */}
        <div className="user-form-section">
          <h3>Modifier le nom d'utilisateur</h3>
          <form onSubmit={handleUpdateUsername}>
            <FieldForm
              id="username"
              name="username"
              label="Nouveau nom d'utilisateur: "
              value={username}
              onChange={handleUsernameChange}
            />
            <div className="form-group">
              {/* <label htmlFor="username">Nouveau nom d'utilisateur:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Entrez le nouveau nom d'utilisateur"
                required
              /> */}
            </div>
            <Button className="submit" type="submit">
              Mettre à jour le nom d'utilisateur
            </Button>
          </form>
        </div>

        {/* Update Password Section */}
        <div className="user-form-section">
          <h3>Modifier le mot de passe</h3>
          <form onSubmit={handleUpdatePassword}>
            <div className="form-group">
              <FieldForm
                id="currentPassword"
                type="password"
                name="currentPassword"
                label="Entrez le mot de passe actuel"
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
              />
              {/* <label htmlFor="currentPassword">Mot de passe actuel:</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
                placeholder="Entrez le mot de passe actuel"
                required
              /> */}
            </div>
            <div className="form-group">
              <FieldForm
                type="password"
                id="newPassword"
                name="newPassword"
                label="Entrez le nouveau mot de passe "
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
              {/* <label htmlFor="newPassword">Nouveau mot de passe:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
                placeholder="Entrez le nouveau mot de passe"
                required
              /> */}
            </div>
            <Button className="submit" type="submit">
              Mettre à jour le mot de passe
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default User;
