import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>Skill Exchange</h3>
          <p>Exchange skills. Grow together.</p>
        </div>

        <ul className="footer-links">
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/explore">Explore</Link>
          </li>
          <li>
            <Link to="/purchases">Purchases</Link>
          </li>
        </ul>

        <div className="footer-social">
          <a href="https://github.com/ayaan-mirza7/Skill-exchange" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="mailto:ayaanmirza764@gmail.com">Ayaan</a>
          <a href="mailto:shreymojidra06@gmail.com">Shreyansh</a>
        </div>
      </div>

      <div className="footer-bottom">© 2026 Skill Exchange</div>
    </footer>
  );
}
