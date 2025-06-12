import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaLeaf,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
    document.title = "EcoTravel | Sign Up";
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const isPasswordInvalid =
    formData.password.length > 0 &&
    (formData.password.length < 8 ||
      !/[a-zA-Z]/.test(formData.password) ||
      !/[^\w\s]/.test(formData.password));

  const isConfirmInvalid =
    formData.confirmPassword.length > 0 &&
    formData.confirmPassword !== formData.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Prepare registration data
    const { username, email, password } = formData;
    const result = await register({ username, email, password });
    setIsLoading(false);
    if (result.success) {
      navigate("/dashboard");
    } else {
      // Optionally show error to user
      alert(result.error || "Registration failed");
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
                <button
                  className="btn btn-success flex-grow-1"
                  style={{ borderRadius: "2rem 0 0 2rem" }}
                >
                  Sign Up
                </button>
                <a
                  href="/signin"
                  className="btn btn-outline-secondary flex-grow-1"
                  style={{ borderRadius: "0 2rem 2rem 0" }}
                >
                  Login
                </a>
              </motion.div>

              <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className="flex-grow-1 d-flex flex-column"
              >
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
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
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      style={{ borderLeft: "none" }}
                    />
                  </div>
                </div>

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
                        isPasswordInvalid ? "red" : "#ced4da"
                      }`,
                      borderRadius: "0.375rem",
                    }}
                  >
                    <span
                      className="input-group-text bg-light"
                      style={{ borderRight: "1px solid #ced4da" }}
                    >
                      <FaLock />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{ borderLeft: "none", borderRight: "none" }}
                    />
                    <span
                      className="input-group-text bg-light"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {isPasswordInvalid && (
                    <small className="text-danger">
                      Password must be at least 8 characters with symbols and
                      letters.
                    </small>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <div
                    className="input-group"
                    style={{
                      border: `1px solid ${
                        isConfirmInvalid ? "red" : "#ced4da"
                      }`,
                      borderRadius: "0.375rem",
                    }}
                  >
                    <span
                      className="input-group-text bg-light"
                      style={{ borderRight: "1px solid #ced4da" }}
                    >
                      <FaLock />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      style={{ borderLeft: "none", borderRight: "none" }}
                    />
                    <span
                      className="input-group-text bg-light"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {isConfirmInvalid && (
                    <small className="text-danger">
                      Password does not match.
                    </small>
                  )}
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
                    style={{ border: "1px solid #ced4da" }}
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn btn-success w-100 py-2 mb-3"
                  style={{ transition: "background 0.2s" }}
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
                    "Create Account"
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
                Already have an account?{" "}
                <a href="/signin" className="text-success fw-semibold">
                  Sign in
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
