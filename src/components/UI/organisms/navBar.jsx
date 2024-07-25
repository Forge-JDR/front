import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Accueil</Link>
        </li>
        <li>
          <Link to="/login">Connexion</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
