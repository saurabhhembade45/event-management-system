import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard"; 
import { Toaster } from "react-hot-toast";
import "./index.css";
import ClubEvents from "./pages/clubEvents"; 
import EventDetails from "./pages/eventDetailPage";  
import PaymentPage from "./pages/payments"; 


function App() {
  return (
    <>
      {/* Toast popup system */}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Register Page */}
        <Route path="/register" element={<Register />} />

        {/* Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard />} />

         {/* events page */}
        <Route path="/club/:clubId" element={<ClubEvents />} />

        <Route path="/event/:eventId" element={<EventDetails />} />

        <Route path="/payment/:eventId" element={<PaymentPage />} />
      </Routes>
    </>
  );
}

export default App;
