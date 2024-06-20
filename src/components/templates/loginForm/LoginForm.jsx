import "./loginForm.css";
import SubmitButton from "../../UI/molecules/submitButton/submitButton";
import Form from "../../UI/organisms/Form";
import { ReactSVG } from "react-svg";

import forgeLogo from "../../../assets/logo_complet.svg";

const LoginForm = () => {
  return (
    <>
      <div className="form-register-container">
        <p className="form-title">Login</p>
        <Form id="login-form" className="form-register">
          <label>
            Name:
            <input type="text" name="pseudo" />
          </label>
          <label>
            Name:
            <input type="password" name="pwd" />
          </label>
          <SubmitButton onClick="submit">LOGIN</SubmitButton>
        </Form>
        <div className="logo-container">
          <img src={forgeLogo} alt="Logo" />
        </div>
        <p className="form-register-link">
          Vous n'avez pas de compte<a>S'inscre</a>
        </p>
      </div>
    </>
  );
};

export default LoginForm;
