import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import api from "../../../config/api";
import {
  EmptyState,
  Field,
  Landscape,
  Notice,
  PageHeader,
} from "../../design-system";
export default function Discover() {
  const [wikis, setWikis] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api
      .get("/api/wikis")
      .then(({ data }) => {
        if (active) setWikis(data);
      })
      .catch(() => {
        if (active) setError("Les univers publiés n’ont pas pu être chargés.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const filtered = wikis.filter((wiki) =>
    wiki.Name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );
  return (
    <div>
      <PageHeader
        eyebrow="LA BIBLIOTHÈQUE"
        title="Découvrir les univers"
        description="Les créations partagées par les auteurs de la forge."
      />
      <Notice>{error}</Notice>
      <div className="discover-search">
        <Field
          label="Rechercher un univers"
          placeholder="Le nom d’un monde à explorer…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      {loading ? (
        <p role="status">Chargement des univers…</p>
      ) : filtered.length === 0 ? (
        <div className="ui-card">
          <EmptyState
            icon={BookOpen}
            title={
              search
                ? "Aucun univers ne correspond à votre recherche."
                : "Les premiers mondes sont encore à l’écriture."
            }
          >
            Les univers apparaîtront ici après leur publication.
          </EmptyState>
        </div>
      ) : (
        <div className="world-grid">
          {filtered.map((wiki) => (
            <Link
              to={`/wiki/${wiki.id}`}
              className="ui-card world-card"
              key={wiki.id}
            >
              <Landscape seed={wiki.id} />
              <div className="world-card-body">
                <span className="card-kicker">UNIVERS PUBLIÉ</span>
                <h3>{wiki.Name}</h3>
                <p>
                  Un monde créé par{" "}
                  {wiki.user?.pseudo || "un auteur de la forge"}.
                </p>
                <span className="text-link">Explorer l’univers →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
