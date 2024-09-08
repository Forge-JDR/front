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
