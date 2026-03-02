import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./dashboard.css";

function EventDetailsPage() {

  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== PARTICIPANT FORM STATE =====
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

      const res = await API.post(
        `/participants/participate/${event._id}`,
        formData
      );

      const participant = res.data.participant;

      // reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        college: "",
        year: "",
        emergencyContact: "",
        requirements: "",
      });

      // close modal
      setShowForm(false);

      // go to payment page with participantId
      navigate(`/payment/${event._id}`, {
        state: { participantId: participant._id }
      });

    } catch (error) {
      console.log(error);
      alert("Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

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

      {/* PARTICIPATE BUTTON */}
      <div className="participate-container">
        <button
          className="participate-btn"
          onClick={() => setShowForm(true)}
        >
          Participate Now
        </button>
      </div>

      {/* ================= PARTICIPANT FORM MODAL ================= */}
      {showForm && (
        <div
          className="modal-overlay"
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
                  {submitting
                    ? "Processing..."
                    : "Continue to Payment"}
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