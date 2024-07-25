import Input from "../../atoms/input/Input";
import Label from "../../atoms/label/Label";
import "./fieldForm.css";

const FieldForm = ({
  label,
  name,
  type = "text",
  required = false,
  ...rest
}) => {
  return (
    <div className="field-form">
      <Input type={type} name={name} required={required} {...rest} />
      <Label htmlFor={name}>{label}</Label>
    </div>
  );
};
export default FieldForm;
