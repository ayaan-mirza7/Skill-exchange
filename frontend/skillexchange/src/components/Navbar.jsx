import Profile from "../assets/profile.jfif";
import './Navbar.css';
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={Logo} alt="Logo" className="brand-logo" />
        <span className="brand-text">Skill Exchange</span>
      </div>

      <ul className="navbar-center">
        <li>
          <Link to="/dashboard" className="nav-link active">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="#" className="nav-link">
            Explore videos & Notes
          </Link>
        </li>
        <li>
          <Link to="#" className="nav-link">
            My Purchase
          </Link>
        </li>
        <li>
          <Link to="#" className="nav-link">
            My Skills
          </Link>
        </li>
        <li>
          <Link to="/about" className="nav-link">
            About
          </Link>
        </li>
      </ul>

      <div className="navbar-right">
        <span className="credits">💰 20</span>

        <Link to="/profile">
          <img src={Profile} alt="Profile" className="profile-icon" />
        </Link>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
