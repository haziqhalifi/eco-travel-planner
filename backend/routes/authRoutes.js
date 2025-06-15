import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authenticateToken from "../middleware/auth.js"; // Ensure this is at the top

const router = express.Router();

// [REGISTER] POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide username, email, and password" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or username already exists" });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      personalTrips: [],
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
});

// [LOGIN] POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
});

// [VERIFY] GET /api/auth/verify
router.get("/verify", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// [UPDATE PROFILE] PATCH /api/auth/update-profile
router.patch("/update-profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: "Username and email are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email or username is already taken" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated",
      user: { username: updatedUser.username, email: updatedUser.email },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// [UPDATE PASSWORD] PATCH /api/auth/update-password
router.patch("/update-password", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// [CHECK EMAIL] POST /api/auth/check-email
router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ exists: false, error: "Email is required" });

    const user = await User.findOne({ email });
    return res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ exists: false, error: "Server error" });
  }
});

// [RESET PASSWORD] POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, error: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    if (
      newPassword.length < 8 ||
      !/[A-Za-z]/.test(newPassword) ||
      !/[^A-Za-z0-9]/.test(newPassword)
    ) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters with symbols and letters.",
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
