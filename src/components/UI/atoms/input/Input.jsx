const Input = (props) => {
  return <label>
         {props.label} : 
            <input id={props.id}  type={props.type} name={props.name}/>
         </label>;
};

export default Input;
