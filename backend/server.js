require("dotenv").config();        

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());                   
app.use(express.json());           

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo error:", err.message));

app.get("/", (req, res) => {
  res.send("Server is running 👋");
});

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
