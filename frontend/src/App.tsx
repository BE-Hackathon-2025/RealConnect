import React from "react";
import "./App.css";
import Chatbot from "./components/chatbot";

export default function App() {
  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-logo">The Real Connect</div>
        <ul className="navbar-links">
          <li><a href="#wellness">Wellness</a></li>
          <li><a href="#essentials">Essentials</a></li>
          <li><a href="#work">Work & Growth</a></li>
          <li><a href="#learn">Learn & Level Up</a></li>
          <li><a href="#community">Community Wall</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="hero-content">
          <h1>Welcome to The Real Connect!</h1>
          <p>Your bright path to wellness, essentials, and community support.</p>
          <button className="find-help-btn">
            Find Help
          </button>
        </div>
        <div className="hero-graphic" aria-hidden="true" />
      </header>

      {/* Resources Section */}
      <section id="resources" className="resources-section">
        <h2>Wellness, Essentials, Growth & More</h2>
        <div className="card-grid">
          <div className="resource-card">
            <h3>Mental Health & Therapy</h3>
            <p>Connect with local therapists and helplines for support.</p>
          </div>
          <div className="resource-card">
            <h3>Fitness & Wellness</h3>
            <p>Find fitness classes, wellness activities, and free groups.</p>
          </div>
          <div className="resource-card">
            <h3>Food Assistance</h3>
            <p>Food banks, pantry locations, and meal programs near you.</p>
          </div>
          <div className="resource-card">
            <h3>Shelter & Housing</h3>
            <p>Emergency shelters and rental assistance resources.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span>&copy; 2025 The Real Connect. Wellness & Community for all.</span>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </>
  );
}
