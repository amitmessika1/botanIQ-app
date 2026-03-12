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

app.get("/plants/count", async (req, res) => {
  try {
    const count = await mongoose.connection.collection("plants").countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const plantsRoutes = require("./routes/plants");
app.use("/plants", plantsRoutes);

const postsRoutes = require("./routes/posts");
app.use("/posts", postsRoutes);

const path = require("path");
const uploadsRoutes = require("./routes/uploads");

app.use("/uploads", uploadsRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const remindersRoutes = require("./routes/reminders");
app.use("/reminders", remindersRoutes);


const PORT = process.env.PORT || 5000;
console.log("✅ MAIN SERVER FILE LOADED"); //
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
