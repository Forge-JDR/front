import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./login.css";
import forgeLogo from "../../../assets/logo/logo_complet.svg";

import SubmitButton from "../../UI/molecules/submitButton/submitButton";
import FieldForm from "../../UI/molecules/FieldForm/FieldForm";
import Form from "../../UI/organisms/Form";

import { login } from "../../../store/store";

const Login = ({ ...props }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const loginSubmit = () => {
    dispatch(
      login({
        username: Email,
        password: Password,
      })
    ).then(() => {
      if (localStorage.getItem("token")) {
        navigate("/discover");
      }
    });
  };

  return (
    <div className="main-container login">
      <div className="form-register-container">
        <p className="form-title">Login</p>
        <Form id="login-form" className="form-register">
          <FieldForm
            id="email"
            name="pseudo"
            label={t("login.username") + " *"}
            required={true}
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FieldForm
            id="password"
            name="password"
            label={t("login.password") + " *"}
            type="password"
            required={true}
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SubmitButton onClick={loginSubmit}>{t("login.submit")}</SubmitButton>
        </Form>
        <div className="logo-container">
          <a href="/">
            <img src={forgeLogo} alt="Logo" />
          </a>
        </div>
        <p className="form-register-link">
          {t("login.anyAccount")} <a href="/signup">{t("login.signUp")}</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
