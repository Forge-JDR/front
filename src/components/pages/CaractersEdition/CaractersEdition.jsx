import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCaracter,
  addCaracter,
  updateCaracter,
  deleteCaracter,
} from "../../../store/store";
import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import QuillEditor from "../../UI/molecules/QuillEditor/QuillEditor";
import Footer from "../../UI/organisms/footer/Footer";
import "./caractersEdition.css";

const CaractersEdition = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const caracter = useSelector((state) => state.caracters.caracterInfo);

  // State for the caracter's name and content
  const [caracterName, setCaracterName] = useState("");
  const [caracterContent, setCaracterContent] = useState("");

  useEffect(() => {
    // Fetch caracter if there's an ID (edit mode)
    if (id) {
      dispatch(fetchCaracter(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (caracter && caracter.Name) {
      setCaracterName(caracter.Name);
  
      // Parse the content if it is a JSON string; otherwise, use it as-is
      let parsedContent;
      try {
        parsedContent = caracter.Content ? JSON.parse(caracter.Content) : { ops: [] };
      } catch (error) {
        console.error("Error parsing content:", error);
        parsedContent = { ops: [] };
      }
  
      setCaracterContent(parsedContent);
    }
  }, [caracter]);
  

  // Log caracterContent whenever it changes
  useEffect(() => {
    console.log("Updated caracterContent:", caracterContent);
  }, [caracterContent]);

  // Handle saving or updating the caracter
  const handleSave = () => {
    if (caracterName && caracterContent) {
      const dataToUpdate = {
        name: caracterName,
        content: JSON.stringify(caracterContent),
      };

      if (id) {
        dispatch(updateCaracter({ id, dataToUpdate }))
          .then(() => {
            navigate(`/caracters/edit/${id}`);
          })
          .catch((error) => {
            console.log("Erreur lors de la mise à jour du caractère :", error);
          });
      } else {
        dispatch(addCaracter({ name: caracterName, content: caracterContent }))
          .then(() => {
            setCaracterName("");
            setCaracterContent("");
            navigate("/caracters");
          })
          .catch((error) => {
            console.log("Erreur lors de l'ajout du caractère :", error);
          });
      }
    } else {
      alert("Veuillez remplir tous les champs avant d'ajouter.");
    }
  };

  // Handle deleting the caracter
  const handleDelete = () => {
    if (id) {
      dispatch(deleteCaracter(id))
        .then(() => {
          navigate("/caracters");
        })
        .catch((error) => {
          console.log("Erreur lors de la suppression du caractère :", error);
        });
    }
  };

  // Handle input changes
  const handleNameChange = (e) => {
    setCaracterName(e.target.value);
  };

  const handleContentChange = (content) => {
    setCaracterContent(content);
  };

  return (
    <>
      <div className="background-hexa image edition-caracter">
        <div className="background-edition">
          <ConnectedNavbar />
          <div className="main-container caracter-editor">
            <div className="title-caracter-editor">
              <input
                type="text"
                id="caracterName"
                placeholder="Nom du caractère"
                value={caracterName}
                onChange={handleNameChange}
              />
            </div>

            {/* Caracter Content Editor */}
            <div className="caracter-editor-content">
              <QuillEditor value={caracterContent} onChange={handleContentChange} />
            </div>

            {/* Buttons for Save, Delete, and Cancel */}
            <div className="caracter-editor-actions">
              <button className="save-button" onClick={handleSave}>
                {id ? "Mettre à jour le caractère" : "Ajouter le caractère"}
              </button>
              {id && (
                <button className="delete-button" onClick={handleDelete}>
                  Supprimer le caractère
                </button>
              )}
              <button className="cancel-button" onClick={() => navigate("/caracters")}>
                Annuler
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default CaractersEdition;
