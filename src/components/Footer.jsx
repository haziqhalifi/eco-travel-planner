import Logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row">
          {/* Brand Info */}
          <div className="col-md-4 mb-3">
            <h5 className="d-flex align-items-center mb-2">
              <img
                src={Logo}
                alt="Eco Travel Planner Logo"
                style={{ width: "30px", height: "30px", marginRight: "10px" }}
                className="rounded-md"
              />
              Eco Travel Planner
            </h5>
            <p style={{ fontSize: "0.95rem" }}>
              Eco Travel Planner is your companion for planning environmentally
              friendly journeys. Our platform helps you discover sustainable
              destinations, eco-friendly accommodations, and green travel
              options. We aim to make responsible travel easy, enjoyable, and
              accessible for everyone who cares about the planet.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white" style={{ fontSize: "1.3rem" }}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-white" style={{ fontSize: "1.3rem" }}>
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-white" style={{ fontSize: "1.3rem" }}>
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-white" style={{ fontSize: "1.3rem" }}>
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div className="col-md-4 mb-3">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li>
                <a
                  href="/dashboard"
                  className="text-white text-decoration-none"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/eco-options"
                  className="text-white text-decoration-none"
                >
                  Eco Options
                </a>
              </li>
              <li>
                <a href="/trip" className="text-white text-decoration-none">
                  Travel Plan
                </a>
              </li>
              <li>
                <a href="/weather" className="text-white text-decoration-none">
                  Weather
                </a>
              </li>
              <li>
                <a
                  href="/carbon-calculator"
                  className="text-white text-decoration-none"
                >
                  Carbon Calculator
                </a>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div className="col-md-4 mb-3">
            <h6>Newsletter</h6>
            <p>Stay updated with travel tips and exclusive offers.</p>
            <div className="d-flex">
              <input
                type="email"
                className="form-control me-2"
                placeholder="Enter your email"
              />
              <button className="btn btn-success">Subscribe</button>
            </div>
          </div>
        </div>

        <hr className="border-secondary mt-4" />
        <p className="text-center mb-0">
          © 2025 Eco Travel Planner. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
