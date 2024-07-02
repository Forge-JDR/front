import "./input.css";

const Input = ({ type = "text", required = false, name = "", ...rest }) => {
  return <input type={type} name={name} required={required} {...rest} />;
};

export default Input;
