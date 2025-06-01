import Logo from "../assets/logo.png";
import React, { useState } from "react";

function Footer() {
  // Newsletter state
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Newsletter submit handler
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Here you could send the email to your backend or an API
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000); // Hide message after 4s
  };

  return (
    <footer
      className="bg-dark text-white pt-5 pb-4 mt-auto position-relative"
      style={{
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      {/* Subtle background overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at 20% 40%, rgba(0,255,128,0.08) 0, transparent 70%), radial-gradient(circle at 80% 60%, rgba(0,128,255,0.08) 0, transparent 70%)",
          zIndex: 0,
        }}
      ></div>
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row gy-4 align-items-stretch">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6 mb-3 d-flex flex-column">
            <h5 className="d-flex align-items-center mb-3 fw-bold">
              <img
                src={Logo}
                alt="Eco Travel Planner Logo"
                style={{ width: "36px", height: "36px", marginRight: "12px" }}
                className="rounded-md shadow-sm"
              />
              Eco Travel Planner
            </h5>
            <p style={{ fontSize: "1rem", lineHeight: 1.6 }}>
              Eco Travel Planner is your companion for planning environmentally
              friendly journeys. Our platform helps you discover sustainable
              destinations, eco-friendly accommodations, and green travel
              options.
            </p>
            <div className="d-flex gap-3 mt-2">
              <a
                href="#"
                className="text-white"
                style={{ fontSize: "1.5rem" }}
                title="Facebook"
              >
                <i
                  className="bi bi-facebook"
                  style={{ transition: "color 0.2s" }}
                ></i>
              </a>
              <a
                href="#"
                className="text-white"
                style={{ fontSize: "1.5rem" }}
                title="Twitter"
              >
                <i
                  className="bi bi-twitter"
                  style={{ transition: "color 0.2s" }}
                ></i>
              </a>
              <a
                href="#"
                className="text-white"
                style={{ fontSize: "1.5rem" }}
                title="Instagram"
              >
                <i
                  className="bi bi-instagram"
                  style={{ transition: "color 0.2s" }}
                ></i>
              </a>
              <a
                href="#"
                className="text-white"
                style={{ fontSize: "1.5rem" }}
                title="LinkedIn"
              >
                <i
                  className="bi bi-linkedin"
                  style={{ transition: "color 0.2s" }}
                ></i>
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div className="col-lg-3 col-md-6 mb-3">
            <h6 className="fw-bold mb-3">
              <i className="bi bi-lightning-charge-fill me-2 text-success"></i>
              Quick Links
            </h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a
                  href="/dashboard"
                  className="text-white text-decoration-none"
                  style={{ transition: "color 0.2s" }}
                >
                  Dashboard
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="/eco-options"
                  className="text-white text-decoration-none"
                  style={{ transition: "color 0.2s" }}
                >
                  Eco Options
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="/trip"
                  className="text-white text-decoration-none"
                  style={{ transition: "color 0.2s" }}
                >
                  Travel Plan
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="/weather"
                  className="text-white text-decoration-none"
                  style={{ transition: "color 0.2s" }}
                >
                  Weather
                </a>
              </li>
              <li>
                <a
                  href="/carbon-calculator"
                  className="text-white text-decoration-none"
                  style={{ transition: "color 0.2s" }}
                >
                  Carbon Calculator
                </a>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div className="col-lg-5 col-md-12 mb-3">
            <h6 className="fw-bold mb-3">
              <i className="bi bi-envelope-paper-heart-fill me-2 text-info"></i>
              Newsletter
            </h6>
            <p>Stay updated with travel tips and exclusive offers.</p>
            <form className="row g-2" onSubmit={handleNewsletterSubmit}>
              <div className="col-12 col-sm-8">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitted}
                />
              </div>
              <div className="col-12 col-sm-4">
                <button
                  className="btn btn-success w-100"
                  type="submit"
                  disabled={submitted}
                >
                  {submitted ? "Subscribed!" : "Subscribe"}
                </button>
              </div>
              {submitted && (
                <div className="col-12">
                  <div
                    className="alert alert-success py-2 my-2 mb-0"
                    role="alert"
                  >
                    Thank you for subscribing!
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
        <hr className="border-secondary mt-4" />
        <p
          className="text-center mb-0 small"
          style={{ letterSpacing: "0.5px" }}
        >
          © 2025 Eco Travel Planner. All rights reserved.
        </p>
      </div>
      {/* Inline style for hover effects */}
      <style>{`
        .footer-link:hover, .footer-link:focus {
          color: #00ff80 !important;
        }
        .bi-facebook:hover { color: #3b5998 !important; }
        .bi-twitter:hover { color: #1da1f2 !important; }
        .bi-instagram:hover { color: #e1306c !important; }
        .bi-linkedin:hover { color: #0077b5 !important; }
      `}</style>
    </footer>
  );
}

export default Footer;
