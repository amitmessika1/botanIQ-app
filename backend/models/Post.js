const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, default: "" },
    imageUrl: { type: String, default: "" }, // בשלב ראשון: רק URL (לא קובץ מקומי)
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true } // createdAt, updatedAt
);

module.exports = mongoose.model("Post", PostSchema);
