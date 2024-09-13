import React, { useState } from "react";

import "./cardRpgHome.css";

const CardRpgHome = ({ id, srcImg, nameRpg, ...rest }) => {
  return (
    <>
      <div className="card my-rpg personal-space home">
        <div className="img">
          <img src={srcImg} alt="" />
        </div>
        <div className="info rpg">
          <div className="name-rpg title">
            <p className="title-card-rpg">{nameRpg}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardRpgHome;
