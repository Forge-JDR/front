import React from "react";
import Label from "../../atoms/label/Label";
import "./selectForm.css"; // Le fichier de styles pour ce composant

const SelectForm = ({
  id,
  name,
  label,
  required,
  value,
  onChange,
  options = [],
  errorMessage,
  ...rest
}) => {
  return (
    <div className="select-form">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={errorMessage ? "select-error" : ""}
        {...rest}
      >
        <option value="" disabled>
          {label} {/* Place un label par défaut */}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default SelectForm;
