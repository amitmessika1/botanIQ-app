const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token" });

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Bad token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const exists = await User.exists({ _id: decoded.id });
    if (!exists) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = { id: decoded.id };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
