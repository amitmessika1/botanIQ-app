// scripts/transform-kaggle-custom.js
const fs = require("fs");

function cleanStr(x) {
  return typeof x === "string" ? x.trim() : "";
}

function commonAt(p, idx) {
  const arr = Array.isArray(p.common) ? p.common.map(cleanStr).filter(Boolean) : [];
  return arr[idx] || "";
}

function join2(a, b) {
  return [cleanStr(a), cleanStr(b)].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

async function readJsonInput(input) {
  // URL
  if (/^https?:\/\//i.test(input)) {
    const res = await fetch(input);
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Fetch failed: ${res.status} ${res.statusText}\n${txt.slice(0, 200)}`);
    }
    return await res.json();
  }

  // local file
  const raw = fs.readFileSync(input, "utf8");
  return JSON.parse(raw);
}

function requireCommonIndex(p, idx, label) {
  const v = commonAt(p, idx);
  if (!v) {
    throw new Error(
      `Record id=${p.id}: missing common[${idx}] required for ${label}. common=${JSON.stringify(p.common)}`
    );
  }
  return v;
}

async function main() {
  const input = process.argv[2];
  const outPath = process.argv[3] || "house_plants.transformed.json";

  if (!input) {
    console.error('Usage: node scripts/transform-kaggle-custom.js "<URL_or_path>" [output.json]');
    process.exit(1);
  }

  const data = await readJsonInput(input);
  if (!Array.isArray(data)) {
    throw new Error("Expected JSON array");
  }

  // 1) remove id=62
  const filtered = data.filter((p) => p?.id !== 62);

  const transformed = filtered.map((p) => {
    // 2) remove category & use
    const { category, use, ...rest } = p;

    const latin = cleanStr(p.latin);
    const c0 = commonAt(p, 0);
    const c1 = commonAt(p, 1);

    // 3) defaults
    let name = join2(latin, c1 || c0);
    let displayName = cleanStr(c1 || c0);

    // 4) overrides
    if (p.id === 183 || p.id === 194) {
      const c3 = requireCommonIndex(p, 3, "override for 183/194");
      name = join2(latin, c3);
      displayName = join2(latin, c3); // לפי הדרישה שלך
    }

    if (p.id === 205) {
      const c2 = requireCommonIndex(p, 2, "override for 205");
      name = join2(latin, c2);
      displayName = join2(latin, c2); // לפי הדרישה שלך
    }

    return {
      ...rest,
      name,
      displayName,
    };
  });

  fs.writeFileSync(outPath, JSON.stringify(transformed, null, 2), "utf8");
  console.log(`DONE: input=${data.length}, after_remove_62=${filtered.length}, output=${transformed.length}`);
  console.log(`Wrote: ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
