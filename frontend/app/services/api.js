import { getToken, deleteToken } from "./token";
const BASE_URL = "http://10.100.102.243:5000"; 

async function fetchJson(path, { method = "GET", headers = {}, body } = {}) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (res.status === 401) {
    await deleteToken();
    // “סימון” אחיד לקליינט שצריך לנווט ל-login
    const msg = data?.message || "Unauthorized";
    const err = new Error(msg);
    err.code = "UNAUTHORIZED";
    throw err;
  }

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  }
  return data;
}


export async function signup({ username, email, password }) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
}

export async function login({ username, password }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function getMe(token) {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function searchPlants(q, { limit = 30, offset = 0 } = {}) {
  const url = `${BASE_URL}/plants/search?q=${encodeURIComponent(q || "")}&limit=${limit}&offset=${offset}`;
  const res = await fetch(url);
  return res.json(); // { items, total, limit, offset, nextOffset, hasMore }
}


export async function getPlantById(id) {
  const res = await fetch(`${BASE_URL}/plants/${id}`);
  return res.json();
}


async function withAuthHeaders(extra = {}) {
  const token = await getToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getMyGarden() {
  const headers = await withAuthHeaders();
  const res = await fetch(`${BASE_URL}/plants/my-garden`, { headers });
  return res.json();
}

export async function addPlantToGarden(plantId) {
  const headers = await withAuthHeaders({ "Content-Type": "application/json" });
  const res = await fetch(`${BASE_URL}/plants/${plantId}/add-to-garden`, {
    method: "POST",
    headers,
  });
  if (!res.ok) throw new Error((await res.json()).message ?? "Request failed");
  return res.json();
}

export async function removePlantFromGarden(plantId) {
  const headers = await withAuthHeaders({ "Content-Type": "application/json" });
  const res = await fetch(`${BASE_URL}/plants/${plantId}/remove-from-garden`, {
    method: "POST",
    headers,
  });
  return res.json();
}

export function getFeed(limit = 20) {
  return fetchJson(`/posts/feed?limit=${limit}`);
}

export function createPost({ text, imageUrl }) {
  return fetchJson(`/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, imageUrl }),
  });
}

export function toggleLike(postId) {
  return fetchJson(`/posts/${postId}/like`, { method: "POST" });
}


export async function uploadImage(localUri) {
  const headers = await withAuthHeaders(); // לא לשים Content-Type כאן!

  // ניחוש שם+סיומת
  const name = localUri.split("/").pop() || `photo-${Date.now()}.jpg`;
  const ext = (name.split(".").pop() || "jpg").toLowerCase();
  const type =
    ext === "png" ? "image/png" :
    ext === "webp" ? "image/webp" :
    "image/jpeg";

  const form = new FormData();
  form.append("image", { uri: localUri, name, type });

  const res = await fetch(`${BASE_URL}/uploads`, {
    method: "POST",
    headers, // חשוב: לא להגדיר כאן Content-Type ידנית, fetch יעשה boundary לבד
    body: form,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || data?.error || "Upload failed");
  return data; // { ok: true, imageUrl }
}

export async function getReminders() {
  const headers = await withAuthHeaders();
  const res = await fetch(`${BASE_URL}/reminders`, { headers });
  return res.json();
}

export async function updateLastWatered(plantId, date) {
  const headers = await withAuthHeaders({ "Content-Type": "application/json" });

  const res = await fetch(`${BASE_URL}/reminders/${plantId}/watered`, {
    method: "POST",
    headers,
    body: JSON.stringify({ date: date.toISOString() }),
  });

  if (!res.ok) {
    let msg = "Request failed";
    try {
      const j = await res.json();
      msg = j?.message || j?.error || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}





