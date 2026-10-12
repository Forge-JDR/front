import React, { useState } from "react";
import emailjs from "emailjs-com";
import { Mail, Send } from "lucide-react";
import { Button, Field, Notice, PageHeader } from "../../design-system";
import "./contact.css";

export default function Contact() {
  const [data, setData] = useState({
    name: "",
    email: "",
    type: "Question",
    title: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const configured = Boolean(
    process.env.REACT_APP_EMAILJS_SERVICE_ID &&
    process.env.REACT_APP_EMAILJS_TEMPLATE_ID &&
    process.env.REACT_APP_EMAILJS_USER_ID,
  );
  const change = (key) => (event) =>
    setData({ ...data, [key]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    if (!configured) return;
    setBusy(true);
    setError("");
    setSent(false);
    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: data.name,
          from_email: data.email,
          subject: data.title,
          message: data.message,
          message_type: data.type,
        },
        process.env.REACT_APP_EMAILJS_USER_ID,
      );
      setSent(true);
      setData({ ...data, title: "", message: "" });
    } catch {
      setError("Le message n’a pas pu être envoyé. Réessayez dans un instant.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="contact-modern">
      <PageHeader
        eyebrow="RESTONS EN CONTACT"
        title="Une question, une idée ?"
        description="Un retour sur votre atelier ou un problème à nous signaler : écrivez-nous."
      />
      <div className="contact-layout">
        <section className="ui-card contact-form">
          <Notice>
            {error ||
              (!configured
                ? "Le formulaire de contact n’est pas disponible pour le moment."
                : "")}
          </Notice>
          <Notice variant="success">
            {sent ? "Votre message a bien été envoyé." : ""}
          </Notice>
          <form onSubmit={submit}>
            <fieldset disabled={busy} className="plain-fieldset">
              <div className="form-grid">
                <Field
                  label="Votre nom"
                  required
                  value={data.name}
                  onChange={change("name")}
                  autoComplete="name"
                />
                <Field
                  label="Votre e-mail"
                  type="email"
                  required
                  value={data.email}
                  onChange={change("email")}
                  autoComplete="email"
                />
              </div>
              <Field
                label="Sujet de votre demande"
                as="select"
                value={data.type}
                onChange={change("type")}
              >
                <option>Question</option>
                <option>Suggestion</option>
                <option>Problème rencontré</option>
              </Field>
              <Field
                label="Objet du message"
                required
                value={data.title}
                onChange={change("title")}
              />
              <Field
                label="Votre message"
                as="textarea"
                required
                value={data.message}
                onChange={change("message")}
                placeholder="Dites-nous ce que vous avez en tête…"
              />
              <div className="form-actions">
                <Button
                  type="submit"
                  icon={Send}
                  busy={busy}
                  disabled={!configured}
                >
                  Envoyer mon message
                </Button>
              </div>
            </fieldset>
          </form>
        </section>
        <aside className="contact-note">
          <Mail size={26} strokeWidth={1.5} />
          <h2>Construisons la forge ensemble.</h2>
          <p>
            Vos retours nous aident à rendre la préparation des aventures plus
            simple et plus agréable.
          </p>
          <p>
            Pour signaler un problème, décrivez les étapes et le résultat que
            vous attendiez.
          </p>
        </aside>
      </div>
    </div>
  );
}
