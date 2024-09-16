import React, { useState } from "react";

import "./CardCaraHome.css";

const CardCaraHome = ({ id, srcImg, nameCaracter, ...rest }) => {
  return (
    <>
      <div className="card my-caracter personal-space home">
        <div className="img">
          <img src={srcImg} alt="" />
        </div>
        <div className="info-caracter">
          <div className="name-caracter title">
            <p className="title-card-caracter">{nameCaracter}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardCaraHome;
