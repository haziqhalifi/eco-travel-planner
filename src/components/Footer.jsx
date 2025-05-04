import React from "react";

function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row">
          {/* Brand Info */}
          <div className="col-md-4 mb-3">
            <h5 className="d-flex align-items-center mb-2">
              <span className="me-2">🌱</span> EcoTravel
            </h5>
            <p>
              Making sustainable travel accessible and enjoyable for everyone.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-3">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white text-decoration-none">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-none">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-none">
                  Sustainability Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-none">
                  Partner With Us
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-md-4 mb-3">
            <h6>Newsletter</h6>
            <p>
              Stay updated with sustainable travel tips and exclusive offers.
            </p>
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
        <p className="text-center text-muted mb-0">
          © 2024 EcoTravel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
