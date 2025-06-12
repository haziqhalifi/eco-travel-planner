import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaLeaf, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1: ask email, 2: ask new password
  const [forgotError, setForgotError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] =
    useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    document.title = "EcoTravel | Sign In";
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "password") {
      setPasswordError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordError(true);
      return;
    }

    setIsLoading(true);

    // Use context login
    const result = await login({ email, password });
    setIsLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setPasswordError(true); // Optionally show error
      alert(result.error || "Incorrect email or password.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    if (forgotStep === 1) {
      // Simulate API call to check if email exists
      setIsLoading(true);
      try {
        // Replace with real API call
        const res = await fetch("/api/auth/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        });
        const data = await res.json();
        setIsLoading(false);
        if (data.exists) {
          setForgotStep(2);
        } else {
          setForgotError("Email not found.");
        }
      } catch {
        setIsLoading(false);
        setForgotError("Server error. Try again later.");
      }
    } else if (forgotStep === 2) {
      if (
        newPassword.length < 8 ||
        !/[A-Za-z]/.test(newPassword) ||
        !/[^A-Za-z0-9]/.test(newPassword)
      ) {
        setForgotError(
          "Password must be at least 8 characters with symbols and letters."
        );
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setForgotError("Passwords do not match.");
        return;
      }
      setIsLoading(true);
      try {
        // Replace with real API call
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail, newPassword }),
        });
        const data = await res.json();
        setIsLoading(false);
        if (data.success) {
          alert(
            "Password reset successful. Please sign in with your new password."
          );
          setShowForgotPassword(false);
          setForgotStep(1);
          setForgotEmail("");
          setNewPassword("");
          setConfirmNewPassword("");
        } else {
          setForgotError(data.error || "Failed to reset password.");
        }
      } catch {
        setIsLoading(false);
        setForgotError("Server error. Try again later.");
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
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
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-100 shadow-lg rounded-4 bg-white p-4"
            style={{
              maxWidth: "430px",
              minHeight: "580px",
              background: "rgba(255,255,255,0.97)",
            }}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="h-100 d-flex flex-column"
            >
              <motion.div variants={itemVariants} className="text-center mb-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FaLeaf
                    className="text-success"
                    style={{ fontSize: "2.5rem" }}
                  />
                </motion.div>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="text-center mb-1 fw-bold"
              >
                Welcome to EcoTravel
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-center text-muted mb-4"
              >
                Your gateway to sustainable travel
              </motion.p>

              <motion.div variants={itemVariants} className="d-flex mb-4">
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
              </motion.div>

              <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className="flex-grow-1 d-flex flex-column"
              >
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div
                    className="input-group"
                    style={{
                      border: "1px solid #ced4da",
                      borderRadius: "0.375rem",
                    }}
                  >
                    <span
                      className="input-group-text bg-light"
                      style={{ borderRight: "1px solid #ced4da" }}
                    >
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{ borderLeft: "none" }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div
                    className="input-group"
                    style={{
                      border: `1px solid ${
                        passwordError ? "#dc3545" : "#ced4da"
                      }`,
                      borderRadius: "0.375rem",
                      boxShadow: passwordError
                        ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
                        : "none",
                    }}
                  >
                    <span
                      className="input-group-text bg-light"
                      style={{
                        borderRight: `1px solid ${
                          passwordError ? "#dc3545" : "#ced4da"
                        }`,
                        borderRadius: "0.375rem 0 0 0.375rem",
                      }}
                    >
                      <FaLock />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{
                        borderLeft: "none",
                        borderRight: "none",
                        borderRadius: "0",
                        outline: "none",
                        boxShadow: "none",
                      }}
                    />
                    <span
                      className="input-group-text bg-light"
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{
                        cursor: "pointer",
                        borderLeft: `1px solid ${
                          passwordError ? "#dc3545" : "#ced4da"
                        }`,
                        borderRadius: "0 0.375rem 0.375rem 0",
                      }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {passwordError && (
                    <div
                      style={{
                        color: "#dc3545",
                        fontSize: "0.875rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      Password must be at least 8 characters with symbols and
                      letters
                    </div>
                  )}
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
                      style={{ border: "1px solid #ced4da" }}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <a
                    href="#"
                    className="text-success"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowForgotPassword(true);
                    }}
                  >
                    Forgot password?
                  </a>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn btn-success w-100 py-2 mb-3 mt-auto"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>

                <div className="d-flex align-items-center mb-3">
                  <hr
                    className="flex-grow-1"
                    style={{ borderColor: "#dee2e6" }}
                  />
                  <span
                    className="px-2 text-muted"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    OR
                  </span>
                  <hr
                    className="flex-grow-1"
                    style={{ borderColor: "#dee2e6" }}
                  />
                </div>
              </motion.form>

              <motion.div variants={itemVariants} className="text-center mt-3">
                Don't have an account?{" "}
                <a href="/signup" className="text-success fw-semibold">
                  Sign up
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {showForgotPassword && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reset Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotStep(1);
                    setForgotEmail("");
                    setForgotError("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                  }}
                ></button>
              </div>
              <form onSubmit={handleForgotPassword}>
                <div className="modal-body">
                  {forgotStep === 1 && (
                    <>
                      <label
                        htmlFor="forgotEmail"
                        className="form-label"
                        style={{ fontSize: "0.9rem" }}
                      >
                        Enter your email address
                      </label>
                      <input
                        type="email"
                        className="form-control mb-2"
                        id="forgotEmail"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        style={{
                          border: "1px solid #ced4da",
                          borderRadius: "0.375rem",
                        }}
                      />
                    </>
                  )}
                  {forgotStep === 2 && (
                    <>
                      <label
                        htmlFor="newPassword"
                        className="form-label"
                        style={{ fontSize: "0.9rem" }}
                      >
                        New Password
                      </label>
                      <div
                        className="input-group mb-2"
                        style={{
                          border: "1px solid #ced4da",
                          borderRadius: "0.375rem",
                        }}
                      >
                        <input
                          type={showForgotNewPassword ? "text" : "password"}
                          className="form-control"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          style={{ border: "none", boxShadow: "none" }}
                        />
                        <span
                          className="input-group-text bg-light"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setShowForgotNewPassword((prev) => !prev)
                          }
                        >
                          {showForgotNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                      <label
                        htmlFor="confirmNewPassword"
                        className="form-label"
                        style={{ fontSize: "0.9rem" }}
                      >
                        Confirm New Password
                      </label>
                      <div
                        className="input-group mb-2"
                        style={{
                          border: "1px solid #ced4da",
                          borderRadius: "0.375rem",
                        }}
                      >
                        <input
                          type={showForgotConfirmPassword ? "text" : "password"}
                          className="form-control"
                          id="confirmNewPassword"
                          value={confirmNewPassword}
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
                          required
                          style={{ border: "none", boxShadow: "none" }}
                        />
                        <span
                          className="input-group-text bg-light"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setShowForgotConfirmPassword((prev) => !prev)
                          }
                        >
                          {showForgotConfirmPassword ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                        </span>
                      </div>
                    </>
                  )}
                  {forgotError && (
                    <div className="text-danger small mt-1">{forgotError}</div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotStep(1);
                      setForgotEmail("");
                      setForgotError("");
                      setNewPassword("");
                      setConfirmNewPassword("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Please wait..."
                      : forgotStep === 1
                      ? "Next"
                      : "Reset Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
