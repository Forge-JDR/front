import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../../../store/slices/auth.slice";

import "./creation.css";

import defaultWikiImage from "../../../assets/wiki_default.png";

import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import CardCreate from "../../UI/molecules/CardCreate/CardCreate";
import NewRpgForm from "../../templates/NewRpgForm/NewRpgForm";
import CardRpg from "../../UI/organisms/CardRpg/CardRpg";
import Footer from "../../UI/organisms/footer/Footer";
import Button from "../../UI/atoms/button/button";

const Creation = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Récupère les informations de l'utilisateur connecté
  const ConnectedUser = useSelector((state) => state.auth.user);

  // État local pour afficher ou non le formulaire de création de RPG
  const [isDisplayFormNew, setIsDisplayFormNew] = useState(false);
  const displayForm = () => {
    setIsDisplayFormNew(!isDisplayFormNew);
  };

  // Dispatch pour récupérer l'utilisateur au chargement
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Fonction pour mettre à jour la liste des JDR après suppression
  const updateList = () => {
    dispatch(fetchCurrentUser()); // Récupère à nouveau les données de l'utilisateur
  };

  // Assure-toi que les wikis sont bien définis pour l'utilisateur connecté
  const userWikis = ConnectedUser?.Wikis || [];

  return (
    <>
      <div className="background-hexa image creation"></div>
      <div className="background-creation">
        <ConnectedNavbar />
        {isDisplayFormNew && <NewRpgForm closeForm={displayForm} />}
        <div className="main-contaner personnal-rpg-creation">
          <div className="title-personnal-page">
            <p>{t("creation.title")}</p>
          </div>
          <div className="card-container rpg creation inline-content">
            {/* Si l'utilisateur n'est pas encore récupéré, affiche un message de chargement */}
            {!ConnectedUser ? (
              <p>Chargement des JDR...</p>
            ) : (
              <>
                {/* Affiche les wikis de l'utilisateur connecté */}
                {userWikis.length > 0 ? (
                  userWikis.map((rpg, index) => (
                    <div key={index} className="personnal-rpg-card">
                      <CardRpg
                        id={rpg.id}
                        srcImg={defaultWikiImage} // Utilise l'image par défaut (peut être modifiée)
                        nameRpg={rpg.Name}
                        updateList={updateList}
                      />
                    </div>
                  ))
                ) : (
                  <p>Aucun JDR trouvé pour l'utilisateur connecté.</p>
                )}
              </>
            )}

            {/* Afficher une carte pour créer un nouveau RPG */}
            {userWikis.length < 3 && (
              <div className="personnal-rpg-space new-rpg">
                <CardCreate
                  width="100%"
                  height="100%"
                  title="Créer un nouveau JDR"
                  role="button"
                  onClick={displayForm}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Creation;
