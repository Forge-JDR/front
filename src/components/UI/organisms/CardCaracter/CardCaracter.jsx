import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteCaracter } from "../../../../store/slices/caracters.slice";
import LibraryCard from "../../../design-system/LibraryCard";
export default function CardCaracter({
  id,
  srcImg,
  nameCaracter,
  rpgName,
  updateList,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <LibraryCard
      id={id}
      name={nameCaracter}
      subtitle={rpgName}
      image={srcImg}
      onEdit={() => navigate(`/caracters/edit/${id}`)}
      onDelete={async () => {
        await dispatch(deleteCaracter(id)).unwrap();
        updateList?.();
      }}
    />
  );
}
