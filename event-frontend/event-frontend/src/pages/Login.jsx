import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Login() {

  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/login", data);

      // save token
      localStorage.setItem("token", res.data.token);

      toast.success("Login Successful ✅");

      // go to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login Failed ❌"
      );
    }
  };

  return (
    <div className="auth-page login-bg">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
          </div>

          <button className="auth-btn">LOGIN</button>

          <p className="switch-text">
            Don't have an account?
            <span onClick={() => navigate("/register")}>
              {" "}Register
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Login;
