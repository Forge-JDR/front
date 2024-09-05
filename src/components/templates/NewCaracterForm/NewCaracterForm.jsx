import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import "./newCaracterForm.css";

import Button from "../../UI/atoms/button/button";
// import SubmitButton from "../../UI/molecules/submitButton/submitButton";
import FieldForm from "../../UI/molecules/FieldForm/FieldForm";
// import CancelButton from "../../UI/molecules/cancelButton/cancelButton";

import iconeUplaod from "../../../assets/upload_icone.svg";

const NewCaracterForm = ({ closeForm, ...rest }) => {
  const [caracterName, setCaracterName] = useState("");
  const [style, setStyle] = useState("");
  const { t } = useTranslation();

  return (
    <div className="background-form" onClick={closeForm}>
      <div className="form newCaracter" onClick={(e) => e.stopPropagation()}>
        <div className="title-form new-caracter">
          <p>{t("newCaracterForm.new")}</p>
        </div>
        <div className="main-container info-new-caracter">
          <div className="img-container left">
            <div className="upload-img">
              <img
                src={iconeUplaod}
                alt="Caracter"
                className="caracter-image"
              />
              {/* <img src="your_image_url" alt="RPG" className="rpg-image" /> */}
            </div>
          </div>
          <div className="info-container right">
            <FieldForm
              id="caracterName"
              name="caracterName"
              label={t("newCaracterForm.caracterName")}
              required={true}
              value={caracterName}
              onChange={(e) => setCaracterName(e.target.value)}
            />
            <FieldForm
              id="style"
              name="style"
              label={t("newCaracterForm.rpg")}
              required={true}
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            />
          </div>
        </div>

        <div className="btn bottom">
          <Button className="cancel" onClick={closeForm}>
            {t("newCaracterForm.cancel")}
          </Button>
          <Button
            className="confirm"
            onClick={() => {
              console.log("newCaracterForm submitted");
            }}
          >
            {t("newCaracterForm.create")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewCaracterForm;
