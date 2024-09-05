import "./button.css";

const Button = ({ className, type = "button", onClick, children, ...rest }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={"forgeJdr-button " + className}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
