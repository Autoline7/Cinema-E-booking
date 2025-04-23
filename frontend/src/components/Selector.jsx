import React, { useState } from "react";

const Selector = ({ options, selectedValue, onChange, name, required }) => {
  const [error, setError] = useState(false);

  const handleChange = (value) => {
    onChange(value);
    setError(false); 
  };

  return (
    <div className="admin__form__selector">
      {options.map((option) => (
        <label key={option} className="admin__form__selector-option">
          <input
            type="radio"
            name={name}
            value={option}
            checked={selectedValue === option}
            onChange={() => handleChange(option)}
            required={required}
          />
          {option}
        </label>
      ))}
      {error && <p>Please select an option.</p>}
    </div>
  );
};

export default Selector;
