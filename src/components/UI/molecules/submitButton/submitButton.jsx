import Button from "../../atoms/button/button";
import "./submitButton.css";

const SubmitButton = ({ onClick, children, ...rest }) => {
  return (
    <Button onClick={onClick} {...rest}>
      {children}
    </Button>
  );
};

export default SubmitButton;
