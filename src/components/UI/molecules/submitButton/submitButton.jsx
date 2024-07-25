import Button from "../../atoms/button/button";
import "./submitButton.css";
import { Navigate } from "react-router-dom";

const SubmitButton = ({ onClick, to, children, ...rest }) => {
  return (
    <Button onClick={onClick} to={to} {...rest}>
      {children}
    </Button>
  );
};

export default SubmitButton;
