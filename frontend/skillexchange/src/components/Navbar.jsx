import Profile from "../assets/profile.svg";
import "./Navbar.css";
import Logo from "../assets/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "./ui/Button";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/explore", label: "Explore" },
  { to: "/purchases", label: "Purchases" },
  { to: "/skills", label: "My Skills" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [credits, setCredits] = useState(0);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch credits");
        const data = await res.json();
        setCredits(data.credits || 0);
      } catch (err) {
        console.error("Credits fetch error:", err);
      }
    };

    fetchCredits();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate("/dashboard")}>
        <img src={Logo} alt="Logo" className="brand-logo" />
        <span className="brand-text">Skill Exchange</span>
      </div>

      <ul className="navbar-center">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="navbar-right">
        <span className="credits">{credits} credits</span>
        <Button variant="ghost" className="theme-btn" onClick={toggleTheme}>
          {theme === "dark" ? "Light" : "Dark"}
        </Button>
        <NavLink to="/profile" className="profile-link">
          <img src={Profile} alt="Profile" className="profile-icon" />
        </NavLink>
        <Button variant="danger" className="logout-btn" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}
