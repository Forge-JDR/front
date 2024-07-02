const Input = (props) => {
  return <label>
         {props.label} : 
            <input id={props.id}  type={props.type} name={props.name} value={props.value} 
        onChange={props.onChange}/>
         </label>;
};

export default Input;
