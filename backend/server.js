import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import tripRoutes from "./routes/trips.js";
import personalTripRoutes from "./routes/personalTrips.js";
import serpRoutes from "./routes/serpRoutes.js";
import axios from "axios";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/personal-trips", personalTripRoutes);
app.use("/api/serp", serpRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/proxy-image", async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).json({ error: "Missing image URL" });
  }

  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    // Forward the content type from the response
    res.setHeader(
      "Content-Type",
      response.headers["content-type"] || "image/jpeg"
    );
    res.send(response.data);
  } catch (err) {
    console.error("Error fetching image:", err.message);
    res
      .status(500)
      .json({ error: "Failed to fetch image", details: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 1;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
