import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./login.css";
import SubmitButton from "../../UI/molecules/submitButton/submitButton";
import Form from "../../UI/organisms/Form";
import { useTranslation } from 'react-i18next';
import Input from "../../UI/atoms/input/Input";
import { login } from "../../../store/store";

import forgeLogo from "../../../assets/logo_complet.svg";
import {Route, useNavigate} from 'react-router-dom';

const Login = ({ ...props }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  return (
    < >
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
                      login({
                        username: Email,
                        password: Password,
                      })
                    )
                    .then(() => {
                      if (localStorage.getItem("token")) {
                        navigate('/discover');
                      }
                    });

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

export default Login;
