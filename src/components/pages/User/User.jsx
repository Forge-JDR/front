import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { updateAccount } from "../../../store/slices/auth.slice";
import { Button, Field, Notice, PageHeader } from "../../design-system";
import { PasswordField } from "../Auth/Auth";
import "./User.css";

export default function User() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [pseudo, setPseudo] = useState(null);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const save = async (section, body) => {
    setBusy(section);
    setError("");
    setMessage("");
    try {
      await dispatch(updateAccount(body)).unwrap();
      setMessage(
        section === "profile"
          ? "Votre profil a été mis à jour."
          : "Votre mot de passe a été mis à jour.",
      );
      if (section === "password")
        setPasswords({ current: "", next: "", confirm: "" });
    } catch (err) {
      setError(String(err || "La modification n’a pas pu être enregistrée."));
    } finally {
      setBusy("");
    }
  };
  return (
    <div className="account-page">
      <PageHeader
        eyebrow="VOTRE ESPACE"
        title="Mon compte"
        description="Les quelques détails qui font de cet atelier le vôtre."
      />
      <Notice>{error}</Notice>
      <Notice variant="success">{message}</Notice>
      <div className="account-layout">
        <div className="account-forms">
          <section className="ui-card account-section">
            <header>
              <span className="account-icon">
                <UserRound size={21} />
              </span>
              <div>
                <h2>Votre profil</h2>
                <p>Le nom qui vous accompagne dans vos aventures.</p>
              </div>
            </header>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                save("profile", {
                  pseudo: (pseudo ?? user?.pseudo ?? "").trim(),
                });
              }}
            >
              <fieldset disabled={Boolean(busy)}>
                <Field
                  label="Pseudo"
                  autoComplete="nickname"
                  required
                  maxLength={100}
                  value={pseudo ?? user?.pseudo ?? ""}
                  onChange={(event) => setPseudo(event.target.value)}
                  placeholder="Votre nom d’aventurier"
                />
                <Field
                  label="Adresse e-mail"
                  value={user?.username || ""}
                  readOnly
                  hint="L’adresse utilisée pour vous connecter à votre atelier."
                />
                <div className="form-actions">
                  <Button type="submit" busy={busy === "profile"} icon={Check}>
                    Enregistrer mon profil
                  </Button>
                </div>
              </fieldset>
            </form>
          </section>
          <section className="ui-card account-section">
            <header>
              <span className="account-icon">
                <LockKeyhole size={21} />
              </span>
              <div>
                <h2>Sécurité du compte</h2>
                <p>Choisissez un mot de passe que vous seul connaissez.</p>
              </div>
            </header>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (passwords.next !== passwords.confirm) {
                  setError("Les nouveaux mots de passe ne correspondent pas.");
                  return;
                }
                save("password", {
                  password: passwords.next,
                  currentPassword: passwords.current,
                });
              }}
            >
              <fieldset disabled={Boolean(busy)}>
                <PasswordField
                  label="Mot de passe actuel"
                  required
                  autoComplete="current-password"
                  value={passwords.current}
                  onChange={(event) =>
                    setPasswords({ ...passwords, current: event.target.value })
                  }
                />
                <div className="form-grid">
                  <PasswordField
                    label="Nouveau mot de passe"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={4096}
                    required
                    hint="Au moins 8 caractères."
                    value={passwords.next}
                    onChange={(event) =>
                      setPasswords({ ...passwords, next: event.target.value })
                    }
                  />
                  <PasswordField
                    label="Confirmer le nouveau mot de passe"
                    required
                    autoComplete="new-password"
                    value={passwords.confirm}
                    onChange={(event) =>
                      setPasswords({
                        ...passwords,
                        confirm: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-actions">
                  <Button type="submit" busy={busy === "password"} icon={Check}>
                    Mettre à jour le mot de passe
                  </Button>
                </div>
              </fieldset>
            </form>
          </section>
        </div>
        <aside className="ui-card account-aside">
          <span className="avatar account-avatar">
            {(user?.pseudo || "A").slice(0, 1).toUpperCase()}
          </span>
          <h3>{user?.pseudo || "Votre atelier personnel"}</h3>
          <p>Maître de vos aventures</p>
          <div>
            <ShieldCheck size={20} />
            <h4>Un espace qui vous appartient.</h4>
            <p>
              Vos JDR, vos parties et vos personnages sont accessibles depuis
              votre compte personnel.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
