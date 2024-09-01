import React from "react";

import "./cardCreate.css";
import plusIcon from "../../../../assets/plus-icon.png";

const CardCreate = ({ width, height, title, onClick, ...rest }) => {
  return (
    <>
      <div
        className="new card"
        style={{ width: width, height: height }}
        onClick={onClick}
      >
        <div className="content-card">
          <div className="title">
            <p>{title}</p>
          </div>
          <div className="plus">
            <img src={plusIcon} alt="add" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CardCreate;
