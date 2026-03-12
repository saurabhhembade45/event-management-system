import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./dashboard.css";

function EventDetailsPage() {

  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // NEW STATE
  const [participated, setParticipated] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    emergencyContact: "",
    requirements: "",
  });

  // ================= FETCH EVENT =================
  useEffect(() => {
    const fetchEvent = async () => {
      try {

        const res = await API.get(`/events/${eventId}`);
        setEvent(res.data.event);

        // CHECK PARTICIPATION
        const participation = await API.get(`/participants/check/${eventId}`);

        if (participation.data.participated) {
          setParticipated(true);
        }

      } catch (error) {
        console.log("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT FORM =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    try {
      setSubmitting(true);

      localStorage.setItem(
        "participantData",
        JSON.stringify(formData)
      );

      navigate(`/payment/${event._id}`, {
        state: {
          participantDetails: formData
        }
      });

      setShowForm(false);

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <h2>Loading event...</h2>
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

      <div className="event-details-card-page">
        <img src={event.image} alt={event.title} />
        <h1>{event.title}</h1>
        <p>{event.description}</p>

        <hr />

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

      <div className="participate-container">

        <button
          className="participate-btn"
          disabled={participated}
          onClick={() => setShowForm(true)}
          style={{
            background: participated ? "#22c55e" : "",
            cursor: participated ? "not-allowed" : "pointer"
          }}
        >
          {participated ? "✔ Participated" : "Participate Now"}
        </button>

      </div>

      {showForm && (
        <div
          className="modal-overlay participant-overlay"
          onClick={() => setShowForm(false)}
        >
          <div
            className="form-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Participant Details</h2>

            <form onSubmit={handleSubmit}>

              <input
                name="name"
                value={formData.name}
                placeholder="Full Name"
                required
                onChange={handleChange}
              />

              <input
                name="email"
                type="email"
                value={formData.email}
                placeholder="Email"
                required
                onChange={handleChange}
              />

              <input
                name="phone"
                value={formData.phone}
                placeholder="Phone Number"
                required
                onChange={handleChange}
              />

              <input
                name="college"
                value={formData.college}
                placeholder="College"
                onChange={handleChange}
              />

              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              >
                <option value="">Select Year</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
                <option>Professional</option>
              </select>

              <input
                name="emergencyContact"
                value={formData.emergencyContact}
                placeholder="Emergency Contact"
                onChange={handleChange}
              />

              <textarea
                name="requirements"
                value={formData.requirements}
                placeholder="Special Requirements"
                onChange={handleChange}
              />

              <div className="form-buttons">
                <button type="submit" disabled={submitting}>
                  {submitting ? "Processing..." : "Continue to Payment"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetailsPage;