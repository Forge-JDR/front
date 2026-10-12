import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  Feather,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Landscape } from "../../design-system";
import "./landing.css";

export default function Landing() {
  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-copy">
          <span className="landing-tag">
            <span className="status-dot" />
            L'atelier de vos jeux de rôle
          </span>
          <h1>
            Des mondes à inventer.
            <br />
            <em>Des histoires à vivre.</em>
          </h1>
          <p>
            Vos univers, vos règles, vos personnages.
            <br />
            Forge JDR rassemble tout ce qu’il faut pour préparer
            <br className="desktop-break" /> votre prochaine aventure, à votre
            façon.
          </p>
          <div className="landing-actions">
            <Link to="/signup" className="ui-button ui-button--primary">
              Ouvrir mon atelier
              <ArrowRight size={16} />
            </Link>
            <a className="landing-explore" href="#comment-ca-marche">
              Découvrir la forge
              <ArrowRight size={15} />
            </a>
          </div>
          <div className="landing-assurance">
            <ShieldCheck size={15} />
            Vos créations restent dans votre espace personnel.
          </div>
        </div>
        <div
          className="landing-preview"
          aria-label="Illustration d’un atelier de jeu de rôle"
        >
          <div className="preview-label">
            <Compass size={15} />
            Un aperçu de votre futur atelier
          </div>
          <div className="preview-world">
            <Landscape seed={0} />
            <div>
              <span className="eyebrow">VOTRE PROCHAIN UNIVERS</span>
              <h2>Les terres d’Astrée</h2>
              <p>Un monde à façonner. Une histoire à écrire.</p>
              <span className="preview-pill">
                JDR personnalisé
                <BookOpen size={12} />
              </span>
            </div>
          </div>
          <div className="preview-character">
            <div className="preview-avatar">
              <Users size={22} />
            </div>
            <div>
              <span>FICHE DE PERSONNAGE</span>
              <strong>Éloi, gardien des brumes</strong>
              <div className="preview-stats">
                <span>
                  Force <b>14</b>
                </span>
                <span>
                  Esprit <b>18</b>
                </span>
                <span>
                  Agilité <b>12</b>
                </span>
              </div>
            </div>
          </div>
          <div className="preview-note">
            <Feather size={14} />
            La prochaine séance commence par une idée.
          </div>
        </div>
      </section>
      <div className="landing-divider">
        <span>UN SEUL ESPACE. TOUTES VOS AVENTURES.</span>
      </div>
      <section id="comment-ca-marche" className="landing-features">
        <div className="landing-section-title">
          <span className="eyebrow">DE L'IDÉE À LA TABLE</span>
          <h2>Faites place à votre imagination.</h2>
          <p>Un atelier simple pour garder l’essentiel à portée de main.</p>
        </div>
        <div className="landing-feature-grid">
          {[
            {
              icon: BookOpen,
              number: "01",
              title: "Forgez votre univers",
              text: "Décrivez votre monde, écrivez vos règles et définissez les caractéristiques de vos personnages.",
            },
            {
              icon: Users,
              number: "02",
              title: "Donnez vie à vos héros",
              text: "Créez des fiches adaptées à votre système, avec leurs valeurs, leur histoire et leurs notes.",
            },
            {
              icon: Compass,
              number: "03",
              title: "Gardez le fil de l’aventure",
              text: "Rassemblez vos personnages dans une partie et retrouvez la progression et le journal de votre campagne.",
            },
          ].map(({ icon: Icon, number, title, text }) => (
            <article className="landing-feature" key={number}>
              <div>
                <Icon size={24} strokeWidth={1.5} />
                <span>{number}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="landing-cta">
        <div>
          <span className="eyebrow">LA PAGE EST ENCORE BLANCHE</span>
          <h2>
            Votre prochaine aventure
            <br />
            n’attend que vous.
          </h2>
          <p>
            <Check size={14} />
            Un compte, un univers, et votre imagination.
          </p>
        </div>
        <Link to="/signup" className="ui-button ui-button--copper">
          Créer mon compte
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
