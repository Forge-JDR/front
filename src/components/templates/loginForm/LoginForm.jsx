import "./loginForm.css";
import SubmitButton from "../../UI/molecules/submitButton/submitButton";
import Form from "../../UI/organisms/Form";
import FieldForm from "../../UI/molecules/FieldForm/FieldForm";

import forgeLogo from "../../../assets/logo_complet.svg";

const LoginForm = () => {
  return (
    <>
      <div className="form-register-container">
        <p className="form-title">Login</p>
        <Form id="login-form" className="form-register">
          <FieldForm label="Pseudo *" name="pseudo" required={true} />
          <FieldForm
            type="password"
            label="Password *"
            name="password"
            required={true}
          />
          <SubmitButton onClick="submit">LOGIN</SubmitButton>
        </Form>
        <div className="logo-container">
          <img src={forgeLogo} alt="Logo" />
        </div>
        <p className="form-register-link">
          Vous n'avez pas de compte? <a href="/signup">S'inscrire</a>
        </p>
      </div>
    </>
  );
};

export default LoginForm;
