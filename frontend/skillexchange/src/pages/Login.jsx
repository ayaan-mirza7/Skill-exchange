import { useState } from "react";
import API from "../api";
import "./AuthCSS.css";
import Logo from "../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", form);

      // 🟢 SAFELY STORE TOKEN
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        setError("Login failed: No token received");
      }

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return (
    <>
      <div className="auth-container">
        <div className="brand-header">
          <img src={Logo} alt="Site Logo" className="brand-logo" />
          <h1 className="brand-text">Skill Exchange</h1>
        </div>
        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2 className="auth-title">Login</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <button type="submit" className="auth-btn">
              Login
            </button>
          </form>

          <p className="auth-switch">
            Don’t have an account?
            <Link to="/signup"> Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
