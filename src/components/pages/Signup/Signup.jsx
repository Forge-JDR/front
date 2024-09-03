import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import "./signup.css";
import forgeLogo from "../../../assets/logo/logo_complet.svg";

import SubmitButton from "../../UI/molecules/submitButton/submitButton";
import FieldForm from "../../UI/molecules/FieldForm/FieldForm";
import Form from "../../UI/organisms/Form";

import { register } from "../../../store/store";
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

  const registerSubmit = () => {
    setIsLoading(true);
    setError("");

    dispatch(
      register({
        email: Email,
        username: Pseudo,
        pseudo: Pseudo,
        password: Password,
      })
    )
      .then(() => {
        if (localStorage.getItem("token")) {
          navigate("/");
        }
      })
      .catch((e) => {
        console.log(t("login.error"));
        setError(t("login.error"));
        if (e.response) {
          console.error("Response error:", e.response.data);
        } else if (e.request) {
          console.error("Request error:", e.request);
        } else {
          console.error("Error", e.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setError(t("login.error"));
      });
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
