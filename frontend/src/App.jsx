import LogIn from "./components/LogInComp/LogIn";
import SignUp from "./components/SignUpComp/SignUp";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import HomePage from "./pages/HomePage";
import EditProfile from "./pages/EditProfile";
import BookTicket from "./pages/BookTicket";
import OrderSummary from "./pages/OrderSummary";
import OrderConfirmation from "./pages/OrderConfirmation";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForgotPassword from "./components/LogInComp/ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Sign-Up" element={<SignUp />} />
        <Route path="/Sign-Up/Admin" element={<SignUp />} />
        <Route path="/Log-In" element={<LogIn />} />
        <Route path="/Admin-DashBoard/*" element={<AdminPage />} />
        <Route path="/User-DashBoard" element={<UserPage />} />
        <Route path="/Edit-Profile" element={<EditProfile />} />
        <Route path="/Book-Ticket/:movieId" element={<BookTicket />} />
        <Route path="/Order-Summary" element={<OrderSummary />} />
        <Route path="/Order-Confirmation" element={<OrderConfirmation />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;