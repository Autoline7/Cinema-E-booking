import axios from "axios";
import React, { useState, useEffect } from "react";

const PaymentCardInput = ({ paymentCards, setPaymentCards, existingPaymentCards, handleDeletePaymentCard }) => {
  const [newCard, setNewCard] = useState({
    paymentCard: {
      decryptedCardNumber: "",
      expirationDate: "",
      decryptedCvv: "",
    },
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showNewCardForm, setShowNewCardForm] = useState(false);

  useEffect(() => {
    // CHANGED: Limit total cards (existing + new) to 3
    const totalCards = paymentCards.length + (existingPaymentCards?.length || 0);
    if (totalCards > 3) {
      setPaymentCards(paymentCards.slice(0, 3 - (existingPaymentCards?.length || 0)));
    }
  }, [paymentCards, setPaymentCards, existingPaymentCards]);

  const handleAddCard = () => {
    if (!showNewCardForm) {
      // CHANGED: Check if adding a new card would exceed the 3-card limit
      const totalCards = paymentCards.length + (existingPaymentCards?.length || 0);
      if (totalCards >= 3) {
        setErrorMessage("You can only have up to 3 payment cards in total.");
        return;
      }
      setShowNewCardForm(true);
      return;
    }

    // Validate new card data
    const cardNumber = newCard.paymentCard.decryptedCardNumber;
    const cvv = newCard.paymentCard.decryptedCvv;
    const expDate = newCard.paymentCard.expirationDate;
    const { street, city, state, zipCode, country } = newCard.billingAddress;

    if (!cardNumber || !cvv || !expDate || !street || !city || !state || !zipCode || !country) {
      setErrorMessage("Please fill out all fields for the new card.");
      return;
    }

    // CHANGED: Check total cards before adding
    const totalCards = paymentCards.length + (existingPaymentCards?.length || 0);
    if (totalCards < 3) {
      setPaymentCards([...paymentCards, newCard]);
      // Only reset the form after successful validation and submission
      setNewCard({
        paymentCard: {
          decryptedCardNumber: "",
          expirationDate: "",
          decryptedCvv: "",
        },
        billingAddress: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
      });
      setShowNewCardForm(false);
      setErrorMessage("");
    } else {
      setErrorMessage("You can only have up to 3 payment cards in total.");
    }
  };

  const handleRemoveCard = (index) => {
    const updatedCards = [...paymentCards];
    updatedCards.splice(index, 1);
    setPaymentCards(updatedCards);
  };

  const handleCardChange = (index, section, field, value) => {
    const updatedCards = [...paymentCards];
    updatedCards[index] = {
      ...updatedCards[index],
      [section]: {
        ...updatedCards[index][section],
        [field]: value,
      },
    };
    setPaymentCards(updatedCards);
  };

  const handleNewCardChange = (section, field, value) => {
    setNewCard((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const cancelNewCard = () => {
    setShowNewCardForm(false);
    setNewCard({
      paymentCard: {
        decryptedCardNumber: "",
        expirationDate: "",
        decryptedCvv: "",
      },
      billingAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    });
    setErrorMessage("");
  };

  return (
    <div>
      {paymentCards.length === 0 && !showNewCardForm && (
        <p>No payment cards added. Cards are optional.</p>
      )}

      {/* Display existing payment cards with delete buttons */}
      {existingPaymentCards && existingPaymentCards.length > 0 && (
        <div className="existing-payment-cards">
          <label>Existing Payment Cards:</label>
          <div className="payment-cards-list">
            {existingPaymentCards.map((card, index) => (
              <div key={card.cardId || index} className="payment-card-item">
                <div className="payment-card-details">
                  <p>
                    <strong>Card Number:</strong>{" "}
                    {card.decryptedCardNumber || "••••••••••••" + (card.cardNumberLastFour || "••••")}
                  </p>
                  <p>
                    <strong>Expiration Date:</strong> {card.expirationDate || "••/••"}
                  </p>
                  <p>
                    <strong>CVV:</strong> {card.decryptedCvv || "•••"}
                  </p>
                  <div className="billing-address-details">
                    <p><strong>Billing Address:</strong></p>
                    <p>{card.billingAddress?.street || ""}</p>
                    <p>
                      {card.billingAddress?.city || ""}
                      {card.billingAddress?.city && card.billingAddress?.state ? ", " : ""}
                      {card.billingAddress?.state || ""} {card.billingAddress?.zipCode || ""}
                    </p>
                    <p>{card.billingAddress?.country || ""}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="screenings__list__button"
                  onClick={() => handleDeletePaymentCard(card.cardId)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {paymentCards.map((card, index) => (
        <div className="admin__form__review__att" key={index}>
          <h3>Card On File</h3>
          <label>Billing Address</label>
          <div className="admin__form__review__att__rating__addy">
            <label>Street:</label>
            <input
              type="text"
              placeholder="Enter Street Name"
              value={card.billingAddress.street}
              disabled
              required
            />

            <label>City:</label>
            <input
              type="text"
              placeholder="Enter City Name"
              value={card.billingAddress.city}
              disabled
              required
            />

            <label>State:</label>
            <input
              type="text"
              placeholder="Enter State Name"
              value={card.billingAddress.state}
              disabled
              required
            />

            <label>Zip Code:</label>
            <input
              type="text"
              placeholder="Enter Zip Code"
              value={card.billingAddress.zipCode}
              disabled
              required
            />

            <label>Country:</label>
            <input
              type="text"
              placeholder="Enter Country"
              value={card.billingAddress.country}
              disabled
              required
            />
          </div>
          <br />
          <label>Card Details: (16 digits)</label>
          <div className="admin__form__review__att__rating__addy">
            <label>Card Number:</label>
            <input
              type="text"
              placeholder="Enter Card Number"
              value={card.paymentCard?.decryptedCardNumber || card.decryptedCardNumber}
              disabled
              required
              pattern="\d{16}"
              maxLength={16}
              minLength={16}
              inputMode="numeric"
            />

            <label>CVV: (3 digits)</label>
            <input
              type="text"
              placeholder="Enter CVV"
              value={card.paymentCard?.decryptedCvv || card.decryptedCvv}
              required
              pattern="\d{3}"
              maxLength={3}
              minLength={3}
              disabled
              inputMode="numeric"
            />

            <label>Expiration Date:</label>
            <input
              type="date"
              value={card.paymentCard?.expirationDate || card.expirationDate}
              disabled
              required
            />
          </div>

          <div className="admin__form__review__center">
            <button
              type="button"
              className="admin__form__remove__review__button"
              onClick={() => handleRemoveCard(index)}
            >
              Remove Card
            </button>
          </div>
        </div>
      ))}

      {showNewCardForm && (
        <div className="admin__form__review__att">
          <label>Add New Card</label>
          <label>Billing Address</label>
          <div className="admin__form__review__att__rating__addy">
            <label>Street:</label>
            <input
              type="text"
              placeholder="Enter Street Name"
              value={newCard.billingAddress.street}
              onChange={(e) =>
                handleNewCardChange("billingAddress", "street", e.target.value)
              }
            />

            <label>City:</label>
            <input
              type="text"
              placeholder="Enter City Name"
              value={newCard.billingAddress.city}
              onChange={(e) =>
                handleNewCardChange("billingAddress", "city", e.target.value)
              }
            />

            <label>State:</label>
            <input
              type="text"
              placeholder="Enter State Name"
              value={newCard.billingAddress.state}
              onChange={(e) =>
                handleNewCardChange("billingAddress", "state", e.target.value)
              }
            />

            <label>Zip Code:</label>
            <input
              type="text"
              placeholder="Enter Zip Code"
              value={newCard.billingAddress.zipCode}
              onChange={(e) =>
                handleNewCardChange("billingAddress", "zipCode", e.target.value)
              }
            />

            <label>Country:</label>
            <input
              type="text"
              placeholder="Enter Country"
              value={newCard.billingAddress.country}
              onChange={(e) =>
                handleNewCardChange("billingAddress", "country", e.target.value)
              }
            />
          </div>
          <br />
          <label>Card Details: (16 digits)</label>
          <div className="admin__form__review__att__rating__addy">
            <label>Card Number:</label>
            <input
              type="text"
              placeholder="Enter Card Number"
              value={newCard.paymentCard.decryptedCardNumber}
              onChange={(e) =>
                handleNewCardChange("paymentCard", "decryptedCardNumber", e.target.value)
              }
              pattern="\d{16}"
              maxLength={16}
              minLength={16}
              inputMode="numeric"
            />

            <label>CVV: (3 digits)</label>
            <input
              type="text"
              placeholder="Enter CVV"
              value={newCard.paymentCard.decryptedCvv}
              onChange={(e) =>
                handleNewCardChange("paymentCard", "decryptedCvv", e.target.value)
              }
              pattern="\d{3}"
              maxLength={3}
              minLength={3}
              inputMode="numeric"
            />

            <label>Expiration Date:</label>
            <input
              type="date"
              value={newCard.paymentCard.expirationDate}
              onChange={(e) =>
                handleNewCardChange("paymentCard", "expirationDate", e.target.value)
              }
            />
          </div>
          
          <div className="admin__form__review__center">
            <button
              type="button"
              className="admin__form__remove__review__button"
              onClick={cancelNewCard}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <br />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <button
        type="button"
        className="admin__form__add__review__button"
        onClick={handleAddCard}
      >
        {showNewCardForm ? "Save New Card" : "Add New Card"}
      </button>
    </div>
  );
};

export default PaymentCardInput;