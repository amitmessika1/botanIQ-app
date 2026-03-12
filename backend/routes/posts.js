const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const auth = require("../middleware/auth");
const Post = require("../models/Post");
const User = require("../models/User");

// GET /posts/feed?limit=20
router.get("/feed", auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 50);

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // להביא מידע בסיסי על הכותבים (שם+אווטאר)
    const authorIds = [...new Set(posts.map(p => String(p.authorId)))];
    const authors = await User.find({ _id: { $in: authorIds } })
      .select({ username: 1, avatarUrl: 1, email: 1 })
      .lean();

    const authorsById = new Map(authors.map(a => [String(a._id), a]));

    const shaped = posts.map(p => {
      const a = authorsById.get(String(p.authorId));
      const likesArr = Array.isArray(p.likes) ? p.likes.map(String) : [];
      const likedByMe = likesArr.includes(String(userId));
      return {
        _id: p._id,
        text: p.text,
        imageUrl: p.imageUrl,
        createdAt: p.createdAt,
        likesCount: likesArr.length,
        likedByMe,
        author: {
          id: p.authorId,
          username: a?.username || "",
          avatarUrl: a?.avatarUrl || "",
        },
      };
    });

    res.json(shaped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /posts  { text, imageUrl }
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { text = "", imageUrl = "" } = req.body;
    if (!String(text).trim() && !String(imageUrl).trim()) {
      return res.status(400).json({ message: "Empty post" });
    }

    const created = await Post.create({
      authorId: new mongoose.Types.ObjectId(userId),
      text: String(text),
      imageUrl: String(imageUrl),
      likes: [],
    });

    res.json({ ok: true, postId: created._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /posts/:id/like (toggle)
router.post("/:id/like", auth, async (req, res) => {
  try {
    const userId = String(req.user?.id || "");
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const hasLike = post.likes.map(String).includes(userId);

    if (hasLike) {
      post.likes = post.likes.filter(x => String(x) !== userId);
    } else {
      post.likes.push(new mongoose.Types.ObjectId(userId));
    }

    await post.save();
    res.json({ ok: true, likesCount: post.likes.length, likedByMe: !hasLike });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;