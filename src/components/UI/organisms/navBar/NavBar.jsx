import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logout } from "../../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./navbar.css";

import forgeLogo from "../../../../assets/logo/logo_dé.svg";
import iconeUser from "../../../../assets/icone_user.svg";
import menuIcon from "../../../../assets/menu-icon.png";
import closeIcon from "../../../../assets/close-icon.png";

import ThemeSwitch from "../../molecules/ThemeSwitch/ThemeSwitch";

const NavBar = ({ links }) => {
  const { t, i18n } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("token");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // État pour le menu burger

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
      });
  };

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "";
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="navbar">
        <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
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
          <div className="theme-switch-container">
            <ThemeSwitch onClick={toggleTheme} theme={theme} />
          </div>
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
              <ul className="sub-menu">
                {token ? (
                  <>
                    {user?.pseudo && <p>{user.pseudo}</p>}
                    {user?.roles?.includes("ROLE_ADMIN") && (
                      <li>
                        <Link to="/admin/wiki">Panel admin</Link>
                      </li>
                    )}
                    <li>
                      <Link to="/user">Mon compte</Link>
                    </li>
                    <li>
                      <div onClick={handleLogout}>{t("home.logout")}</div>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/login" onClick={() => setShowSubMenu(false)}>
                      {t("home.login")}
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </li>
        </ul>
        <div className={`burger-menu ${isMenuOpen ? "open" : ""}`}>
          <img src={menuIcon} alt="Menu" />
        </div>
      </nav>
      <div
        className={`burger-menu ${isMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <img src={menuIcon} alt="Menu" />
      </div>
      {isMenuOpen && (
        <div className="menu-lateral">
          <img
            src={closeIcon}
            alt="close"
            className="close-icon"
            onClick={toggleMenu}
          />
          <div className="nav-links container">
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
                  className={
                    location.pathname === link.url ? "active-link" : ""
                  }
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <div className="separator alf"></div>
            <li>
              <Link to="/user">Mon compte</Link>
            </li>
            <li className="new-menu">
              <a href="/contact">Nous contacter</a>
            </li>
            <li className="new-menu">
              <a href="/cgu">CGU</a>
            </li>
            <div className="connexion-box">
              <div className="separator all"></div>
              {token ? (
                <>
                  <li>
                    <Link onClick={handleLogout}>{t("home.logout")}</Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" onClick={() => setShowSubMenu(false)}>
                    {t("home.login")}
                  </Link>
                </li>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
