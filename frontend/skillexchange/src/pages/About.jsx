import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import dev2 from "../assets/Dev2.jpeg";
import pic from "../assets/profile.svg";
import './About.css'

export default function About() {
  return (
    <>
      <Navbar />
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <h1>About Skill Exchange</h1>
          <p>
            Skill Exchange is a collaborative learning platform where users can
            share, discover, and exchange skills through videos and notes using
            a credit-based system.
          </p>
        </section>

        {/* Mission Section */}
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to make learning accessible, community‑driven, and
            rewarding by empowering individuals to teach what they know and
            learn what they love.
          </p>
        </section>

        {/* Features Section */}
        <section className="about-section">
          <h2>What We Offer</h2>
          <ul className="features-list">
            <li>🎥 Skill-based video learning</li>
            <li>📄 Downloadable study notes</li>
            <li>💳 Credit-based exchange system</li>
            <li>👤 Personalized dashboards</li>
            <li>🔒 Secure authentication</li>
          </ul>
        </section>

        {/* Developers Section */}
        <section className="about-section">
          <h2>Meet the Developers</h2>

          <div className="dev-grid">
            <div className="dev-card">
              <img src={pic} alt="Developer 1" />
              <h3>Ayaan Mirza</h3>
              <p>Full Stack Developer</p>
              <span>MERN Stack | Backend & Architecture</span>
            </div>

            <div className="dev-card">
              <img src={dev2} alt="Developer 2" />
              <h3>Shreyansh Mojidra</h3>
              <p>Full stack Developer</p>
              <span>MERN | UI/UX & Frontend</span>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
