import React from "react";

const AddressInput = ({ address, setAddress, label }) => {
  const handleChange = (field, value) => {
    // Construct the new address object here
    const newAddress = {
      ...address, // Keep existing address values
      [field]: value,
    };
    setAddress(newAddress); // Pass the new address object
  };

  return (
    <div className="admin__form__review__att">
      <label><span className="red">*</span>{label} Address</label>
      <div className="admin__form__review__att__rating__addy">
        {["street", "city", "state", "zipCode", "country"].map((field) => (
          <div className="admin__form__review__att__rating__addy" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type="text"
              placeholder={`Enter ${field}`}
              value={address[field] || ""} // Ensure default value if undefined
              onChange={(e) => handleChange(field, e.target.value)}
              required
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressInput;