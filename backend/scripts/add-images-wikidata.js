// backend/scripts/add-images-wikidata.js
const fs = require("fs");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function encFilePath(filename, width = 800) {
  const safe = String(filename).replace(/ /g, "_");
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(safe)}?width=${width}`;
}

function commonsFilePage(filename) {
  const safe = String(filename).replace(/ /g, "_");
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(safe)}`;
}

function svgPlaceholderDataUri(label) {
  const text = String(label || "Plant").slice(0, 60);
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
    <rect width="100%" height="100%" fill="#f1f5f9"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
      font-family="Arial" font-size="36" fill="#0f172a">${escapeXml(text)}</text>
  </svg>`.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function fetchJson(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "BotaniqPlantSeeder/1.1 (image backfill; contact: local)",
        "Accept": "application/json",
      },
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
    if (text.trim().startsWith("<")) throw new Error("Non-JSON response");

    return JSON.parse(text);
  } finally {
    clearTimeout(t);
  }
}

function getStrings(plant) {
  const latin = plant.latin || plant?.name?.scientific || plant?.name?.latin || null;

  const displayName =
    plant.displayName ||
    plant?.name?.en ||
    (Array.isArray(plant.common) ? (plant.common[1] || plant.common[0]) : null) ||
    null;

  const name =
    plant.name ||
    (latin && displayName ? `${latin} ${displayName}` : null) ||
    latin ||
    displayName ||
    null;

  return { latin, displayName, name };
}

function normalizeQuery(q) {
  return String(q || "")
    .replace(/\s+/g, " ")
    .replace(/[’']/g, "'")
    .trim();
}

function buildQueries(plant) {
  const { latin, displayName, name } = getStrings(plant);

  const queries = [];
  if (latin && displayName) queries.push(`${latin} ${displayName}`);
  if (name) queries.push(name);
  if (latin) queries.push(latin);
  if (displayName) queries.push(`${displayName} plant`);
  if (latin) queries.push(`${latin} plant`);

  // Dedup
  return [...new Set(queries.map(normalizeQuery).filter(Boolean))];
}

async function wikidataSearch(query, limit = 10) {
  const url = new URL("https://www.wikidata.org/w/api.php");
  url.searchParams.set("action", "wbsearchentities");
  url.searchParams.set("format", "json");
  url.searchParams.set("language", "en");
  url.searchParams.set("uselang", "en");
  url.searchParams.set("type", "item");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("search", query);

  const data = await fetchJson(url.toString());
  return (data?.search || []).map((x) => x.id).filter(Boolean);
}

async function wikidataGetAllP18Filenames(entityId) {
  const url = new URL("https://www.wikidata.org/w/api.php");
  url.searchParams.set("action", "wbgetentities");
  url.searchParams.set("format", "json");
  url.searchParams.set("props", "claims");
  url.searchParams.set("ids", entityId);

  const data = await fetchJson(url.toString());
  const ent = data?.entities?.[entityId];
  const p18Arr = ent?.claims?.P18 || [];
  const files = [];

  for (const claim of p18Arr) {
    const v = claim?.mainsnak?.datavalue?.value;
    if (typeof v === "string" && v.trim()) files.push(v.trim());
  }

  return [...new Set(files)];
}

async function commonsSearchImageUrls(query, limit = 8) {
  // MediaWiki API: search in File namespace (6) and fetch direct URL via imageinfo
  // https://www.mediawiki.org/wiki/API:Search  +  https://www.mediawiki.org/wiki/API:Imageinfo 
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("format", "json");
  api.searchParams.set("list", "search");
  api.searchParams.set("srnamespace", "6"); // File:
  api.searchParams.set("srlimit", String(limit));
  api.searchParams.set("srsearch", query);

  const data = await fetchJson(api.toString());
  const titles = (data?.query?.search || [])
    .map((x) => x.title)
    .filter((t) => typeof t === "string" && t.startsWith("File:"));

  const out = [];
  for (const title of titles) {
    const infoUrl = new URL("https://commons.wikimedia.org/w/api.php");
    infoUrl.searchParams.set("action", "query");
    infoUrl.searchParams.set("format", "json");
    infoUrl.searchParams.set("prop", "imageinfo");
    infoUrl.searchParams.set("iiprop", "url");
    infoUrl.searchParams.set("iiurlwidth", "800");
    infoUrl.searchParams.set("titles", title);

    const d2 = await fetchJson(infoUrl.toString());
    const pages = d2?.query?.pages || {};
    const page = Object.values(pages)[0];
    const img = page?.imageinfo?.[0];
    if (img?.thumburl) {
      out.push({ url: img.thumburl, page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(title)}` });
    } else if (img?.url) {
      out.push({ url: img.url, page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(title)}` });
    }

    await sleep(150);
  }

  // Dedup URLs
  const seen = new Set();
  return out.filter((x) => !seen.has(x.url) && seen.add(x.url));
}

// אופציונלי: אם תרצי להוסיף fallback של Perenual, תשלימי פה לפי ה־API שלך.
// לפי הדוקומנטציה שלהם יש endpoints לחיפוש "species-list" עם key + q. 
async function perenualSearchImageUrls(_query, _limit = 5) {
  return []; // כרגע כבוי כדי לא לנחש את ה־endpoint המדויק אצלך.
}

async function pickImageForPlant(plant, usedUrls) {
  const queries = buildQueries(plant);

  // 1) Wikidata P18 (multiple candidates + multiple images)
  for (const q of queries) {
    const ids = await wikidataSearch(q, 12);
    await sleep(200);

    for (const id of ids) {
      const files = await wikidataGetAllP18Filenames(id);
      await sleep(200);

      for (const filename of files) {
        const url = encFilePath(filename, 800);
        if (usedUrls.has(url)) continue;

        return {
          url,
          source: "Wikidata/Wikimedia Commons",
          page: commonsFilePage(filename),
          query: q,
        };
      }
    }
  }

  // 2) Commons direct search (File namespace)
  for (const q of queries) {
    const results = await commonsSearchImageUrls(q, 6);
    for (const r of results) {
      if (!r?.url || usedUrls.has(r.url)) continue;
      return {
        url: r.url,
        source: "Wikimedia Commons (search)",
        page: r.page,
        query: q,
      };
    }
    await sleep(250);
  }

  // 3) Optional: Perenual fallback
  for (const q of queries) {
    const results = await perenualSearchImageUrls(q, 5);
    for (const r of results) {
      if (!r?.url || usedUrls.has(r.url)) continue;
      return {
        url: r.url,
        source: "Perenual",
        page: r.page || null,
        query: q,
      };
    }
  }

  // 4) Hard fallback: unique placeholder (guarantees 100%)
  const { name } = getStrings(plant);
  return {
    url: svgPlaceholderDataUri(name || `Plant ${plant?.id ?? ""}`),
    source: "Generated placeholder (SVG)",
    page: null,
    query: null,
  };
}

function readJsonArray(p) {
  const txt = fs.readFileSync(p, "utf8");
  const data = JSON.parse(txt);
  if (!Array.isArray(data)) throw new Error("Input must be a JSON array");
  return data;
}

function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf8");
}

async function main() {
  const [inputPath, outputPath] = process.argv.slice(2);
  if (!inputPath || !outputPath) {
    console.error("Usage: node scripts/add-images-wikidata.js <input.json> <output.json>");
    process.exit(1);
  }

  const data = readJsonArray(inputPath);

  const usedUrls = new Set();
  for (const p of data) {
    const u = p?.image?.url;
    if (typeof u === "string" && u.length) usedUrls.add(u);
  }

  let updated = 0;
  let skipped = 0; // בפועל, עם placeholder לא אמור להישאר skipped בגלל "אין תמונה"
  const unresolved = [];

  for (let i = 0; i < data.length; i++) {
    const plant = data[i];
    const cur = plant?.image?.url;

    if (typeof cur === "string" && cur.length) continue;

    try {
      const img = await pickImageForPlant(plant, usedUrls);
      if (!img?.url) {
        unresolved.push({ index: i, id: plant.id ?? null, name: getStrings(plant) });
        skipped++;
        continue;
      }

      usedUrls.add(img.url);
      plant.image = img;
      updated++;

      if ((updated + skipped) % 10 === 0) {
        console.log(`Progress: updated=${updated}, skipped=${skipped}`);
      }
    } catch (e) {
      unresolved.push({
        index: i,
        id: plant.id ?? null,
        name: getStrings(plant),
        err: e?.message || String(e),
      });
      skipped++;
    }

    await sleep(350); // ריסון כדי לא לחטוף rate limit
  }

  writeJson(outputPath, data);
  console.log("DONE");
  console.log({ input: data.length, updated, skipped, unresolvedCount: unresolved.length });
  if (unresolved.length) console.log("Unresolved examples:", unresolved.slice(0, 20));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
