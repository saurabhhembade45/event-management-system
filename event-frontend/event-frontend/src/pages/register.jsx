import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    college: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/register", formData);

      toast.success(res.data?.message || "Registration Successful ✅");

      setFormData({
        username: "",
        email: "",
        password: "",
        role: "student",
        college: "",
      });

      // go to login page
      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration Failed ❌"
      );
    }
  };

  return (
    <div className="auth-page register-bg">
      <div className="auth-card">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="input-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="organizer">Organizer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="input-group">
            <label>College</label>
            <input
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="Enter college"
              required
            />
          </div>

          <button className="auth-btn">REGISTER</button>

          <p className="switch-text">
            Already have an account?
            <span onClick={() => navigate("/")}> Login</span>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Register;
