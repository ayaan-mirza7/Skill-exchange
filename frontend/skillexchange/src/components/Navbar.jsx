import Profile from "../assets/profile.svg";
import "./Navbar.css";
import Logo from "../assets/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


export default function Navbar() {
  const navigate = useNavigate();
  const [credits, setCredits] = useState(0);

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
        setCredits(data.credits);
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
      {/* LEFT */}
      <div className="navbar-left">
        <img src={Logo} alt="Logo" className="brand-logo" />
        <span className="brand-text">Skill Exchange</span>
      </div>

      {/* CENTER */}
      <ul className="navbar-center">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Explore Videos & Notes
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/purchases"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            My Purchases
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/skills"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            My Skills
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            About
          </NavLink>
        </li>
      </ul>

      {/* RIGHT */}
      <div className="navbar-right">
        <span className="credits">💰 {credits}</span>

        <NavLink to="/profile">
          <img src={Profile} alt="Profile" className="profile-icon" />
        </NavLink>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
