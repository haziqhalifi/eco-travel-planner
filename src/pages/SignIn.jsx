import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    console.log("Login submitted:", formData);
    setIsLoggedIn(true);
    navigate("/dashboard");
  };

  return (
    <div className="container-fluid p-0 mb-5">
      <div className="row m-0">
        <div className="col-lg-6 p-0">
          <div
            className="bg-image h-100"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80")',
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
                <h1 className="display-4 fw-bold mb-3">Welcome Back</h1>
                <p className="lead text-center">
                  Continue your sustainable travel journey with us
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
              <a
                href="/signup"
                className="btn btn-outline-secondary flex-grow-1"
              >
                Sign Up
              </a>
              <button className="btn btn-outline-secondary flex-grow-1 active">
                Login
              </button>
            </div>

            <div>
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-success">
                  Forgot password?
                </a>
              </div>

              <button
                onClick={handleSubmit}
                className="btn btn-success w-100 py-2 mb-3"
              >
                Sign In
              </button>

              <div className="text-center">
                Don't have an account?{" "}
                <a href="/signup" className="text-success">
                  Sign up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
