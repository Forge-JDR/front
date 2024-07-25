import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { store, fetchWikis } from "../../../store/store";
import { Link } from "react-router-dom";

import forgeLogoTxt from "../../../assets/logo/logo_texte.svg";

import AnonymeHome from "../../templates/home/anonymeHome/AnonymeHome";
import ConnectedHome from "../../templates/home/connectedHome/ConnectedHome";
import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";

const Discover = ({ ...props }) => {
  const dispatch = useDispatch();
  const wiki = useSelector((state) => state.wikis.wikisList);
  const wikiStatus = useSelector((state) => state.wikis.status);

  useEffect(() => {
    if (wikiStatus === "idle") {
      dispatch(fetchWikis());
    }
  }, [wikiStatus, dispatch]);

  const WikisElements = (wikiPram) => {
    if (!wikiPram[0]) return <p>On load</p>;

    return wikiPram[0].map((wiki) => {
      return (
        <div id={wiki._id} key={wiki.id}>
          {wiki.Name} : {wiki.Status}, Owner : {wiki.user.pseudo},{" "}
          <Link to={"/wiki/" + wiki.id}>Voir plus</Link>
        </div>
      );
    });
  };

  return (
    <>
      <div className="background creation">
        <div className="background-hexa image">
          <ConnectedNavbar></ConnectedNavbar>
          <div onLoad={() => store.dispatch(fetchWikis())}>
            {WikisElements(wiki)}
          </div>
        </div>
      </div>
      <div className="footer">
        <img className="logo-text" src={forgeLogoTxt} alt="logo_text" />
        <p>Copyright 2024</p>
      </div>
    </>
  );
};

export default Discover;
