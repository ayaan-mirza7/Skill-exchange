import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import dev2 from "../assets/Dev2.jpeg";
import pic from "../assets/profile.svg";
import Card from "../components/ui/Card";
import "./About.css";

export default function About() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main about-main">
        <section className="about-hero">
          <h1 className="page-title">About Skill Exchange</h1>
          <p className="muted-text">
            A collaborative learning platform where users share and discover skills through videos and notes.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Make learning accessible, community-driven, and rewarding by empowering people to teach what they know.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Offer</h2>
          <ul className="features-list">
            <li>Skill-based video learning</li>
            <li>Downloadable study notes</li>
            <li>Credit-based exchange system</li>
            <li>Personalized dashboard and profile</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Developers</h2>
          <div className="dev-grid">
            <Card className="dev-card">
              <img src={pic} alt="Ayaan Mirza" />
              <h3>Ayaan Mirza</h3>
              <p>Full Stack Developer</p>
            </Card>
            <Card className="dev-card">
              <img src={dev2} alt="Shreyansh Mojidra" />
              <h3>Shreyansh Mojidra</h3>
              <p>Full Stack Developer</p>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
