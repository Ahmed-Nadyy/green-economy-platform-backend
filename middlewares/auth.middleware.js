const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModel");

const protected = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: false,
        message: "Access denied. No token provided or invalid format.",
      });
    }

    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findByPk(decoded.id);

    if (!admin) {
      return res.status(401).json({
        status: false,
        message: "Access denied. Invalid token.",
      });
    }

    req.admin = {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      role: "admin",
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: false,
        message: "Access denied. Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: false,
        message: "Access denied. Token expired.",
      });
    }

    return res.status(500).json({
      status: false,
      message: "Authentication failed.",
    });
  }
};

module.exports = {
  protected,
};
