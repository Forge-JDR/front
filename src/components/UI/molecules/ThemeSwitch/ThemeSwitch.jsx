import React from "react";
import "./themeSwitch.css";

import darkIcon from "../../../../assets/icone/dark.png";
import lightIcon from "../../../../assets/icone/light.png";

const ThemeSwitch = ({ onClick, theme }) => {
  return (
    <li className="theme-switch">
      <button onClick={onClick} className="theme-switch-button">
        {theme === "dark" ? (
          <>
            <img src={darkIcon} alt="Light Mode" className="theme-icon light" />
            <img
              src={lightIcon}
              alt="Dark Mode"
              className="theme-icon dark hidden"
            />
          </>
        ) : (
          <>
            <img
              src={darkIcon}
              alt="Light Mode"
              className="theme-icon dark hidden"
            />
            <img
              src={lightIcon}
              alt="Light Mode"
              className="theme-icon light"
            />
          </>
        )}
      </button>
    </li>
  );
};

export default ThemeSwitch;
