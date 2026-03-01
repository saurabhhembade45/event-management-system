import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import API from "../services/api";
import "./dashboard.css";

function ParticipantFormPage() {

  const navigate = useNavigate();
  const { eventId } = useParams();
  const location = useLocation();

  const event = location.state?.event;

  // ================= SAFETY CHECK =================
  if (!event) {
    return <h2>Event data missing</h2>;
  }

  // ================= FORM STATE =================
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    emergencyContact: "",
    requirements: ""
  });

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ================= PROCEED =================
  const handleProceed = async (e) => {
    e.preventDefault();

    try {
      // ✅ SAVE PARTICIPANT IN DATABASE
      const res = await API.post(
        `/participate/${eventId}`,
        formData
      );

      const participant = res.data.participant;

      // ✅ NAVIGATE TO PAYMENT PAGE
      navigate(`/payment/${eventId}`, {
        state: {
          participantId: participant._id,
          userDetails: participant,
          eventDetails: event
        }
      });

    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">
        <h2 className="register-title">Participant Information</h2>

        <form onSubmit={handleProceed}>

          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone Number</label>
            <input
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* College */}
          <div className="form-group">
            <label>College / Organization</label>
            <input
              name="college"
              placeholder="Your college or company"
              value={formData.college}
              onChange={handleChange}
              required
            />
          </div>

          {/* Year */}
          <div className="form-group">
            <label>Year / Profession</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
              <option>Professional</option>
            </select>
          </div>

          {/* Emergency Contact */}
          <div className="form-group">
            <label>Emergency Contact</label>
            <input
              name="emergencyContact"
              placeholder="Emergency phone number"
              value={formData.emergencyContact}
              onChange={handleChange}
            />
          </div>

          {/* Requirements */}
          <div className="form-group">
            <label>Special Requirements</label>
            <textarea
              name="requirements"
              placeholder="Food preference / accessibility needs"
              value={formData.requirements}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}
          <div className="form-buttons">

            <button type="submit" className="proceed-btn">
              Proceed to Payment →
            </button>

            <button
              type="button"
              className="back-btn"
              onClick={() => navigate(-1)}
            >
              Back
            </button>

          </div>

        </form>
      </div>

    </div>
  );
}

export default ParticipantFormPage;