import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { store, fetchWikis } from "../../../store/store";
import { Link } from "react-router-dom";

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
    <div onLoad={() => store.dispatch(fetchWikis())}>{WikisElements(wiki)}</div>
  );
};

export default Discover;
