import React, { useState } from "react";
import { ArrowUpRight, Trash2 } from "lucide-react";
import { Button, Landscape, Modal, Notice } from "./index";

export default function LibraryCard({
  name,
  image,
  id,
  subtitle,
  onEdit,
  onDelete,
}) {
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const candidate =
    typeof image === "string" ? image : image?.fichierImage || image?.path;
  const picture = typeof candidate === "string" ? candidate : undefined;
  const remove = async () => {
    setBusy(true);
    setError("");
    try {
      await onDelete();
      setConfirm(false);
    } catch {
      setError(
        "La suppression n’a pas pu être effectuée. Ce contenu est peut-être utilisé dans une partie.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <article className="ui-card library-card">
        {picture ? <img src={picture} alt="" /> : <Landscape seed={id} />}
        <div>
          <h3>{name}</h3>
          {subtitle && <p>{subtitle}</p>}
          <div className="library-card-actions">
            <Button
              variant="ghost"
              icon={Trash2}
              aria-label={`Supprimer ${name}`}
              onClick={() => setConfirm(true)}
            >
              Supprimer
            </Button>
            <Button variant="secondary" icon={ArrowUpRight} onClick={onEdit}>
              Modifier
            </Button>
          </div>
        </div>
      </article>
      {confirm && (
        <Modal
          title={`Supprimer ${name} ?`}
          description="Cette suppression est définitive. Vérifiez que vous n’avez plus besoin de ce contenu."
          onClose={() => setConfirm(false)}
          busy={busy}
        >
          <Notice>{error}</Notice>
          <div className="form-actions">
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => setConfirm(false)}
            >
              Annuler
            </Button>
            <Button variant="danger" busy={busy} icon={Trash2} onClick={remove}>
              Supprimer définitivement
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
