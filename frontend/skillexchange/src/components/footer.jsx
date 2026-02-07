import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left */}
        <div className="footer-brand">
          <h3>Skill Exchange</h3>
          <p>Exchange skills. Grow together.</p>
        </div>

        {/* Center */}
        <ul className="footer-links">
          <li>
            <a href="/about">About</a>
          </li>
          {/* <li>
            <a href="/how-it-works">How it Works</a>
          </li> */}
          <li>
            <a href="/contact">Contact</a>
          </li>
          {/* <li>
            <a href="/privacy">Privacy</a>
          </li>
          <li>
            <a href="/terms">Terms</a>
          </li> */}
        </ul>

        {/* Right */}
        <div className="footer-social">
          <a href="https://github.com/ayaan-mirza7/Skill-exchange">GitHub</a>
          {/* <a href="#">LinkedIn</a> */}
          <a href="mailto:ayaanmirza764@gmail.com">Email: Ayaan Mirza</a>
          <a href="mailto:shreymojidra06@gmail.com">Email: Shreyansh Mojidra</a>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 Skill Exchange. Made with ❤️ by the Skill Exchange Team.
      </div>
    </footer>
  );
}
