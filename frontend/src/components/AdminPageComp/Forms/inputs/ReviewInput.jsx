import React, { useEffect } from "react";
import Selector from "../../../Selector"; // Import the selector for rating selection

const ReviewInput = ({ reviews, setReviews }) => {
  const ratingOptions = ["1", "2", "3", "4", "5"];

  useEffect(() => {
    if (reviews.length === 0) {
      setReviews([{ reviewerName: "", rating: -1, comment: "",}]);
    }
  }, [reviews, setReviews]);

  
  const handleAddReview = () => {
    setReviews([...reviews, { reviewerName: "", rating: -1, comment: "" }]);
  };

  
  const handleRemoveReview = (index) => {
    if (reviews.length > 1) { 
      const updatedReviews = [...reviews];
      updatedReviews.splice(index, 1);
      setReviews(updatedReviews);
    }
  };

  
  const handleChange = (index, field, value) => {
    const updatedReviews = [...reviews];
    updatedReviews[index][field] =  value;
    
    setReviews(updatedReviews);
  };

  return (
    <div>
      {reviews.map((review, index) => (
            <div className="admin__form__review__att" key={index}>
            <label>Reviewer Name:</label>
            <input
                type="text"
                placeholder="Enter Reviewer Name"
                value={review.reviewerName}
                onChange={(e) => handleChange(index, "reviewerName", e.target.value)}
                required
            />
            

            <div className="admin__form__review__att__rating">
            <label>Rating:</label>
            <Selector
                options={ratingOptions}
                selectedValue={review.rating}
                onChange={(value) => handleChange(index, "rating", value)}
                name={`rating-${index}`}
                required
            />
            </div>
    
            <label>Comment:</label>
            <textarea
                placeholder="Enter Review Comment"
                value={review.comment}
                onChange={(e) => handleChange(index, "comment", e.target.value)}
                required
            />

        <div className="admin__form__review__center">
          {reviews.length > 1 && (
            <button type="button" className="admin__form__remove__review__button" onClick={() => handleRemoveReview(index)}>
              Remove Review
            </button>
          )}
        </div>
        </div>
      ))}
      <br/>

      <button type="button" className="admin__form__add__review__button" onClick={handleAddReview}>
        Add New Review
      </button>
    </div>
  );
};

export default ReviewInput;
