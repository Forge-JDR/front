import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { deleteWiki } from "../../../../store/slices/Wikis.slice";

import "./cardRpg.css";

import Button from "../../atoms/button/button";

const CardRpg = ({ id, srcImg, nameRpg, updateList, ...rest }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDisplayFormDelete, setIsDisplayFormDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const displayDeleteModal = () => {
    setIsDisplayFormDelete(!isDisplayFormDelete);
  };

  const handleDelete = async () => {
    setIsLoading(true); // Commence le chargement
    try {
      await dispatch(deleteWiki(id)).unwrap(); // Assure que l'action est terminée avant de continuer
      setIsDisplayFormDelete(false); // Ferme la modale après suppression
      updateList(); // Mets à jour la liste des JDR après suppression
    } catch (err) {
      console.log("Erreur lors de la suppression du wiki", err);
    } finally {
      setIsLoading(false); // Arrête le chargement
    }
  };

  const confirmSuppressionModal = () => {
    return (
      <div className="background-form" onClick={displayDeleteModal}>
        <div
          className="form confirm-delete"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="alert-info-confirm-delete">
            <p>Etes-vous de vouloir supprimer votre Jeu de rôle?</p>
            <p>Cette action est irreversible</p>
          </div>
          <div className="btn bottom-modal">
            <Button className="cancel" onClick={displayDeleteModal}>
              {t("newRpgForm.cancel")}
            </Button>
            <Button className="delete" onClick={() => handleDelete()}>
              {isLoading ? "Chargement..." : "Supprimer"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isDisplayFormDelete && confirmSuppressionModal()}
      <div className="card rpg personal-space">
        <div className="img">
          <img src={srcImg} alt="" />
        </div>
        <div className="info rpg">
          <div className="name-rpg title">
            <p className="title-card-rpg">{nameRpg}</p>
          </div>
        </div>
        <div className="action-button">
          <Button className="delete" onClick={displayDeleteModal}>
            Supprimer
          </Button>
          <Button
            className="edit"
            onClick={() => {
              navigate(`/wiki/edit/${id}`);
            }}
          >
            Modifier
          </Button>
        </div>
      </div>
    </>
  );
};

export default CardRpg;
