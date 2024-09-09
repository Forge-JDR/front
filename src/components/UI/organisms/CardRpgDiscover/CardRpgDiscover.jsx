import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteWiki } from "../../../../store/slices/Wikis.slice";

import "./cardRpgDiscover.css";

const CardRpgDiscover = ({ id, srcImg, nameRpg, owner, ...rest }) => {
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
          <div className="name-rpg owner">
            <p className="owner-card-rpg">{owner}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardRpgDiscover;
