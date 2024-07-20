import React from "react";
import SubmitButton from "../../UI/molecules/submitButton/submitButton";
import FieldForm from "../../UI/molecules/FieldForm/FieldForm";
import { useTranslation } from "react-i18next";
import forgeLogo from "../../../assets/logo_complet.svg";
import Form from "../../UI/organisms/Form";

const Signup = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="form-register-container">
        <p className="form-title">{t("signup.title")}</p>
        <Form id="signup-form" className="form-register">
          <FieldForm
            label={t("signup.username") + " *"}
            name="pseudo"
            required={true}
          />
          <FieldForm
            type="email"
            label={t("signup.email") + " *"}
            name="email"
            required={true}
          />
          <FieldForm
            type="password"
            label={t("signup.password") + " *"}
            name="password"
            required={true}
          />
          <FieldForm
            type="password"
            label={t("signup.confirmPassword") + " *"}
            name="confirmPassword"
            required={true}
          />
          <SubmitButton onClick="submit">{t("signup.submit")}</SubmitButton>
        </Form>
        <div className="logo-container">
          <img src={forgeLogo} alt="Logo" />
        </div>
        <p className="form-register-link">
          {t("signup.anyAccount")} <a href="/login">{t("signup.login")}</a>
        </p>
      </div>
    </>
  );
};

export default Signup;
