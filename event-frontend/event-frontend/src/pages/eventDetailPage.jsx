import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./dashboard.css";

function EventDetailsPage() {

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

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="dashboard">
        <h2>Loading event...</h2>
      </div>
    );
  }

  // ================= NOT FOUND =================
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

      {/* EVENT DETAILS CARD */}
      <div className="event-details-card-page">

        {/* IMAGE */}
        <img src={event.image} alt={event.title} />

        {/* TITLE */}
        <h1>{event.title}</h1>

        {/* DESCRIPTION */}
        <p>{event.description}</p>

        <hr />

        {/* EVENT INFORMATION */}
        <p><b>Date:</b> {event.date}</p>
        <p><b>Time:</b> {event.time}</p>
        <p><b>Location:</b> {event.location}</p>

        <p>
          <b>Registration Fee:</b>{" "}
          {event.registrationFee === 0
            ? "Free"
            : `₹${event.registrationFee}`}
        </p>

      </div>
       {/* PARTICIPATE BUTTON */}
       <div className="participate-container">
          <button
            className="participate-btn"
            onClick={() => navigate(`/payment/${event._id}`)}
          >
            Participate Now
          </button>
        </div>
    </div>
  );
}

export default EventDetailsPage;