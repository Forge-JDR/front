import React from "react";
import { useTranslation } from "react-i18next";

import "./login.css";
import SubmitButton from "../../UI/molecules/submitButton/submitButton";
import Form from "../../UI/organisms/Form";
import { useTranslation } from "react-i18next";
import Input from "../../UI/atoms/input/Input";
import { login } from "../../../store/store";
import forgeLogo from "../../../assets/logo_complet.svg";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="form-register-container">
        <p className="form-title">{t("login.title")}</p>
        <Form id="login-form" className="form-register">
          <FieldForm
            label={t("login.username") + " *"}
            name="pseudo"
            required={true}
          />
          <FieldForm
            type="password"
            label={t("login.password") + " *"}
            name="password"
            required={true}
          />
          <SubmitButton onClick="submit">{t("login.submit")}</SubmitButton>
        </Form>
        <div className="logo-container">
          <img src={forgeLogo} alt="Logo" />
        </div>
        <p className="form-register-link">
          {t("login.anyAccount")} <a href="/signup">{t("login.signUp")}</a>
        </p>
      </div>
    </>
  );
};

export default Login;
