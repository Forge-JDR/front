import React from "react";
import "./label.css";
export default function Label({ children, className = "", ...props }) {
  return (
    <label className={`legacy-label ${className}`} {...props}>
      {children}
    </label>
  );
}
