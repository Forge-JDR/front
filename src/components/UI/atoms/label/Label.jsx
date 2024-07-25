import React from "react";
import "./label.css";

const Label = ({ children, ...rest }) => {
  return <label {...rest}>{children}</label>;
};

export default Label;
