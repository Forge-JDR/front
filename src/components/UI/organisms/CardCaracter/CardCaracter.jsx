import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteCaracter } from "../../../../store/store"; // Adjust based on your store slice
import "./cardCaracter.css";
import Button from "../../atoms/button/button";

const CardCaracter = ({
  id,
  srcImg,
  nameCaracter,
  rpgName,
  updateList,
  ...rest
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDisplayFormDelete, setIsDisplayFormDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const displayDeleteModal = () => {
    setIsDisplayFormDelete(!isDisplayFormDelete);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting to delete character with ID:", id);
      await dispatch(deleteCaracter(id)).unwrap(); // Ensures the action is finished before continuing
      console.log("Character deleted successfully");

      // Refresh the character list after deletion
      if (typeof updateList === "function") {
        updateList();
      } else {
        console.error("updateList is not a function");
      }

      setIsDisplayFormDelete(false);
    } catch (err) {
      console.log("Error deleting character:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSuppressionModal = () => {
    return (
      <div className="background-form" onClick={displayDeleteModal}>
        <div className="form confirm-delete" onClick={(e) => e.stopPropagation()}>
          <div className="alert-info-confirm-delete">
            <p>Êtes-vous sûr de vouloir supprimer votre personnage?</p>
            <p>Cette action est irréversible</p>
          </div>
          <div className="btn bottom-modal">
            <Button className="cancel" onClick={displayDeleteModal}>
              Annuler
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
      <div className="card caracter personal-space">
        <div className="img">
          <img src={srcImg} alt={nameCaracter} />
        </div>
        <div className="info caracter">
          <div className="name-caracter title">
            <p className="title-card-caracter">{nameCaracter}</p>
          </div>
          <div className="name-caracter title">
            <p className="title-card-caracter">{rpgName}</p>
          </div>
        </div>
        <div className="action-button">
          <Button className="button delete" onClick={displayDeleteModal}>
            Supprimer
          </Button>
          <Button
            className="button update"
            onClick={() => {
              navigate(`/caracters/edit/${id}`);
            }}
          >
            Modifier
          </Button>
        </div>
      </div>
    </>
  );
};

export default CardCaracter;
