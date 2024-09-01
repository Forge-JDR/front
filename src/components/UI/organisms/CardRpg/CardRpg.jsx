import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteWiki } from "../../../../store/slices/Wikis.slice";

import "./cardRpg.css";

import Button from "../../atoms/button/button";
// import SubmitButton from "../../molecules/submitButton/submitButton";
// import CancelButton from "../../molecules/cancelButton/cancelButton";

const CardRpg = ({ id, srcImg, nameRpg, ...rest }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = () => {
    dispatch(deleteWiki(id));
  };

  return (
    <>
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
          <Button className="delete" onClick={handleDelete}>
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
