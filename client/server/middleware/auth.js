import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Authorization denied.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Middleware to check if user is an owner
export const ownerMiddleware = (req, res, next) => {
  if (req.userRole !== "owner") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Owner privileges required.",
    });
  }
  next();
};
