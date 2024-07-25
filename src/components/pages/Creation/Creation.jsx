import React from "react";

import "./creation.css";

import AnonymeHome from "../../templates/home/anonymeHome/AnonymeHome";
import ConnectedHome from "../../templates/home/connectedHome/ConnectedHome";
import ConnectedNavbar from "../../templates/connectedNavBar/ConnectedNavbar";
import WikiEditor from "../../UI/organisms/wikiEditor/WikiEditor";

const Creation = () => {
  return (
    <div className="background creation">
      <ConnectedNavbar></ConnectedNavbar>
      <div className="wiki-editor">
        <WikiEditor />
      </div>
    </div>
  );
};

export default Creation;
