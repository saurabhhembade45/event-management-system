import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import "./dashboard.css";

function PaymentPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Safe participant data (state OR localStorage)
  const participantData =
    location.state?.participantDetails ||
    JSON.parse(localStorage.getItem("participantData"));

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ❌ If no participant data, redirect back
    if (!participantData) {
      alert("Participant details missing. Please register again.");
      navigate(-1);
      return;
    }
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${eventId}`);
        setEvent(res.data.event);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handlePayment = async () => {
    try {
      // ⭐ Create Order
      const { data } = await API.post("/payment/createOrder", {
        eventId: event._id,
      });
      const options = {
        key: "rzp_test_RL6e1Ke8DvBIBO",
        amount: data.order.amount,
        currency: "INR",
        name: "Event Registration",
        description: event.title,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            await API.post("/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              eventId: event._id,
              ...participantData,
            });
            // 🧹 Clear stored data after success
            localStorage.removeItem("participantData");
            navigate(`/payment-success/${event._id}`, {
              state: { eventName: event.title },
            });
          } catch (error) {
            alert("Payment verification failed");
          }
        },
        theme: {
          color: "#4caf50",
        },
      };
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.log(error);
      alert("Payment failed");
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (!event) return <h2>Event not found</h2>;

  return (
    <div className="dashboard">
      <div className="payment-card">
        <h1>Event Registration</h1>
        <img src={event.image} alt={event.title} />
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <hr />
        <h3>
          Registration Fee: ₹{event.registrationFee}
        </h3>
        <button className="pay-btn" onClick={handlePayment}>
          Pay Now
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;