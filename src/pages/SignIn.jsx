import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGoogle, FaEnvelope, FaLock, FaLeaf } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    document.title = "EcoTravel | Sign In";

    // Redirect if already logged in
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth integration
    setError("Google Sign-In will be implemented soon");
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
                  <FaLeaf className="text-success" style={{ fontSize: "2.5rem" }} />
                </motion.div>
              </motion.div>

              <motion.h2 variants={itemVariants} className="text-center mb-1 fw-bold">
                Welcome to EcoTravel
              </motion.h2>
              <motion.p variants={itemVariants} className="text-center text-muted mb-4">
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

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="alert alert-danger"
                  role="alert"
                >
                  {error}
                </motion.div>
              )}

              <motion.form variants={itemVariants} onSubmit={handleSubmit} className="flex-grow-1 d-flex flex-column">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div className="input-group" style={{ border: "1px solid #ced4da", borderRadius: "0.375rem" }}>
                    <span className="input-group-text bg-light" style={{ borderRight: "1px solid #ced4da" }}>
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
                      disabled={isLoading}
                      style={{ borderLeft: "none" }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-group" style={{ border: "1px solid #ced4da", borderRadius: "0.375rem" }}>
                    <span className="input-group-text bg-light" style={{ borderRight: "1px solid #ced4da" }}>
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      style={{ borderLeft: "none" }}
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
                      disabled={isLoading}
                      style={{ border: "1px solid #ced4da" }}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-success">
                    Forgot password?
                  </a>
                </div>

                <motion.button
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  type="submit"
                  className="btn btn-success mb-3 py-2"
                  disabled={isLoading}
                  style={{ borderRadius: "2rem" }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>

                <div className="d-flex align-items-center mb-3">
                  <hr className="flex-grow-1" />
                  <span className="mx-3 text-muted">or</span>
                  <hr className="flex-grow-1" />
                </div>

                <motion.button
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  type="button"
                  className="btn btn-outline-danger mb-3 py-2 d-flex align-items-center justify-content-center"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  style={{ borderRadius: "2rem" }}
                >
                  <FaGoogle className="me-2" />
                  Continue with Google
                </motion.button>

                <div className="text-center mt-auto">
                  <p className="text-muted">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-success text-decoration-none">
                      Sign up here
                    </a>
                  </p>
                </div>
              </motion.form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
