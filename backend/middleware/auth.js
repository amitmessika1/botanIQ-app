const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization; 
  if (!header) return res.status(401).json({ message: "No token" });

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token)
    return res.status(401).json({ message: "Bad token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
