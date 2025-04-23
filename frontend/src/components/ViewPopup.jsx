import React from 'react';

const ViewPopup = ({ text }) => {
  return (
    <div className='admin__movie__show__view'>
      <div className="scrollable-content" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}

export default ViewPopup;
