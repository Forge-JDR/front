import Input from "../../atoms/input/Input";
import Label from "../../atoms/label/Label";
import "./fieldForm.css";

const FieldForm = ({
  props,
  id,
  name,
  label,
  required,
  value,
  onChange,
  errorMessage,
  type,
  ...rest
}) => {
  return (
    <div className="field-form">
      <Input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        type={type}
        className={errorMessage ? "input-error" : ""}
      />
      <Label>{label}</Label>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};
export default FieldForm;

// const FieldForm = ({
//   label,
//   name,
//   type = "text",
//   value,
//   onChange,
//   errorMessage,
//   required,
// }) => (
//   <div className="form-group">
//     <label htmlFor={name}>{label}</label>
//     <input
//       type={type}
//       id={name}
//       name={name}
//       value={value}
//       onChange={onChange}
//       required={required}
//       className={errorMessage ? "input-error" : ""}
//     />
//     {errorMessage && <p className="error-message">{errorMessage}</p>}
//   </div>
// );
