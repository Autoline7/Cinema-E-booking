import React, { useState, useEffect } from "react";
import axios from "axios";
import SimpleAlert from "../../SimpleAlert";

const UpdatePricesForm = () => {
  const [formData, setFormData] = useState({
    Adult: "",
    Senior: "",
    Child: "",
    OnlineFee: ""
  });
  
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/api/ticket-prices')
      .then(response => {
        // Use functional update
        setFormData(prevState => ({
          ...prevState, // Merge with previous state
          Adult: parseFloat(response.data.Adult).toFixed(2),
          Senior: parseFloat(response.data.Senior).toFixed(2),
          Child: parseFloat(response.data.Child).toFixed(2),
        }));
      })
      .catch(error => {
        console.error('Error fetching ticket prices:', error);
      });

      axios.get('http://localhost:8080/api/ticket-prices/online-fee')
      .then(response => {
        // Use functional update
        console.log(response.data)
        setFormData(prevState => ({
           ...prevState, // Merge with previous state
           OnlineFee: parseFloat(response.data).toFixed(2)
        }));
      })
      .catch(error => {
          console.error('Error fetching online fee:', error);
      });
  }, []);



  const handleAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log(formData.OnlineFee)
      // Send PUT requests for each price type
      const priceUpdates = [
        axios.put(`http://localhost:8080/api/ticket-prices/Adult?newPrice=${formData.Adult}`),
        axios.put(`http://localhost:8080/api/ticket-prices/Senior?newPrice=${formData.Senior}`),
        axios.put(`http://localhost:8080/api/ticket-prices/Child?newPrice=${formData.Child}`),
        axios.put(`http://localhost:8080/api/ticket-prices/online-fee?newFee=${formData.OnlineFee}`)
      ];

      await Promise.all(priceUpdates);
      
      handleAlert();
    } catch (error) {
      console.error("Error updating prices:", error);
    }
  };

  return (
    <div className="admin__customer__form">
      <h2 className="admin__add__customer__title">Update Ticket Prices</h2>
      <form onSubmit={handleSubmit} className="admin__add__customer__form">
        <p className="admin__form__required__fields">
          Note: Required = <span className="red">*</span>
        </p>

        <label htmlFor="online-fee">
          <span className="red">*</span> Online Fee:
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          name="OnlineFee"
          value={formData.OnlineFee}
          onChange={handleChange}
          required
        />

        <label htmlFor="ticket-price-s">
          <span className="red">*</span> Senior Ticket Price:
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          name="Senior"
          value={formData.Senior}
          onChange={handleChange}
          required
        />

        <label htmlFor="ticket-price-a">
          <span className="red">*</span> Adult Ticket Price:
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          name="Adult"
          value={formData.Adult}
          onChange={handleChange}
          required
        />

        <label htmlFor="ticket-price-c">
          <span className="red">*</span> Child Ticket Price:
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          name="Child"
          value={formData.Child}
          onChange={handleChange}
          required
        />

        <div className="admin__add__customer__form__button__container">
          <button
            className="admin__add__customer__form__button"
            type="submit"
          >
            Update Prices
          </button>
        </div>

        {showAlert && <SimpleAlert message="Prices Updated Successfully!" />}
      </form>
    </div>
  );
};

export default UpdatePricesForm;