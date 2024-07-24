const Button = ({ type = "button", onClick, to, children, ...rest }) => {
  return (
    <button type={type} onClick={onClick} to={to} {...rest}>
      {children}
    </button>
  );
};

export default Button;
