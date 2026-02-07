import { useState } from "react";
import API from "../api";
import "./AuthCSS.css";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

export default function Signup({ switchAuth }) {
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await API.post("/auth/signup", form);

      console.log("Login successful");
    } catch (err) {
      console.log("ERROR STATUS:", err.response?.status);
      console.log("ERROR DATA:", err.response?.data);
    }
  };

  const [form, setform] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handlechange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="auth-container">
        <div className="brand-header">
          <img src={Logo} alt="Site Logo" className="brand-logo" />
          <h1 className="brand-text">Skill Exchange</h1>
        </div>
        <div className="auth-card">
          <h2 className="auth-title">Sign Up</h2>
          <form action="" className="auth-form">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handlechange}
            />
            <input name="email" placeholder="Email" onChange={handlechange} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handlechange}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={handlechange}
            />
            <button type="submit" className="auth-btn" onClick={handleSubmit}>
              Create Account
            </button>
          </form>
          <p className="auth-switch">
            Already have an account?
            <Link to="/">Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
