import "./label.css";

const Label = (props, ...rest) => {
  return <label {...rest}>{props.children}</label>;
};

export default Label;
