import "./input.css";

const Input = ({ id, name, value, onChange, required, type }) => {
  return (
    <input
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      type={type}
    />
  );
};

export default Input;
