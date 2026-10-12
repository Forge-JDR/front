import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addWiki } from "../../../store/store";
import { Button, Field, Modal, Notice } from "../../design-system";
export default function NewRpgForm({ closeForm }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await dispatch(
        addWiki({
          Name: name,
          Content: JSON.stringify({ ops: [{ insert: description + "\n" }] }),
        }),
      ).unwrap();
      closeForm();
      navigate(`/wiki/edit/${data.id}`);
    } catch {
      setError("Le wiki n’a pas pu être créé. Votre saisie a été conservée.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title="Créer un wiki"
      description="Un espace de rédaction libre pour votre univers."
      onClose={closeForm}
      busy={busy}
    >
      <Notice>{error}</Notice>
      <form onSubmit={submit}>
        <fieldset className="plain-fieldset" disabled={busy}>
          <Field
            label="Nom du wiki"
            required
            maxLength={255}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Field
            label="Présentation de l’univers"
            as="textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <div className="form-actions">
            <Button variant="secondary" onClick={closeForm}>
              Annuler
            </Button>
            <Button type="submit" busy={busy}>
              Créer le wiki
            </Button>
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}
