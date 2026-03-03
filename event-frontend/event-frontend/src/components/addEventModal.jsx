import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function AddEventModal({ close, refresh, clubId }) {

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
    date: "",
    time: "",
    location: "",
    registrationLink: "",
    registrationFee: 0,
  });

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // ================= SUBMIT EVENT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("image", form.image);
      formData.append("clubId", clubId);
      formData.append("date", form.date);
      formData.append("time", form.time);
      formData.append("location", form.location);
      formData.append("registrationLink", form.registrationLink);
      formData.append("registrationFee", form.registrationFee);

      const token = localStorage.getItem("token");

      await API.post("/events/createEvent", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Event created successfully 🎉");

      refresh();
      close();

    } catch (error) {
      toast.error("Failed to create event");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div
        className="form-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Add New Event</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="title"
            value={form.title}
            placeholder="Event Title"
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            value={form.description}
            placeholder="Description"
            onChange={handleChange}
            required
          />

          <input
            type="file"
            name="image"
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="location"
            value={form.location}
            placeholder="Location"
            onChange={handleChange}
            required
          />

          <input
            type="url"
            name="registrationLink"
            value={form.registrationLink}
            placeholder="Registration Link (optional)"
            onChange={handleChange}
          />

          <input
            type="number"
            name="registrationFee"
            value={form.registrationFee}
            placeholder="Registration Fee (₹)"
            onChange={handleChange}
            required
          />

          <div className="form-buttons">
            <button
              type="submit"
              disabled={loading}
              className="primary-btn"
              style={{
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Creating..." : "Create Event"}
            </button>

            <button
              type="button"
              onClick={close}
              className="secondary-btn"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddEventModal;