const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const auth = require("../middleware/auth");
const UserGarden = require("../models/UserGarden");

function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}
function daysDiffCeil(from, to) {
  return Math.ceil((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
}

// GET /reminders
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.userId || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const garden = await UserGarden.findOne({ userId }).lean();
    const gardenPlants = Array.isArray(garden?.plants) ? garden.plants : [];
    if (gardenPlants.length === 0) return res.json([]);

    const plantIds = gardenPlants.map(p => p.plantId).filter(Boolean);

    const plantsCol = mongoose.connection.collection("plants");
    const plantDocs = await plantsCol
      .find(
        { _id: { $in: plantIds.map(x => new mongoose.Types.ObjectId(x)) } },
        { projection: { displayName: 1, name: 1, image: 1, schedule: 1 } }
      )
      .toArray();

    const byId = new Map(plantDocs.map(d => [String(d._id), d]));
    const now = new Date();

    const reminders = gardenPlants
      .map(gp => {
        const plant = byId.get(String(gp.plantId));
        const everyDays = plant?.schedule?.wateringEveryDays; // schedule.wateringEveryDays

        if (!Number.isFinite(everyDays) || everyDays <= 0) return null;

        const base = gp.lastWatered ? new Date(gp.lastWatered) : new Date(gp.addedAt || now);
        const nextWaterAt = addDays(base, everyDays);
        const daysLeft = daysDiffCeil(now, nextWaterAt);
        const isDue = nextWaterAt.getTime() <= now.getTime();

        return {
          plantId: String(gp.plantId),
          title: plant?.displayName || plant?.name || "Plant",
          image: plant?.image || null,
          wateringEveryDays: everyDays,
          lastWateredAt: gp.lastWateredAt || null,
          nextWaterAt,
          daysLeft,
          status: isDue ? "due" : "upcoming",
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (a.status !== b.status) return a.status === "due" ? -1 : 1;
        return new Date(a.nextWaterAt) - new Date(b.nextWaterAt);
      });

    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST /reminders/:plantId/watered
/*router.post("/:plantId/watered", auth, async (req, res) => { //TODO
  try {
    const userId = req.user?.id || req.userId || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { plantId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(plantId)) {
      return res.status(400).json({ message: "Invalid plant id" });
    }

    const { date } = req.body || {};
    const lastWatered = date ? new Date(date) : new Date();
    if (Number.isNaN(lastWatered.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const r = await UserGarden.updateOne(
      { userId: new mongoose.Types.ObjectId(userId), "plants.plantId": new mongoose.Types.ObjectId(plantId) },
      { $set: { "plants.$.lastWatered": lastWatered } }
    );

    if (!r.matchedCount) return res.status(404).json({ message: "Plant not found in garden" });

    res.json({ ok: true, plantId, lastWatered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});*/

router.post("/:plantId/watered", auth, async (req, res) => {
  const userId = req.user?.id || req.userId || req.user?._id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { plantId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(plantId)) {
    return res.status(400).json({ message: "Invalid plant id" });
  }

  const { date } = req.body || {};
  const lastWateredAt  = date ? new Date(date) : new Date();
  if (Number.isNaN(lastWateredAt .getTime())) {
    return res.status(400).json({ message: "Invalid date" });
  }
 const r = await UserGarden.updateOne(
  { userId: new mongoose.Types.ObjectId(userId), "plants.plantId": new mongoose.Types.ObjectId(plantId) },
  { $set: { "plants.$.lastWatered": lastWateredAt } }
);
  if (!r.matchedCount) return res.status(404).json({ message: "Plant not found in garden" });

  res.json({ ok: true, plantId, lastWateredAt  });
});


module.exports = router;
