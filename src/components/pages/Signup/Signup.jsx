import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import "./signup.css";
import forgeLogo from "../../../assets/logo/logo_complet.svg";

import SubmitButton from "../../UI/molecules/submitButton/submitButton";
import FieldForm from "../../UI/molecules/FieldForm/FieldForm";
import Form from "../../UI/organisms/Form";
import { setMessage } from "../../../store/slices/message.slice";

import { register } from "../../../store/store";
import { login } from "../../../store/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(t(""));

  const [Pseudo, setPseudo] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmedPassword, setConfirmedPassword] = useState("");

  const registerSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      try {
        // Étape 1: Lancer l'inscription
        await dispatch(
          register({
            email: Email,
            username: Pseudo,
            pseudo: Pseudo,
            password: Password,
          })
        ).unwrap(); // Unwrap pour gérer l'erreur directement
      } catch (error) {
        console.log("erreur inscription : " + error);
      }

      let loginResult;
      try {
        // Étape 2: Lancer la connexion si l'inscription est réussie
        loginResult = await dispatch(
          login({
            username: Pseudo,
            password: Password,
          })
        ).unwrap();
        console.log(loginResult);
      } catch (error) {
        console.log("erreur a la connexion : " + error);
      }

      // Étape 3: Rediriger vers la page d'accueil si la connexion est réussie
      if (loginResult.token) {
        console.log("navigatoin accueil");
        navigate("/");
      }
    } catch (error) {
      setError("Inscription ou connexion échouée.");
      dispatch(setMessage(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-container signup">
      <div className="form-register-container">
        <p className="form-title">{t("signup.title")}</p>
        <Form id="signup-form" className="form-register">
          <FieldForm
            label={t("signup.username") + " *"}
            name="pseudo"
            required={true}
            value={Pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
          <FieldForm
            type="email"
            label={t("signup.email") + " *"}
            name="email"
            required={true}
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FieldForm
            label={t("signup.password") + " *"}
            name="password"
            required={true}
            type="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FieldForm
            label={t("signup.confirmPassword") + " *"}
            name="confirmPassword"
            required={true}
            type="password"
            value={ConfirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <SubmitButton onClick={registerSubmit} disabled={isLoading}>
            {isLoading ? t("login.loading") : t("signup.submit")}
          </SubmitButton>
        </Form>
        <div className="logo-container">
          <a href="/">
            <img src={forgeLogo} alt="Logo" />
          </a>
        </div>
        <p className="form-register-link">
          {t("signup.anyAccount")} <a href="/login">{t("signup.login")}</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
