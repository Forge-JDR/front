import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./signUp.css";
import SubmitButton from "../../UI/molecules/submitButton/submitButton";
import Form from "../../UI/organisms/Form";
import { ReactSVG } from "react-svg";
import { useTranslation } from 'react-i18next';
import Input from "../../UI/atoms/input/Input";
import { register } from "../../../store/store";

import forgeLogo from "../../../assets/logo_complet.svg";

const SignUp = ({ ...props }) => {
  const { t } = useTranslation();
  
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  return (
    <>
      <div className="form-register-container">
        <p className="form-title">{t('login.title')}</p>
        <Form id="login-form" className="form-register">
          <Input type="text" id="email" name="email" label={t('login.email')} 
            value={Email}
            onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" id="pwd" name="pwd" label={t('login.password')} value={Password}
            onChange={(e) => setPassword(e.target.value)}/>
          <SubmitButton  onClick={() => {
                    dispatch(
                      register({
                        email: Email,
                        password: Password,
                      })
                    );
                  }}>{t('login.submit')}</SubmitButton>
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

export default SignUp;
