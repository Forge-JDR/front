import React from "react";
import { Link, useLocation } from "react-router-dom";

import "./navbar.css";

import forgeLogo from "../../../../assets/logo/logo_complet.svg";
import iconeUser from "../../../../assets/icone_user.svg";

const NavBar = ({ links }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <ul>
        <li className="logo home-link">
          <Link to="/">
            <div className="logo-container-navbar">
              <img className="logo image link" src={forgeLogo} alt="Logo" />
            </div>
          </Link>
        </li>
        {links.map((link, index) => (
          <li key={index}>
            <Link
              to={link.url}
              className={location.pathname === link.url ? "active-link" : ""}
            >
              {link.name}
            </Link>
          </li>
        ))}
        <li className="icone login-link">
          <Link to="/login">
            <div className="icone-container">
              <img className="icone_user" src={iconeUser} alt="utilisateur" />
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
