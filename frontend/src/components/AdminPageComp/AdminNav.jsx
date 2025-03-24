import { Link, useLocation } from "react-router-dom";

const AdminNav = ({setAddMovieForm, addMovieForm, addCustomerForm, setCustomerForm, addAdminForm, setAdminForm}) => {
    const location = useLocation();

   
  return (
    <div>
      <nav className="admin__nav">
          <div className="admin__nav__links">
            <Link to="/Admin-DashBoard" className={location.pathname === "/Admin-DashBoard" ? "admin__nav__link active__link" : "admin__nav__link"}>Manage Movies</Link>
            <Link to="/Admin-DashBoard/Manage-Users" className={location.pathname === "/Admin-DashBoard/Manage-Users" ? "admin__nav__link active__link" : "admin__nav__link"}>Manage Users</Link>
            <Link to="/Admin-DashBoard/Manage-PromoCodes" className={location.pathname === "/Admin-DashBoard/Manage-PromoCodes" ? "admin__nav__link active__link" : "admin__nav__link"}>Manage Promo Codes</Link>
          </div>

          <div className="admin__nav__buttons" >
            {location.pathname === "/Admin-DashBoard" && <button onClick={() => setAddMovieForm(prevState => !prevState)} className="admin__nav__button">{addMovieForm ? "Close Form" : "Add Movies"}</button>}
            {location.pathname === "/Admin-DashBoard/Manage-PromoCodes" && <button className="admin__nav__button">Add a Promo Code</button>}
            {location.pathname === "/Admin-DashBoard/Manage-Users" && <><button onClick={() => setCustomerForm(prevState => !prevState)} className="admin__nav__button">{addCustomerForm ? "Close Form" : "Add a Customer"}</button> <button onClick={() => setAdminForm(prevState => !prevState)} className="admin__nav__button">{addAdminForm ? "Close Form" : "Add a Admin"}</button></>}
          </div>

          

          
        </nav>
    </div>
  )
}

export default AdminNav
