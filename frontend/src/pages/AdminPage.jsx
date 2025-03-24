import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";
import Sidebar from "../components/AdminPageComp/Sidebar";
import Header from "../components/AdminPageComp/Header";
import AdminNav from "../components/AdminPageComp/AdminNav";
import AdminMovies from "../components/AdminPageComp/AdminMovies";
import AdminCodes from "../components/AdminPageComp/AdminCodes";
import { Routes, Route } from "react-router-dom";
import AdminUsers from "../components/AdminPageComp/AdminUsers";
import axios from "axios";

const AdminPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const admin = JSON.parse(localStorage.getItem("admin")) || null;

  useEffect(() => {
    if (!admin) {
      console.error("No email found. Redirecting to login...");
      navigate("/Log-In");
      return;
    }

    const fetchAdmin = async () => {
        setUserData(admin);
        setLoading(false);
    };

    fetchAdmin();
  }, [navigate]);

  async function logout() {

    try {
      await axios.post("http://localhost:8080/api/admins/logout", {email :userData.email});
      console.log("User signed out successfully");
      localStorage.removeItem("admin");
      navigate("/Log-In");
    } catch (error) {
      console.error("Error logging out:", error.response?.data || error.message);
    }
  }


  const [addMovieForm, setAddMovieForm] = useState(false);
  const [addCustomerForm, setCustomerForm] = useState(false);
  const [addAdminForm, setAdminForm] = useState(false);


  return (
    <div id="admin">
        <Sidebar logout={logout} />
        <div className="admin__container">
          <Header loading={loading} userData={userData} />
          <AdminNav setAddMovieForm={setAddMovieForm} addMovieForm={addMovieForm} setCustomerForm={setCustomerForm} addCustomerForm={addCustomerForm} setAdminForm={setAdminForm} addAdminForm={addAdminForm}/>
          <hr />
          <Routes>
            <Route index element={<AdminMovies addMovieForm={addMovieForm}/>} />
            <Route path="Manage-Users" element={<AdminUsers addCustomerForm={addCustomerForm} addAdminForm={addAdminForm}/>} />
            <Route path="Manage-PromoCodes" element={<AdminCodes />} />
          </Routes>
        </div>
    </div>
  )
}

export default AdminPage
