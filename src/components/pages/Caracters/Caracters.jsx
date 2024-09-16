import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchUserProfile, deleteCaracter } from "../../../store/store"; // Adjust based on your store slice
import { useNavigate } from "react-router-dom";
import "./caracters.css";
import forgeLogoTxt from "../../../assets/logo/logo_texte.svg";
import defaultImage from "../../../assets/home/fonc2.jpg";
import { fetchCurrentUser } from "../../../store/slices/auth.slice";
import { useLocation } from "react-router-dom";
import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import CardCaracter from "../../UI/organisms/CardCaracter/CardCaracter";
import CardCreate from "../../UI/molecules/CardCreate/CardCreate";
import NewCaracterForm from "../../templates/NewCaracterForm/NewCaracterForm";
import Footer from "../../UI/organisms/footer/Footer";

const Caracters = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const ConnectedUser = useSelector((state) => state.auth.user);
  const [isDisplayFormNew, setIsDisplayFormNew] = useState(false);

  // Fetch user profile and caracters from Redux store
  const userProfile = useSelector((state) => state.caracters.profile);
  const caracters = userProfile?.Caracters || []; // Default to an empty array if undefined
  const profileStatus = useSelector((state) => state.caracters.status);

  useEffect(() => {
    if (location.state?.refresh || profileStatus === "idle") {
      dispatch(fetchUserProfile()); // Fetch the user profile and caracters when the component mounts
    }
  }, [profileStatus, dispatch]);

  // Dispatch to get the current user on component mount
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const displayForm = () => {
    setIsDisplayFormNew(!isDisplayFormNew);
  };

  // Function to update the list by refetching the user profile
  const updateList = () => {
    dispatch(fetchUserProfile()); // Re-fetch user profile to update the character list
  };

  const handleEditCaracter = (id) => {
    navigate(`/caracters/edit/${id}`); // Navigate to the edit page
  };

  const handleDeleteCaracter = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce personnage ?")) {
      dispatch(deleteCaracter(id)).then(() => {
        updateList(); // Update the character list after deletion
      });
    }
  };

  return (
    <>
      <div className="background-hexa image caracters"></div>
      <div className="background-caracters-user">
        <ConnectedNavbar />
        {isDisplayFormNew && (
          <NewCaracterForm
            closeForm={() => {
              displayForm();
              updateList(); // Update the character list after adding a new character
            }}
          />
        )}
        <div className="main-container-personnal-caracter">
          <div className="title-personnal-page">
            <p>{t("caracter.title")}</p>
          </div>
          <div className="card-container rpg caracter inline-content">
            {!ConnectedUser ? (
              <p>Chargement des personnages...</p>
            ) : (
              <>
                {caracters.length > 0 ? (
                  caracters.map((caracter) => (
                    <div
                      key={caracter.id}
                      className="personnal-caracter-card caracter"
                    >
                      <CardCaracter
                        id={caracter.id}
                        srcImg={caracter.imageFile || defaultImage} // Fallback to default image if no image is provided
                        nameCaracter={caracter.Name}
                        rpgName={caracter.rpgName}
                        updateList={updateList} // Pass updateList function to CardCaracter
                      />
                    </div>
                  ))
                ) : (
                  <p>Vous n'avez aucun personnage pour le moment.</p>
                )}
              </>
            )}

            <div className="personnal-caracter-card new rpg">
              <CardCreate
                width="100%"
                height="100%"
                title="Créer un personnage"
                role="button"
                onClick={displayForm}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Caracters;
