const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(400).json({ message: "Token are required!" });
  }
  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = jwtAuthMiddleware;
