import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function AddClubModal({ close, refresh }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: null,
  });

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // ================= SUBMIT FORM =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("image", form.image);

      const token = localStorage.getItem("token");

      await API.post("/clubs/createClub", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Club added successfully 🎉");

      refresh(); // reload club list
      close();   // close modal

    } catch (error) {
      toast.error("Failed to create club");
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
        <h2>Add New Club</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            value={form.name}
            placeholder="Club Name"
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
              {loading ? "Creating..." : "Create Club"}
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

export default AddClubModal;