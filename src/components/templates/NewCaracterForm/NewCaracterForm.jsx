import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addCaracter } from "../../../store/store";
import { Button, Field, Modal, Notice } from "../../design-system";
export default function NewCaracterForm({ closeForm, updateList }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await dispatch(
        addCaracter({
          name,
          content: JSON.stringify({ ops: [{ insert: description + "\n" }] }),
        }),
      ).unwrap();
      updateList?.();
      closeForm();
    } catch {
      setError(
        "Le personnage n’a pas pu être créé. Votre saisie a été conservée.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title="Créer une fiche libre"
      description="L’histoire de votre personnage, à enrichir dans l’éditeur."
      onClose={closeForm}
      busy={busy}
    >
      <Notice>{error}</Notice>
      <form onSubmit={submit}>
        <fieldset className="plain-fieldset" disabled={busy}>
          <Field
            label="Nom du personnage"
            required
            maxLength={255}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Field
            label="Histoire et notes"
            as="textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <div className="form-actions">
            <Button variant="secondary" onClick={closeForm}>
              Annuler
            </Button>
            <Button type="submit" busy={busy}>
              Créer la fiche
            </Button>
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}
