import React, { useRef, useState, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./WikiEditor.css";

const WikiEditor = ({ children, defaultContent, onSave }) => {
  const [range, setRange] = useState();
  const [lastChange, setLastChange] = useState();
  const [readOnly, setReadOnly] = useState(false);
  const quillRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
    // Assurez-vous que l'éditeur Quill n'est pas initialisé deux fois
    if (editorInstance.current) {
      editorInstance.current = null;
    }

    if (quillRef.current) {
      // Détruire l'instance Quill précédente avant de recréer une nouvelle instance
      if (editorInstance.current) {
        editorInstance.current = null;
      }

      // Initialiser l'éditeur Quill
      editorInstance.current = new Quill(quillRef.current, {
        theme: "snow",
        readOnly: readOnly,
        modules: {
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['image', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
          ],
        },
      });

      // Charger le contenu par défaut
      if (defaultContent && defaultContent.Content) {
        try {
          const parsedContent = JSON.parse(defaultContent.Content); // Si c'est un Delta (JSON)
          editorInstance.current.setContents(parsedContent); // Charger le Delta
        } catch (error) {
          editorInstance.current.setText(defaultContent.Content); // Sinon, traiter comme du texte brut
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
  }, [readOnly, defaultContent]);

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
          Save Content
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
