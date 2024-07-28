import Button from "../../atoms/button/button";
import "./cancelButton.css";

const CancelButton = ({ onClick, children, ...rest }) => {
  return (
    <Button onClick={onClick} {...rest}>
      {children}
    </Button>
  );
};

export default CancelButton;
