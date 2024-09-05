import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./signup.css";

import forgeLogo from "../../../assets/logo/logo_complet.svg";
import eyeIcon from "../../../assets/icone/eye-icon.png";

import Button from "../../UI/atoms/button/button";
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

  const [pseudoError, setPseudoError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmedPasswordError, setConfirmedPasswordError] = useState("");

  // Nouveaux états pour gérer la visibilité des mots de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const registerSubmit = async () => {
    setIsLoading(true);
    setError("");

    if (!validateFields()) {
      setIsLoading(false);
      return; // Ne pas envoyer la requête si la validation échoue
    }

    try {
      await dispatch(
        register({
          username: Email,
          pseudo: Pseudo,
          password: Password,
        })
      ).unwrap();

      let loginResult;
      loginResult = await dispatch(
        login({
          username: Email,
          password: Password,
        })
      ).unwrap();

      if (loginResult.token) {
        navigate("/");
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);

      if (error === "Pseudo déjà utilisé.") {
        setError("Ce pseudo est déjà pris.");
      } else if (error === "Cet e-mail est déjà utilisé.") {
        setError("Cet e-mail est déjà utilisé.");
      } else {
        setError("Une erreur est survenue lors de l'inscription");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateFields = () => {
    let valid = true;

    if (!Pseudo) {
      setPseudoError("Ce champ est obligatoire");
      valid = false;
    } else {
      setPseudoError("");
    }

    if (!Email) {
      setEmailError("Ce champ est obligatoire");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!Password) {
      setPasswordError("Ce champ est obligatoire");
      valid = false;
    } else if (Password.length < 8 || Password.length > 16) {
      setPasswordError(
        "Le mot de passe doit contenir entre 8 et 16 caractères"
      );
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!ConfirmedPassword) {
      setConfirmedPasswordError("Ce champ est obligatoire");
      valid = false;
    } else if (ConfirmedPassword !== Password) {
      setConfirmedPasswordError("Les mots de passe ne correspondent pas");
      valid = false;
    } else {
      setConfirmedPasswordError("");
    }

    return valid;
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
            errorMessage={pseudoError}
          />

          <FieldForm
            type="email"
            label={t("signup.email") + " *"}
            name="email"
            required={true}
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            errorMessage={emailError}
          />
          {/* Champ de mot de passe avec icône pour afficher/masquer */}
          <div className="password-field">
            <FieldForm
              label={t("signup.password") + " *"}
              name="password"
              required={true}
              type={showPassword ? "text" : "password"} // Bascule entre text et password
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              errorMessage={passwordError}
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img src={showPassword ? eyeIcon : eyeIcon} alt="img" />
            </span>
          </div>

          {/* Champ de confirmation du mot de passe avec icône pour afficher/masquer */}
          <div className="password-field">
            <FieldForm
              label={t("signup.confirmPassword") + " *"}
              name="confirmPassword"
              required={true}
              type={showConfirmedPassword ? "text" : "password"}
              value={ConfirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              errorMessage={confirmedPasswordError}
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}
            >
              <img src={showConfirmedPassword ? eyeIcon : eyeIcon} alt="img" />
            </span>
          </div>

          {error && <p className="error-message">{error}</p>}
          <Button onClick={registerSubmit} disabled={isLoading}>
            {isLoading ? t("login.loading") : t("signup.submit")}
          </Button>
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
