import React from "react";
import "./login.css";
import LoginForm from "../../templates/loginForm/LoginForm";
import Hexagon from "../../UI/atoms/hexagon/hexagon";
import HexagonBackground from "../../UI/molecules/hexagonsBackground/hexagonsBackground";

const Login = () => {
  return (
    <>
      <LoginForm></LoginForm>

      {/* <HexagonBackground></HexagonBackground> */}
    </>
    // <div>
    //   <h1>Page de connexion</h1>
    //   <form>
    //     <div>
    //       <label htmlFor="username">Nom d'utilisateur :</label>
    //       <input type="text" id="username" name="username" />
    //     </div>
    //     <div>
    //       <label htmlFor="password">Mot de passe :</label>
    //       <input type="password" id="password" name="password" />
    //     </div>
    //     <button type="submit">Se connecter</button>
    //   </form>
    // </div>
  );
};

export default Login;
