import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./login.css";
import forgeLogo from "../../../assets/logo/logo_complet.svg";
import eyeIcon from "../../../assets/icone/eye-icon.png";

import Button from "../../UI/atoms/button/button";
// import SubmitButton from "../../UI/molecules/submitButton/submitButton";
import FieldForm from "../../UI/molecules/FieldForm/FieldForm";
import Form from "../../UI/organisms/Form";

import { login } from "../../../store/store";

const Login = ({ ...props }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(t(""));

  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const loginSubmit = () => {
    setIsLoading(true);
    setError("");

    if (!validateFields()) {
      setIsLoading(false);
      return; // Ne pas envoyer la requête si la validation échoue
    }

    dispatch(
      login({
        username: Email,
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

  const validateFields = () => {
    let valid = true;

    if (!Email) {
      setEmailError("Ce champ est obligatoire");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!Password) {
      setPasswordError("Ce champ est obligatoire");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  return (
    <div className="main-container login">
      <div className="form-register-container">
        <p className="form-title">{t("login.title")}</p>
        <Form id="login-form" className="form-register">
          <FieldForm
            id="email"
            name="pseudo"
            label={t("login.username") + " *"}
            required={true}
            value={Email}
            errorMessage={emailError}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FieldForm
            id="password"
            name="password"
            label={t("login.password") + " *"}
            type={showPassword ? "text" : "password"}
            required={true}
            value={Password}
            errorMessage={passwordError}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="password-toggle-icon login"
            onClick={() => setShowPassword(!showPassword)}
          >
            <img src={showPassword ? eyeIcon : eyeIcon} alt="img" />
          </span>
          {error && <p className="error-message">{error}</p>}
          <Button onClick={loginSubmit} disabled={isLoading}>
            {isLoading ? t("login.loading") : t("login.submit")}
          </Button>
        </Form>

        <div className="logo-container">
          <a href="/">
            <img src={forgeLogo} alt="Logo" />
          </a>
        </div>
        <p className="form-register-link">
          {t("login.anyAccount")} <a href="/signup">{t("login.signup")}</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
