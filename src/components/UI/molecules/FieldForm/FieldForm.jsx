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
      />
      <Label>{label}</Label>
    </div>
  );
};
export default FieldForm;
