import Button from "../atoms/button/button";
import SubmitButton from "../molecules/submitButton/submitButton";

const Form = ({ id, className, children, ...rest }) => {
  return (
    <form id={id} className={className} style={{ display: "flex" }} {...rest}>
      {children}
      {/* <SubmitButton type={type} onClick={onClick} {...rest}>
          {children}
        </SubmitButton> */}
    </form>
  );
};

export default Form;
