const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Not an admin" });
    }

    req.user = decoded; // ? This attaches the name/email/role to request
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

