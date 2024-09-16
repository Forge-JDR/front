import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logout } from "../../../../store/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./footer.css";

import forgeLogoTxt from "../../../../assets/logo/logo_texte.svg";

import ThemeSwitch from "../../molecules/ThemeSwitch/ThemeSwitch";

const Footer = () => {
  const { t } = useTranslation();
  const token = localStorage.getItem("token");

  let links;

  if (token) {
    links = [
      { name: t("navbar.sheet"), url: "/caracters" },
      { name: t("navbar.creation"), url: "/creation" },
      { name: t("navbar.discover"), url: "/discover" },
    ];
  } else {
    links = [];
  }
  const location = useLocation();

  return (
    <>
      <div className="footer">
        <div className="main-content">
          <div className="logo-txt-container">
            <img className="logo-text" src={forgeLogoTxt} alt="logo_text" />
          </div>
          <div className="links-container">
            <div className="site-plan">
              <div className="navigation">
                <div className="title-navigation">Plan du site</div>
                <div className="links">
                  <li>
                    <Link to="/">Accueil</Link>
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
                </div>
              </div>
              <div className="help-and-contact">
                <div className="title-navigation">Aide & Contact</div>
                <div className="links">
                  <li>
                    <Link to="/contact">Nous contacter</Link>
                  </li>
                  <li>
                    <Link to="/cgu">CGU</Link>
                  </li>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-container">
          <p>Copyright 2024 - Version BETA</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
