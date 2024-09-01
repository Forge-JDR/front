import React, { useState } from "react";

import "./cardCaracter.css";

import Button from "../../atoms/button/button";
// import SubmitButton from "../../molecules/submitButton/submitButton";
// import CancelButton from "../../molecules/cancelButton/cancelButton";

const CardCaracter = ({ srcImg, nameCaracter, rpgName, ...rest }) => {
  return (
    <>
      <div className="card caracter personal-space">
        <div className="img">
          <img src={srcImg} alt="" />
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
          <Button
            className="button delete"
            onClick={() => {
              console.log("Supprimer");
            }}
          >
            Supprimer
          </Button>
          <Button
            className="button update"
            onClick={() => {
              console.log("Modifier");
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
