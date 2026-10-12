import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Sparkles } from "lucide-react";
import { login, register } from "../../../store/slices/auth.slice";
import { Button, Field, Landscape, Notice } from "../../design-system";
import "./auth.css";

export function PasswordField({ label, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-control">
      <Field {...props} label={label} type={visible ? "text" : "password"} />
      <Button
        variant="ghost"
        className="password-eye"
        icon={visible ? EyeOff : Eye}
        aria-label={`${visible ? "Masquer" : "Afficher"} : ${label.toLowerCase()}`}
        onClick={() => setVisible(!visible)}
      />
    </div>
  );
}
export default function Auth({ signup = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const connected = useSelector((state) => state.auth.isLoggedIn);
  const [data, setData] = useState({
    pseudo: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  if (connected) return <Navigate to="/atelier" replace />;
  const change = (key) => (event) => {
    setData({ ...data, [key]: event.target.value });
    setError("");
    setConfirmError("");
  };
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (signup && data.password !== data.confirm) {
      setConfirmError("Les mots de passe ne correspondent pas.");
      return;
    }
    setBusy(true);
    try {
      await dispatch(
        (signup ? register : login)({
          username: data.email.trim(),
          password: data.password,
          ...(signup ? { pseudo: data.pseudo.trim() } : {}),
        }),
      ).unwrap();
      navigate("/atelier", { replace: true });
    } catch (err) {
      setError(
        signup
          ? String(err || "Impossible de créer votre compte.")
          : "Connexion impossible. Vérifiez votre e-mail et votre mot de passe.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="auth-layout">
      <section className="auth-story">
        <span className="eyebrow">IMAGINEZ. CRÉEZ. JOUEZ.</span>
        <h1>
          Une nouvelle
          <br />
          aventure vous
          <br />
          <em>attend.</em>
        </h1>
        <p>
          Votre prochain monde commence ici.
          <br />
          Tous vos univers, personnages et campagnes,
          <br />
          dans un seul atelier.
        </p>
        <div className="auth-illustration">
          <Landscape seed={0} />
          <div className="auth-story-card">
            <Sparkles size={18} />
            <span>
              Un espace pour vos idées.
              <br />
              <strong>Une forge pour vos aventures.</strong>
            </span>
          </div>
        </div>
        <small>
          <LockKeyhole size={12} />
          Un atelier personnel. Vos créations restent privées.
        </small>
      </section>
      <section className="auth-form-panel">
        <span className="eyebrow">BIENVENUE À LA FORGE</span>
        <h2>
          {signup ? "Ouvrez votre atelier." : "Heureux de vous retrouver."}
        </h2>
        <p>
          {signup
            ? "Créez votre compte et donnez vie à vos premiers univers."
            : "Connectez-vous pour reprendre le fil de vos aventures."}
        </p>
        <Notice>{error}</Notice>
        <form onSubmit={submit}>
          <fieldset disabled={busy}>
            {signup && (
              <Field
                label="Pseudo"
                name="pseudo"
                autoComplete="nickname"
                placeholder="Votre nom d’aventurier"
                required
                maxLength={100}
                value={data.pseudo}
                onChange={change("pseudo")}
              />
            )}
            <Field
              label="Adresse e-mail"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.fr"
              required
              value={data.email}
              onChange={change("email")}
            />
            <PasswordField
              label="Mot de passe"
              name="password"
              autoComplete={signup ? "new-password" : "current-password"}
              minLength={signup ? 8 : undefined}
              maxLength={4096}
              required
              value={data.password}
              onChange={change("password")}
              hint={
                signup
                  ? "Au moins 8 caractères. Les phrases de passe sont acceptées."
                  : undefined
              }
            />
            {signup && (
              <PasswordField
                label="Confirmer le mot de passe"
                name="confirm"
                autoComplete="new-password"
                required
                value={data.confirm}
                onChange={change("confirm")}
                error={confirmError}
              />
            )}
            {signup && (
              <p className="auth-terms">
                En créant votre compte, vous acceptez les{" "}
                <Link to="/cgu">conditions d’utilisation</Link>.
              </p>
            )}
            <Button
              type="submit"
              busy={busy}
              icon={ArrowRight}
              className="auth-submit"
            >
              {signup ? "Créer mon compte" : "Se connecter"}
            </Button>
          </fieldset>
        </form>
        <div className="auth-switch">
          {signup ? "Déjà un atelier ?" : "Pas encore de compte ?"}{" "}
          <Link to={signup ? "/login" : "/signup"}>
            {signup ? "Se connecter" : "Créer un compte"}
          </Link>
        </div>
      </section>
    </div>
  );
}
