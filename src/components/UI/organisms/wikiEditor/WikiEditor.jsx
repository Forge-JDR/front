import React, { useRef, useState, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./WikiEditor.css";

const WikiEditor = ({ children, defaultContent, onSave }) => {
  const [range, setRange] = useState(null);
  const [lastChange, setLastChange] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false); // Nouvel état pour le message de sauvegarde réussie
  const quillRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
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

      if (defaultContent) {
        try {
          const parsedContent = JSON.parse(defaultContent); // Si c'est un Delta (JSON)
          editorInstance.current.setContents(parsedContent); // Charger le Delta
        } catch (error) {
          editorInstance.current.setText(defaultContent); // Sinon, traiter comme du texte brut
        }
      }

      editorInstance.current.on("text-change", () => {
        setLastChange(editorInstance.current.getContents());
      });

      editorInstance.current.on("selection-change", (range) => {
        setRange(range);
      });
    }

    // Nettoyer l'éditeur au démontage du composant
    return () => {
      if (editorInstance.current) {
        editorInstance.current.off("text-change");
        editorInstance.current.off("selection-change");
        editorInstance.current = null;
      }
    };
  }, [defaultContent]);

  const saveContent = async () => {
    const contentToSave = editorInstance.current.getContents();
    setIsSaving(true); // Commence la sauvegarde

    if (onSave) {
      await onSave(contentToSave); // Appeler la fonction de sauvegarde
    }

    setIsSaving(false); // Fin de la sauvegarde
    setSaveSuccess(true); // Affiche le message de succès

    // Cacher le message après 3 secondes
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div>
      <div ref={quillRef} style={{ height: "300px" }} />

      {children}

      <div className="controls">
        <button
          className="controls-right"
          onClick={saveContent}
          disabled={isSaving}
        >
          {isSaving ? "Chargement..." : "Sauvegarder"}
        </button>
      </div>

      {/* Affichage du message de confirmation */}
      {saveSuccess && (
        <div className="save-success-message">
          Sauvegarde effectuée avec succès !
        </div>
      )}

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
