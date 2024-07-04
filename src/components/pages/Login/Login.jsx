import React from "react";
import "./login.css";
import Hexagon from "../../UI/atoms/hexagon/hexagon";
import HexagonBackground from "../../UI/molecules/hexagonsBackground/hexagonsBackground";
import SubmitButton from "../../UI/molecules/submitButton/submitButton";
import Form from "../../UI/organisms/Form";
import FieldForm from "../../UI/molecules/FieldForm/FieldForm";
import { useTranslation } from "react-i18next";
import forgeLogo from "../../../assets/logo_complet.svg";
import SubmitButton from "../../UI/molecules/submitButton/submitButton";
import Form from "../../UI/organisms/Form";
import FieldForm from "../../UI/molecules/FieldForm/FieldForm";
import { useTranslation } from "react-i18next";
import forgeLogo from "../../../assets/logo_complet.svg";

const Login = () => {
  const { t } = useTranslation();
  const { t } = useTranslation();
  return (
    <>
      <div className="form-register-container">
        <p className="form-title">Login</p>
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