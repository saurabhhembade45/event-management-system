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

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true); // ✅ start loading
  
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
      

  
      // ✅ success message
      toast.success("Club added successfully 🎉");
  
      refresh(); // reload clubs list
      close();   // close modal
  
    } catch (error) {
      toast.error("Failed to create club");
    } finally {
      setLoading(false); // stop loading
    }
  };
  
  

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h2>Add Club</h2>

        <input
          name="name"
          placeholder="Club Name"
          onChange={handleChange}
          required
        />

        <input
          name="description"
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

        <button
          type="submit"
          disabled={loading}
          style={{
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? "Creating..." : "Create Club"}
        </button>
        
        <button type="button" onClick={close}>Cancel</button>
      </form>
    </div>
  );
}

export default AddClubModal;
