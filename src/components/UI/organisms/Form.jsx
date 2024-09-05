const Form = ({ id, className, children, ...rest }) => {
  return (
    <form id={id} className={className} style={{ display: "flex" }} {...rest}>
      {children}
    </form>
  );
};

export default Form;
