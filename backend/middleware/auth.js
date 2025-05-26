import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access token required",
      error: "MISSING_TOKEN",
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "fallback_secret",
    (err, user) => {
      if (err) {
        return res.status(403).json({
          message: "Invalid or expired token",
          error: "INVALID_TOKEN",
        });
      }
      req.user = user;
      next();
    }
  );
};

export default authenticateToken;
