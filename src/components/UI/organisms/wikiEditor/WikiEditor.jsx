import React, { useRef, useState, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

import "./WikiEditor.css";

const WikiEditor = ({ children, defaultContent, onSave }) => {
  const [range, setRange] = useState(null);
  const [lastChange, setLastChange] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const quillRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
    if (!editorInstance.current && quillRef.current) {
      // Initialize Quill editor
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

      // Attach event listeners
      editorInstance.current.on("text-change", () => {
        setLastChange(editorInstance.current.getContents());
      });

      editorInstance.current.on("selection-change", (range) => {
        setRange(range);
      });
    }

    return () => {
      // Clean up the editor on unmount
      if (editorInstance.current) {
        editorInstance.current.off("text-change");
        editorInstance.current.off("selection-change");
        editorInstance.current = null;
      }
    };
  }, []);

  // Update editor content when `defaultContent` changes
  useEffect(() => {
    if (editorInstance.current && defaultContent) {
      try {
        const parsedContent = JSON.parse(defaultContent); // Parse as Delta (JSON)
        editorInstance.current.setContents(parsedContent); // Load the Delta content
      } catch (error) {
        editorInstance.current.setText(defaultContent); // Treat as plain text
      }
    }
  }, [defaultContent]); // This effect runs when `defaultContent` changes

  const saveContent = async () => {
    const contentToSave = editorInstance.current.getContents();
    setIsSaving(true); // Start saving

    if (onSave) {
      await onSave(contentToSave); // Call the save function
    }

    setIsSaving(false); // End saving
    setSaveSuccess(true); // Show success message

    // Hide the success message after 3 seconds
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

      {/* Display success message */}
      {saveSuccess && (
        <div className="save-success-message">
          Sauvegarde effectuée avec succès !
        </div>
      )}
    </div>
  );
};

export default WikiEditor;
