import React from "react";

import "./cardCreate.css";

const CardCreate = ({ width, height, title }) => {
  return (
    <>
      <div className="new card" style={{ width: width, height: height }}>
        <div className="content-card">
          <div className="title">
            <p>{title}</p>
          </div>
          <div className="plus">
            <p>+</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardCreate;
