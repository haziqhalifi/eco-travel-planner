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
    <div
      className="container-fluid p-0 min-vh-100"
      style={{
        background: "linear-gradient(135deg, #e0f7fa 0%, #fffde4 100%)",
      }}
    >
      <div className="row m-0 h-100 justify-content-center align-items-center">
        <div className="col-12 col-md-8 col-lg-5 d-flex align-items-center justify-content-center p-4 h-100">
          <div
            className="w-100 shadow-lg rounded-4 bg-white p-4"
            style={{
              maxWidth: "430px",
              minHeight: "480px",
              background: "rgba(255,255,255,0.97)",
            }}
          >
            <div className="text-center mb-4">
              <i
                className="bi bi-globe2 text-success"
                style={{ fontSize: "2.5rem" }}
              ></i>
            </div>
            <h2 className="text-center mb-1 fw-bold">Welcome to EcoTravel</h2>
            <p className="text-center text-muted mb-4">
              Your gateway to sustainable travel
            </p>

            <div className="d-flex mb-4">
              <a
                href="/signup"
                className="btn btn-outline-secondary flex-grow-1"
                style={{ borderRadius: "2rem 0 0 2rem" }}
              >
                Sign Up
              </a>
              <button
                className="btn btn-success flex-grow-1"
                style={{ borderRadius: "0 2rem 2rem 0" }}
              >
                Login
              </button>
            </div>

            <form onSubmit={handleSubmit}>
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
                type="submit"
                className="btn btn-success w-100 py-2 mb-3"
                style={{ transition: "background 0.2s" }}
              >
                Sign In
              </button>
            </form>

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
  );
};

export default SignIn;
