import React from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/store";


const Disconnect = ({ ...props }) => {

  const dispatch = useDispatch();

  dispatch(logout());

  return <Navigate to="/login" replace />;
}

export default Disconnect;
