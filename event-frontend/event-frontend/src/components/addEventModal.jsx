import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function AddEventModal({ close, refresh, clubId }) {

  // loading state
  const [loading, setLoading] = useState(false);

  // ⭐ form state (UPDATED)
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

      // ⭐ new fields
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

      refresh(); // reload events
      close();   // close modal

    } catch (error) {
      toast.error("Failed to create event");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h2>Add Event</h2>

        {/* TITLE */}
        <input
          name="title"
          placeholder="Event Title"
          onChange={handleChange}
          required
        />

        {/* DESCRIPTION */}
        <input
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />

        {/* IMAGE */}
        <input
          type="file"
          name="image"
          onChange={handleChange}
          required
        />

        {/* DATE */}
        <input
          type="date"
          name="date"
          onChange={handleChange}
          required
        />

        {/* TIME */}
        <input
          type="time"
          name="time"
          onChange={handleChange}
          required
        />

        {/* LOCATION */}
        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
        />


        {/* REGISTRATION FEE */}
        <input
          type="number"
          name="registrationFee"
          placeholder="Registration Fee (₹)"
          onChange={handleChange}
          required
        />

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          style={{
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>

        <button type="button" onClick={close}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddEventModal;