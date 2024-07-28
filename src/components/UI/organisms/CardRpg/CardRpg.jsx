import React, { useState } from "react";

import "./cardRpg.css";

import SubmitButton from "../../molecules/submitButton/submitButton";
import CancelButton from "../../molecules/cancelButton/cancelButton";

const CardRpg = ({ srcImg, nameRpg, ...rest }) => {
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
          <SubmitButton
            className="button delete"
            onClick={() => {
              console.log("Supprimer");
            }}
          >
            Supprimer
          </SubmitButton>
          <SubmitButton
            className="button update"
            onClick={() => {
              console.log("Modifier");
            }}
          >
            Modifier
          </SubmitButton>
        </div>
      </div>
    </>
  );
};

export default CardRpg;
