import "./loginForm.css";
import SubmitButton from "../../UI/molecules/submitButton/submitButton";
import Form from "../../UI/organisms/Form";
import { ReactSVG } from "react-svg";
import { useTranslation } from 'react-i18next';
import Input from "../../UI/atoms/input/Input";

import forgeLogo from "../../../assets/logo_complet.svg";

const LoginForm = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="form-register-container">
        <p className="form-title">{t('login.title')}</p>
        <Form id="login-form" className="form-register">
          <Input type="text" id="pseudo" name="pseudo" label={t('login.username')} />
          <Input type="password" id="pwd" name="pwd" label={t('login.password')} />
          <SubmitButton onClick="submit">{t('login.submit')}</SubmitButton>
        </Form>
        <div className="logo-container">
          <img src={forgeLogo} alt="Logo" />
        </div>
        <p className="form-register-link">
          {t('login.anyAccount')} <a>{t('login.signUp')}</a>
        </p>
      </div>
    </>
  );
};

export default LoginForm;
