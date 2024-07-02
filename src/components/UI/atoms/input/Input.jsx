import "./input.css";

const Input = (props, ...rest) => {
  return (
    <input
      type={props.type}
      name={props.name}
      required={props.required}
      {...rest}
    />
  );
};

export default Input;
