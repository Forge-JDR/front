import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const QuillEditor = ({ value, onChange }) => {
  const quillRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
    if (!editorInstance.current && quillRef.current) {
      // Initialiser Quill une seule fois
      editorInstance.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
          ],
        },
      });

      // Gérer les changements dans Quill
      editorInstance.current.on('text-change', () => {
        const content = editorInstance.current.getContents();
        onChange(content);
      });
    }

    // Charger le contenu dans l'éditeur sans recréer l'instance
    if (editorInstance.current && value) {
      const currentContent = editorInstance.current.getContents();
      if (JSON.stringify(currentContent) !== JSON.stringify(value)) {
        editorInstance.current.setContents(value);
      }
    }
  }, [value, onChange]);

  return <div ref={quillRef} className="ql-editor-container" style={{ height: '150px' }} />;
};

export default QuillEditor;
