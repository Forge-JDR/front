import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchUserProfile, deleteCaracter } from "../../../store/store";  // Adjust based on your store slice
import { useNavigate } from "react-router-dom";
import "./caracters.css";
import forgeLogoTxt from "../../../assets/logo/logo_texte.svg";

import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import CardCaracter from "../../UI/organisms/CardCaracter/CardCaracter";
import CardCreate from "../../UI/molecules/CardCreate/CardCreate";
import NewCaracterForm from "../../templates/NewCaracterForm/NewCaracterForm";
import Footer from "../../UI/organisms/footer/Footer";

const Caracters = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDisplayFormNew, setIsDisplayFormNew] = useState(false);

  // Fetch user profile and caracters from Redux store
  const userProfile = useSelector((state) => state.caracters.profile);
  const caracters = userProfile ? userProfile.Caracters : [];
  const profileStatus = useSelector((state) => state.caracters.status);

  useEffect(() => {
    if (profileStatus === 'idle') {
      dispatch(fetchUserProfile());  // Fetch the user profile and caracters when the component mounts
    }
  }, [profileStatus, dispatch]);

  const displayForm = () => {
    setIsDisplayFormNew(!isDisplayFormNew);
  };

  const handleEditCaracter = (id) => {
    navigate(`/caracters/edit/${id}`);  // Navigate to the edit page
  };

  const handleDeleteCaracter = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce personnage ?")) {
      dispatch(deleteCaracter(id));  // Dispatch delete action
    }
  };

  return (
    <>
      <div className="background creation">
        <div className="background-hexa image">
          <ConnectedNavbar />
          {isDisplayFormNew && <NewCaracterForm closeForm={displayForm} />}
          <div className="main-container personnal-caracter">
            <div className="title-personnal-page">
              <p>{t("caracter.title")}</p>
            </div>
            <div className="card-container caracter creation inline-content">
              {caracters.length > 0 ? (
                caracters.map((caracter) => (
                  <div key={caracter.id} className="personnal-caracter-card caracter">
                    <CardCaracter
                      srcImg={caracter.imageFile || forgeLogoTxt}  // Fallback to default image if no image is provided
                      nameCaracter={caracter.Name}
                      rpgName={caracter.rpgName}
                    />
                    <button onClick={() => handleEditCaracter(caracter.id)}>Éditer</button>
                    <button onClick={() => handleDeleteCaracter(caracter.id)}>Supprimer</button>
                  </div>
                ))
              ) : (
                <p>Vous n'avez aucun personnage pour le moment.</p>
              )}
              <div className="personnal-caracter-card new rpg">
                <CardCreate
                  width="100%"
                  height="100%"
                  title="Créer un nouveau JDR"
                  role="button"
                  onClick={displayForm}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Caracters;
