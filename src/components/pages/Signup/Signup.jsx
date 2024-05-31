import React from 'react';

const Signup = () => {
  return (
    <div>
      <h1>Page d'inscription</h1>
      <form>
        <div>
          <label htmlFor="username">Nom d'utilisateur :</label>
          <input type="text" id="username" name="username" />
        </div>
        <div>
          <label htmlFor="password">Mot de passe :</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Signup;