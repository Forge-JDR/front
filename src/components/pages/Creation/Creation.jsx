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

  // State to track loading
  const loading = useSelector((state) => state.auth.status === "loading");

  // Get current user information
  const ConnectedUser = useSelector((state) => state.auth.user);

  // Local state to display or hide the new RPG creation form
  const [isDisplayFormNew, setIsDisplayFormNew] = useState(false);
  const displayForm = () => {
    setIsDisplayFormNew(!isDisplayFormNew);
  };

  // Fetch current user data on component mount
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Function to update the RPG list after deletion
  const updateList = () => {
    dispatch(fetchCurrentUser());
  };

  // Ensure wikis are defined for the connected user
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
            {/* Display loading message if data is being fetched */}
            {loading ? (
              <p>Chargement des JDR...</p>
            ) : (
              <>
                {/* Display user wikis */}
                {userWikis.length > 0 ? (
                  userWikis.map((rpg, index) => (
                    <div key={index} className="personnal-rpg-card">
                      <CardRpg
                        id={rpg.id}
                        srcImg={rpg.imageFile?.fichierImage || defaultWikiImage} // Utilise l'image par défaut (peut être modifiée)
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

            {/* Show a card to create a new RPG if less than 3 */}
            {userWikis.length < 3 && !loading && (
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
