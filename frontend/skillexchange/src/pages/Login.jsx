import { useState } from "react";
import API from "../api";
import "./AuthCSS.css";
import Logo from "../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        setError("Login failed: No token received");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="brand-header">
        <img src={Logo} alt="Site Logo" className="brand-logo" />
        <h1 className="brand-text">Skill Exchange</h1>
      </div>
      <Card className="auth-card">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="auth-title">Welcome back</h2>
          {error && <p className="auth-error">{error}</p>}
          <Input type="email" name="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input type="password" name="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </Card>
    </div>
  );
}
