import { useState } from "react";

const InputField = ({ type, placeholder, icon, value, onChange}) => {
    const [isPasswordShown, setIsPasswordShow] = useState(false);

  return (
    <div className="input-wrapper">
        <input value={value} type={isPasswordShown ? 'text' : type} placeholder={placeholder} className="input-field" onChange={onChange} required />
        <i className="material-symbols-outlined">{icon}</i>
        {type === 'password' && (
             <i onClick={() => setIsPasswordShow(prevState => !prevState)} className="material-symbols-outlined eye-icon">{isPasswordShown ? 'visibility' : 'visibility_off'}</i>
        )}
    </div>
  )
}

export default InputField
