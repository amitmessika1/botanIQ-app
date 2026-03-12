#!/usr/bin/env node
/**
 * Minimal plants enrichment:
 * - builds an LLM mapping for unique "watering" descriptions
 * - adds "schedule" with only:
 *    { wateringEveryDays: int, vaseWaterChangeEveryDays?: int }
 *
 * Usage:
 *   node plants-enrichment-script.js <input.json> <output.json>
 *
 * Env:
 *   GEMINI_API_KEY=...
 *   GEMINI_MODEL=gemini-2.0-flash (optional)
 */

const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const INPUT = process.argv[2] || "./plants.seed.with_images.json";
const OUTPUT = process.argv[3] || "./plants.enriched.json";

// cache to avoid repeated calls
const CACHE_PATH = path.join(process.cwd(), "watering-llm-cache.json");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), "utf8");
}
function normalize(s) {
  return String(s || "").trim().replace(/\s+/g, " ").replace(/\u0000/g, "");
}
function loadCache() {
  try {
    if (fs.existsSync(CACHE_PATH)) return readJson(CACHE_PATH);
  } catch (_) {}
  return {};
}
function saveCache(cache) {
  try {
    writeJson(CACHE_PATH, cache);
  } catch (_) {}
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
function clampInt(n, min, max) {
  const x = Math.round(Number(n));
  if (!Number.isFinite(x)) return min;
  return Math.max(min, Math.min(max, x));
}

/**
 * Heuristic fallback (if LLM fails / rate limit)
 */
function heuristicSchedule(text) {
  const t = text.toLowerCase();
  const hasVase = t.includes("vase") || t.includes("change water");

  let wateringEveryDays = 7;

  if (t.includes("must not be dry")) wateringEveryDays = 2;
  else if (t.includes("keep moist") && t.includes("bit dry")) wateringEveryDays = 4;
  else if (t.includes("keep moist") && (t.includes("can dry") || t.includes("dry between"))) wateringEveryDays = 5;
  else if (t.includes("half dry")) wateringEveryDays = 7;
  else if (t.includes("only when dry") || t.includes("must be dry")) wateringEveryDays = 12;

  const schedule = { wateringEveryDays };
  if (hasVase) schedule.vaseWaterChangeEveryDays = 7;

  return schedule;
}

/**
 * Gemini call: returns minimal schedule JSON only.
 */
async function llmSchedule(genModel, wateringText) {
  const prompt = `
Map this houseplant watering instruction to a minimal reminder schedule.

Return ONLY a single JSON object with this exact schema:
{
  "wateringEveryDays": number,                 // integer, 1..30
  "vaseWaterChangeEveryDays": number | null    // integer, 2..21 or null if not relevant
}

Guidance:
- "Must not be dry" => 1..3 days
- "Keep moist ... can be a bit dry" => 3..5 days
- "Water when soil is half dry" => 5..10 days
- "Must be dry / water only when dry" => 8..18 days
- If it mentions changing water in a vase, set vaseWaterChangeEveryDays to a reasonable value (e.g. 7). Otherwise null.

Instruction:
"${wateringText}"
`.trim();

  const maxAttempts = 8;
  let delayMs = 1500;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await genModel.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      });

      const raw = (result?.response?.text?.() ?? "").trim();
      const cleaned = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      const obj = JSON.parse(cleaned);

      const wateringEveryDays = clampInt(obj.wateringEveryDays, 1, 30);

      let vase = obj.vaseWaterChangeEveryDays;
      if (vase === null || vase === undefined) {
        vase = null;
      } else {
        vase = clampInt(vase, 2, 21);
      }

      const schedule = { wateringEveryDays };
      if (vase !== null) schedule.vaseWaterChangeEveryDays = vase;

      return schedule;
    } catch (e) {
      const msg = String(e?.message || e).toLowerCase();
      const isRate =
        msg.includes("rate") || msg.includes("429") || msg.includes("resource exhausted");
      const isTransient = isRate || msg.includes("timeout") || msg.includes("503") || msg.includes("tempor");

      if (attempt === maxAttempts || !isTransient) throw e;

      await sleep(delayMs);
      delayMs = Math.min(delayMs * 1.8, 60000);
    }
  }

  return heuristicSchedule(wateringText);
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY in environment (.env).");
    process.exit(1);
  }

  const plants = readJson(INPUT);
  if (!Array.isArray(plants)) {
    console.error("Input JSON must be an array.");
    process.exit(1);
  }

  // unique watering texts
  const unique = new Set();
  for (const p of plants) {
    const w = normalize(p.watering);
    if (w) unique.add(w);
  }

  console.log(`Loaded ${plants.length} plants. Unique watering texts: ${unique.size}`);

  const cache = loadCache();

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const genModel = genAI.getGenerativeModel({ model: modelName });

  // Build mapping
  const mapping = {};
  let idx = 0;

  for (const w of unique) {
    idx++;

    if (cache[w]) {
      mapping[w] = cache[w];
      console.log(`(${idx}/${unique.size}) cache hit`);
      continue;
    }

    console.log(`(${idx}/${unique.size}) LLM -> ${w}`);
    try {
      const schedule = await llmSchedule(genModel, w);
      mapping[w] = schedule;
      cache[w] = schedule;
      saveCache(cache);
    } catch (e) {
      console.warn(`LLM failed, heuristic fallback. Error: ${e?.message || e}`);
      const schedule = heuristicSchedule(w);
      mapping[w] = schedule;
      cache[w] = schedule;
      saveCache(cache);
    }
  }

  // Enrich plants
  const enriched = plants.map((p) => {
    const w = normalize(p.watering);
    if (!w) return { ...p, schedule: null };
    return { ...p, schedule: mapping[w] || null };
  });

  writeJson(OUTPUT, enriched);

  // Optional: mapping file for debugging (still minimal schedule)
  const mappingOut = path.join(path.dirname(OUTPUT), "watering.frequency.mapping.json");
  writeJson(mappingOut, mapping);

  console.log(`Wrote: ${OUTPUT}`);
  console.log(`Wrote mapping: ${mappingOut}`);
  console.log(`Cache: ${CACHE_PATH}`);
}

main().catch((e) => {
  console.error("Fatal:", e?.message || e);
  process.exit(1);
});
