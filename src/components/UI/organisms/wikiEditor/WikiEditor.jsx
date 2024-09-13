import React, { useRef, useState, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./WikiEditor.css";

const WikiEditor = ({ children, defaultContent, onSave }) => {
  const [range, setRange] = useState(null);
  const [lastChange, setLastChange] = useState(null);
  const quillRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
    // Initialiser Quill uniquement si l'instance n'existe pas encore
    if (!editorInstance.current && quillRef.current) {
      editorInstance.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            ["image", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
          ],
        },
      });

      // Charger le contenu par défaut si disponible
      if (defaultContent) {
        try {
          const parsedContent = JSON.parse(defaultContent); // Traiter le contenu comme Delta (JSON)
          editorInstance.current.setContents(parsedContent);
        } catch (error) {
          console.error("Erreur lors du parsing du contenu", error);
          editorInstance.current.setText(defaultContent); // Si erreur, afficher le texte brut
        }
      }

      editorInstance.current.on("text-change", () => {
        setLastChange(editorInstance.current.getContents());
      });

      editorInstance.current.on("selection-change", (range) => {
        setRange(range);
      });
    }

    // Nettoyer les événements et l'instance au démontage du composant
    return () => {
      if (editorInstance.current) {
        editorInstance.current.off("text-change");
        editorInstance.current.off("selection-change");
        editorInstance.current = null; // Supprimer l'instance
      }
    };
  }, [defaultContent]);

  const saveContent = () => {
    const contentToSave = editorInstance.current.getContents();
    if (onSave) {
      onSave(contentToSave); // Appeler la fonction de rappel avec le contenu de l'éditeur
    }
  };

  return (
    <div>
      {/* Utiliser un div simple pour Quill */}
      <div ref={quillRef} style={{ height: "300px" }} />

      {children}

      <div className="controls">
        <button className="controls-right" onClick={saveContent}>
          Sauvegarder
        </button>
      </div>

      <div className="state">
        <div className="state-title">Current Range:</div>
        {range ? JSON.stringify(range) : "Empty"}
      </div>
      <div className="state">
        <div className="state-title">Last Change:</div>
        {lastChange ? JSON.stringify(lastChange.ops) : "Empty"}
      </div>
    </div>
  );
};

export default WikiEditor;
