const AdminCode = ({code}) => {
  /* { "promoCode": "SAVE10", "description": "Get 10% off all tickets!", "discountPercentage": 10.00, "expirationDate": "2025-12-31" } */

  return (
      <div className="admin__code">
              <div className="admin__code__header">
                <h3 className="admin__code__title">{code.promoCode}</h3>
                <button className="admin__code__edit__button">Edit</button>
              </div>
              <div className="admin__movie__info">
                <table className="admin__movie__info__table">
                      <tbody>
                        <tr>
                          <td className="admin__movie__td"><span className="admin__movie__info__span1">ID: </span></td>
                          <td className="admin__movie__td"><span className="admin__movie__info__span2">{code.promoId == null ? "N/A" : code.promoId}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__movie__td"><span className="admin__movie__info__span1">Discount Percentage: </span></td>
                          <td className="admin__movie__td"><span className="admin__movie__info__span2">{code.discountPercentage == null ? "N/A" : code.discountPercentage}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__movie__td"><span className="admin__movie__info__span1">Experation Date: </span></td>
                          <td className="admin__movie__td"><span className="admin__movie__info__span2">{code.expirationDate == null ? "N/A" : code.expirationDate}</span></td>
                        </tr>
                        <tr>
                          <td className="admin__movie__td"><span className="admin__movie__info__span1">Description: </span></td>
                          <td className="admin__movie__td"><span className="admin__movie__info__span2">{code.description == null ? "N/A" : code.description}</span></td>
                        </tr>
                        
                      </tbody>
                    </table> 
                
                <i className="material-symbols-outlined admin__code__trash">delete</i>
              </div>
            </div>

  )
}

export default AdminCode
