import React from "react";
import { useTranslation } from "react-i18next";

import NavBar from "../../UI/organisms/navBar/NavBar";
import background from "../../../assets/hexa_background.svg";

const ConnectedNavbar = () => {
  const { t } = useTranslation();

  const links = [
    { name: t("navbar.sheet"), url: "/" },
    { name: t("navbar.creation"), url: "/creation" },
    { name: t("navbar.discover"), url: "/login" },
  ];

  return (
    <div>
      <NavBar links={links} />
    </div>
  );
};

export default ConnectedNavbar;
