const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  avatarUrl: { type: String, default: "" }, 
  //gardenPlantIds: [{ type: mongoose.Schema.Types.ObjectId }] //TODO
});

module.exports = mongoose.model("User", UserSchema);
