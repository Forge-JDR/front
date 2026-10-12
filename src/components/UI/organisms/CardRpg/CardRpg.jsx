import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteWiki } from "../../../../store/slices/Wikis.slice";
import LibraryCard from "../../../design-system/LibraryCard";
export default function CardRpg({ id, srcImg, nameRpg, updateList }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <LibraryCard
      id={id}
      name={nameRpg}
      image={srcImg}
      onEdit={() => navigate(`/wiki/edit/${id}`)}
      onDelete={async () => {
        await dispatch(deleteWiki(id)).unwrap();
        updateList?.();
      }}
    />
  );
}
