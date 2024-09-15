import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { addCaracter } from "../../../store/store";  // Adjust path to your Redux slice
import QuillEditor from "../../UI/molecules/QuillEditor/QuillEditor";

import "./newCaracterForm.css";

import Button from "../../UI/atoms/button/button";
import FieldForm from "../../UI/molecules/FieldForm/FieldForm";

const NewCaracterForm = ({ closeForm, updateList, ...rest }) => {
  const [caracterName, setCaracterName] = useState("");
  const [caracterContent, setCaracterContent] = useState("");  // Adding 'content' to store the character's description or content
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!caracterName || !caracterContent) {
      alert(t("newCaracterForm.missingFields"));  // Add validation if fields are missing
      return;
    }

    try {
      // Dispatch the action to create the new character
      await dispatch(addCaracter({ name: caracterName, content:  JSON.stringify(caracterContent)})).unwrap();  // Ensure correct payload keys
      console.log("New character created");
      closeForm();  // Close the form on successful submission
      updateList();  // Call function to refresh the character list if needed
    } catch (error) {
      console.log("Error creating new character", error);
    }
  };

  const handleContentChange = (content) => {
    setCaracterContent(content);
  };

  return (
    <div className="background-form" onClick={closeForm}>
      <div className="form newCaracter" onClick={(e) => e.stopPropagation()}>
        <div className="title-form new-caracter">
          <p>{t("newCaracterForm.new")}</p>
        </div>
        <div className="main-container info-new-caracter">
          <div className="info-container right">
            <FieldForm
              id="caracterName"
              name="caracterName"
              label={t("newCaracterForm.caracterName")}
              required={true}
              value={caracterName}
              onChange={(e) => setCaracterName(e.target.value)}
            />
            {/* <FieldForm
              id="content"
              name="content"
              label={t("newCaracterForm.caracterContent")}  // Assuming 'content' is a field for character description
              value={caracterContent}
              onChange={(e) => setCaracterContent(e.target.value)}
            /> */}
            {/* Caracter Content Editor */}
            <div className="caracter-editor-content">
              <QuillEditor value={caracterContent} onChange={handleContentChange} />
            </div>
          </div>
        </div>

        <div className="btn bottom">
          <Button className="cancel" onClick={closeForm}>
            {t("newCaracterForm.cancel")}
          </Button>
          <Button
            className="confirm"
            onClick={handleSubmit}
          >
            {t("newCaracterForm.create")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewCaracterForm;
