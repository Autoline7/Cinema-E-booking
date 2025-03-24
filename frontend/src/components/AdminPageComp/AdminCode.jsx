import React from 'react'

const AdminCode = () => {
  return (
    <div>
      <div className="admin__code">
              <div className="admin__code__header">
                <h3 className="admin__code__title">Code 1</h3>
                <button className="admin__code__edit__button">Edit</button>
              </div>
              <div className="admin__code__rows">
                <div className="admin__code__row">
                  <div className="admin__code__info">
                    <span>ID</span>
                    <span>.....</span>
                  </div>
                  <div className="admin__code__info">
                    <span>Name</span>
                    <span>.....</span>
                  </div>
                  <div className="admin__code__info">
                    <span>Discount</span>
                    <span>.....</span>
                  </div>
                </div>

                <div className="admin__code__row">

                    <div className="admin__code__info">
                        <span>Date From</span>
                        <span>.....</span>
                    </div>
                    <div className="admin__code__info">
                        <span>Date To</span>
                        <span>.....</span>
                    </div>
                </div>
                
                <i className="material-symbols-outlined admin__code__trash">delete</i>
              </div>
            </div>
    </div>
  )
}

export default AdminCode
