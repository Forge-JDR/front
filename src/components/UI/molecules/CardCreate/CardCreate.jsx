import React from "react";
import { Plus } from "lucide-react";
export default function CardCreate({ title, onClick }) {
  return (
    <button type="button" className="legacy-create-card" onClick={onClick}>
      <span>
        <Plus size={24} />
      </span>
      <strong>{title}</strong>
      <small>Une nouvelle idée à explorer.</small>
    </button>
  );
}
