import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./dashboard.css";

function PaymentPage() {

  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH EVENT =================
  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${eventId}`);
      setEvent(res.data.event);
    } catch (error) {
      console.log("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  // ================= PAYMENT FUNCTION =================
  const handlePayment = async () => {
    try {

      // ⭐ FREE EVENT (no payment needed)
      if (event.registrationFee === 0) {
        alert("Participation Confirmed ✅");
        navigate(-1);
        return;
      }

      // 1️⃣ Create order from backend
      const { data } = await API.post("/payment/createOrder", {
        eventId: event._id,
      });

      // 2️⃣ Razorpay options
      const options = {
        key: "key_secret", // ⚠️ replace with your Razorpay KEY_ID
        amount: data.order.amount,
        currency: "INR",
        name: "Event Registration",
        description: event.title,
        order_id: data.order.id,

        // 3️⃣ Success handler
        handler: function (response) {
          alert("Payment Successful ✅");
          console.log(response);

          // after payment success
          navigate(-1);
        },

        theme: {
          color: "#4caf50",
        },
      };

      // 4️⃣ Open Razorpay popup
      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.log("Payment Error:", error);
      alert("Payment failed");
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="dashboard">
        <h2>Loading payment details...</h2>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="dashboard">
        <h2>Event not found</h2>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* BACK BUTTON */}
      <button
        className="add-btn"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px" }}
      >
        ← Back
      </button>

      <div className="payment-card">

        <h1>Event Registration</h1>

        <img src={event.image} alt={event.title} />

        <h2>{event.title}</h2>

        <p>{event.description}</p>

        <hr />

        <h3>
          Registration Fee:{" "}
          {event.registrationFee === 0
            ? "Free"
            : `₹${event.registrationFee}`}
        </h3>

        {/* PAY BUTTON */}
        <button className="pay-btn" onClick={handlePayment}>
          {event.registrationFee === 0
            ? "Confirm Participation"
            : "Pay Now"}
        </button>

      </div>
    </div>
  );
}

export default PaymentPage;