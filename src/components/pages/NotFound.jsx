import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { EmptyState } from "../design-system";
export default function NotFound() {
  return (
    <EmptyState icon={Compass} title="Cette piste ne mène nulle part.">
      La page recherchée n'existe pas.{" "}
      <Link className="text-link" to="/">
        Revenir à l’accueil
      </Link>
    </EmptyState>
  );
}
