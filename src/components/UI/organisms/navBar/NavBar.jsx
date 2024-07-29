import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logout } from "../../../../store/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./navbar.css";

import forgeLogo from "../../../../assets/logo/logo_complet.svg";
import iconeUser from "../../../../assets/icone_user.svg";

const NavBar = ({ links }) => {
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const [showSubMenu, setShowSubMenu] = useState(false);

  const handleUserIconClick = () => {
    setShowSubMenu(!showSubMenu);
  };

  const handleLogout = () => {
    dispatch(logout())
      .then(() => {
        if (!localStorage.getItem("token")) {
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        // Optionally handle the error here
      });
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

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
        <div className="change-langage-container">
          <li className="change-langage">
            <div
              className={`change-langage-btn ${
                i18n.language === "en" ? "active" : ""
              }`}
              onClick={() => changeLanguage("en")}
            >
              EN
            </div>
            <div
              className={`change-langage-btn ${
                i18n.language === "fr" ? "active" : ""
              }`}
              onClick={() => changeLanguage("fr")}
            >
              FR
            </div>
          </li>
        </div>
        <li className="icone login-link">
          <div className="icone-container" onClick={handleUserIconClick}>
            <img className="icone_user" src={iconeUser} alt="utilisateur" />
          </div>
          {showSubMenu && (
            <>
              {token ? (
                <ul className="sub-menu">
                  <li>
                    <div onClick={handleLogout}>{t("home.logout")}</div>
                  </li>
                </ul>
              ) : (
                <ul className="sub-menu">
                  <li>
                    <Link to="/login" onClick={() => setShowSubMenu(false)}>
                      {t("home.login")}
                    </Link>
                  </li>
                </ul>
              )}
            </>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
