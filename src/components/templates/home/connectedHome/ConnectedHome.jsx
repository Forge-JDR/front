import React from "react";
import { useTranslation } from "react-i18next";

import NavBar from "../../../UI/organisms/navBar/NavBar";

const ConnectedHome = () => {
  const { t } = useTranslation();

  const links = [
    { name: t("navbar.sheet"), url: "/" },
    { name: t("navbar.game"), url: "/login" },
    { name: t("navbar.discover"), url: "/login" },
  ];

  return (
    <div>
      <NavBar links={links} />
      <h1>{t("home.welcome")}</h1>
    </div>
  );
};

export default ConnectedHome;
