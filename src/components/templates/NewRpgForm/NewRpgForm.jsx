import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import "./newRpgForm.css";

import SubmitButton from "../../UI/molecules/submitButton/submitButton";
import FieldForm from "../../UI/molecules/FieldForm/FieldForm";
import CancelButton from "../../UI/molecules/cancelButton/cancelButton";

import iconeUplaod from "../../../assets/upload_icone.svg";

const NewRpgForm = ({ closeForm, ...rest }) => {
  const [rpgName, setRpgName] = useState("");
  const [style, setStyle] = useState("");
  const { t } = useTranslation();

  return (
    <div className="background-form" onClick={closeForm}>
      <div className="form newRpg" onClick={(e) => e.stopPropagation()}>
        <div className="title-form new-rpg">
          <p>{t("login.new")}</p>
        </div>
        <div className="main-container info-new-rpg">
          <div className="img-container left">
            <div className="upload-img">
              <img src={iconeUplaod} alt="RPG" className="rpg-image" />
              {/* <img src="your_image_url" alt="RPG" className="rpg-image" /> */}
            </div>
          </div>
          <div className="info-container right">
            <FieldForm
              id="rpgName"
              name="rpgName"
              label={t("login.rpgName")}
              required={true}
              value={rpgName}
              onChange={(e) => setRpgName(e.target.value)}
            />
            <FieldForm
              id="style"
              name="style"
              label={t("login.style")}
              required={true}
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            />
          </div>
        </div>

        <div className="btn bottom">
          <CancelButton className="cancel" onClick={closeForm}>
          {t("login.cancel")}
          </CancelButton>
          <SubmitButton
            className="confirm"
            onClick={() => {
              console.log("Form submitted");
            }}
          >
            {t("login.create")}
          </SubmitButton>
        </div>
      </div>
    </div>
  );
};

export default NewRpgForm;
