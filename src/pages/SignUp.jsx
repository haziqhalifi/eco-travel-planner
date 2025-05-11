import React, { useState } from "react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  return (
    <div className="container-fluid p-0">
      <div className="row m-0">
        <div className="col-lg-6 p-0">
          <div
            className="bg-image h-100"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            <div
              className="mask h-100 w-100"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            >
              <div className="d-flex flex-column justify-content-center align-items-center h-100 text-white p-4">
                <h1 className="display-4 fw-bold mb-3">
                  Join Our Sustainable Journey
                </h1>
                <p className="lead text-center">
                  Connect with nature-loving travelers and explore the world
                  responsibly
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 d-flex align-items-center justify-content-center p-4">
          <div className="w-100" style={{ maxWidth: "450px" }}>
            <h2 className="text-center mb-1">Welcome to EcoTravel</h2>
            <p className="text-center text-muted mb-4">
              Your gateway to sustainable travel
            </p>

            <div className="d-flex mb-4">
              <button className="btn btn-outline-secondary flex-grow-1 active">
                Sign Up
              </button>
              <a
                href="/signin"
                className="btn btn-outline-secondary flex-grow-1"
              >
                Login
              </a>
            </div>

            <div onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0"
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label" htmlFor="agreeTerms">
                  I agree to the{" "}
                  <a href="#" className="text-success">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-success">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                onClick={handleSubmit}
                className="btn btn-success w-100 py-2 mb-3"
              >
                Create Account
              </button>

              <div className="text-center">
                Already have an account?{" "}
                <a href="/signin" className="text-success">
                  Sign in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-light py-3 text-center text-muted">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>© 2025 EcoTravel. All rights reserved.</div>
            <div>
              <a href="#" className="text-muted me-3">
                Privacy Policy
              </a>
              <a href="#" className="text-muted me-3">
                Terms of Service
              </a>
              <a href="#" className="text-muted">
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignUp;
