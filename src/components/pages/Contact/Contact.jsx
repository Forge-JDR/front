import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import emailjs from "emailjs-com";

import "./contact.css";

import Footer from "../../UI/organisms/footer/Footer";
import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import FieldForm from "../../UI/molecules/FieldForm/FieldForm"; // Si tu as un composant similaire pour les champs de formulaire
import Button from "../../UI/atoms/button/button"; // Bouton réutilisable, si disponible
import SelectForm from "../../UI/molecules/SelectForm/SelectForm";

const Contact = () => {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [messageType, setMessageType] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Crée l'objet pour l'email
    const templateParams = {
      from_name: name,
      from_email: email,
      subject: title,
      message: message,
      message_type: messageType,
    };

    // Utilise EmailJS pour envoyer l'email
    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID, // Service ID depuis .env
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID, // Template ID depuis .env
        templateParams,
        process.env.REACT_APP_EMAILJS_USER_ID // User ID depuis .env
      )
      .then((result) => {
        console.log("SUCCESS!", result.status, result.text);
        alert("Message envoyé avec succès !");
      })
      .catch((error) => {
        console.log("FAILED...", error);
        alert("Une erreur s'est produite lors de l'envoi.");
      });
  };

  return (
    <>
      <div className="background creation">
        <ConnectedNavbar></ConnectedNavbar>
        <div className="main-container contact-page">
          <div className="title-contact-page">
            <p>{t("contact.title")}</p>
          </div>

          <div className="contact-content">
            <form onSubmit={handleSubmit}>
              <FieldForm
                id="name"
                name="name"
                label={t("contact.name")}
                value={name}
                required={true}
                onChange={(e) => setName(e.target.value)}
              />
              <SelectForm
                id="messageType"
                name="messageType"
                label=""
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
                options={["Question", "Feedback", "Ticket"]} // Liste d'options
              />
              <FieldForm
                id="title"
                name="title"
                label={t("contact.titleMessage")}
                value={title}
                required={true}
                onChange={(e) => setTitle(e.target.value)}
              />
              <FieldForm
                id="message"
                name="message"
                label={t("contact.message")}
                as="textarea"
                value={message}
                required={true}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button className="submit" type="submit">
                {t("contact.send")}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Contact;
