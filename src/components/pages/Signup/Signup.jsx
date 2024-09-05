import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import "./signup.css";
import forgeLogo from "../../../assets/logo/logo_complet.svg";

import Button from "../../UI/atoms/button/button";
// import SubmitButton from "../../UI/molecules/submitButton/submitButton";
import FieldForm from "../../UI/molecules/FieldForm/FieldForm";
import Form from "../../UI/organisms/Form";

import { register } from "../../../store/store";
import { useDispatch } from "react-redux";

const Signup = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [Pseudo, setPseudo] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmedPassword, setConfirmedPassword] = useState("");

  const registerSubmit = () => {
    dispatch(
      register({
        email: Email,
        password: Password,
      })
    );
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
          <Button onClick={registerSubmit}>{t("signup.submit")}</Button>
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
