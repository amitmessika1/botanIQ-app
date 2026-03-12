const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const auth = require("../middleware/auth");
const User = require("../models/User");
const UserGarden = require("../models/UserGarden");


// GET /plants/search?q=...&limit=...&offset=...
router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    const limitRaw = parseInt(req.query.limit || "30", 10);
    const offsetRaw = parseInt(req.query.offset || "0", 10);

    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 30;
    const offset = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0;

    const col = mongoose.connection.collection("plants");
    const projection = { projection: { name: 1, displayName: 1, latin: 1, image: 1 } };

    let filter = {};
    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");

      filter = {
        $or: [
          { name: regex },
          { displayName: regex },
          { latin: regex },
        ],
      };
    }

    const [items, total] = await Promise.all([
      col.find(filter, projection).skip(offset).limit(limit).toArray(),
      col.countDocuments(filter),
    ]);
    
    const nextOffset = offset + items.length;
    const hasMore = nextOffset < total;

    res.json({ items, total, limit, offset, nextOffset, hasMore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /plants/my-garden

/*router.get("/my-garden", auth, async (req, res) => { //TODO
  try {
    const userId = req.user?.id || req.userId || req.user?._id; 
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).lean();
    const ids = Array.isArray(user?.gardenPlantIds) ? user.gardenPlantIds : [];

    const col = mongoose.connection.collection("plants");
    const projection = { projection: { name: 1, displayName: 1, latin: 1, image: 1 } };

    if (ids.length === 0) return res.json([]);

    // מביאים את הצמחים לפי ה־ids
    const plants = await col
      .find({ _id: { $in: ids.map((x) => new mongoose.Types.ObjectId(x)) } }, projection)
      .toArray();

    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});*/

router.get("/my-garden", auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.userId || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const garden = await UserGarden.findOne({ userId }).lean();
    const gardenPlants = Array.isArray(garden?.plants) ? garden.plants : [];

    if (gardenPlants.length === 0) return res.json([]);

    const ids = gardenPlants
      .map((p) => p.plantId)
      .filter(Boolean)
      .map((x) => new mongoose.Types.ObjectId(x));

    const col = mongoose.connection.collection("plants");
    const projection = { projection: { name: 1, displayName: 1, latin: 1, image: 1, treatmentSchedule: 1 } };

    const plants = await col.find({ _id: { $in: ids } }, projection).toArray();

    // map meta by plantId
    const metaById = new Map(gardenPlants.map((p) => [String(p.plantId), p]));

    // return plant docs, enriched with garden meta (doesn't break existing UI)
    const enriched = plants.map((p) => {
      const meta = metaById.get(String(p._id));
      return {
        ...p,
        // flatten selected meta fields for convenience (optional)
        addedAt: meta?.addedAt ?? null,
        lastWatered: meta?.lastWatered ?? null,  // ✅ קורא מ-lastWatered
        lastSoilCheckAt: meta?.lastSoilCheckAt ?? null,
        nextDueAt: meta?.nextDue ?? null,  // ✅ גם nextDue בלי "At"
        nextDueAction: meta?.nextDueAction ?? null,
      };
    });

    return res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /plants/:id/add-to-garden
router.post("/:id/add-to-garden", auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.userId || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plant id" });
    }
    const plantId = new mongoose.Types.ObjectId(id);

    // אופציונלי: לוודא שהצמח קיים
    const col = mongoose.connection.collection("plants");
    const exists = await col.findOne({ _id: plantId }, { projection: { _id: 1 } });
    if (!exists) return res.status(404).json({ message: "Plant not found" });

    /*await User.updateOne( //TODO
      { _id: new mongoose.Types.ObjectId(userId) },
      { $addToSet: { gardenPlantIds: plantId } }
    );*/
    
    await UserGarden.updateOne(
  { userId: new mongoose.Types.ObjectId(userId) },
  {
    $addToSet: {
      plants: {
        plantId,
        addedAt: new Date(),
        lastWatered: null,
        lastSoilCheckAt: null,
        nextDueAt: null,
        nextDueAction: null,
      },
    },
  },
  { upsert: true }
);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /plants/:id/remove-from-garden
router.post("/:id/remove-from-garden", auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.userId || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plant id" });
    }
    const plantId = new mongoose.Types.ObjectId(id);

    /*await User.updateOne( //TODO
      { _id: new mongoose.Types.ObjectId(userId) },
      { $pull: { gardenPlantIds: plantId } } // מסיר אם קיים
    );*/
    
    await UserGarden.updateOne(
  { userId: new mongoose.Types.ObjectId(userId) },
  { $pull: { plants: { plantId } } }
  );

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET /plants/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const col = mongoose.connection.collection("plants");

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const plant = await col.findOne({ _id: new mongoose.Types.ObjectId(id) });
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
