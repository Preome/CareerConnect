const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded user info
    next(); // pass control to next middleware or route
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

const isRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      return next(); // role allowed
    }
    return res.status(403).json({ message: "Forbidden: insufficient role" });
  };
};

module.exports = { auth, isRole };
