import { useCallback, useEffect, useRef, useState } from "react";
import { searchPlants } from "../../../../services/api";

const PAGE_SIZE = 30;
const DEBOUNCE_MS = 250;

export function usePlantsSearch() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false); // first page / new search
  const [loadingMore, setLoadingMore] = useState(false); // next pages
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // prevents old responses overriding new search results
  const reqIdRef = useRef(0); //מזהה החיפוש העדכני

  const normalizeResponse = useCallback((data, fallbackOffset = 0) => {
    // Backward compatible: if backend returns an array (no pagination)
    if (Array.isArray(data)) {
      const nextOffset = data.length;
      return { items: data, nextOffset, hasMore: false };
    }

    const list = Array.isArray(data?.items) ? data.items : [];
    const nextOffset =
      typeof data?.nextOffset === "number" ? data.nextOffset : fallbackOffset + list.length;
    const more = typeof data?.hasMore === "boolean" ? data.hasMore : false;
    return { items: list, nextOffset, hasMore: more };
  }, []);

  const loadFirstPage = useCallback(async () => {
    const reqId = ++reqIdRef.current;

    setLoading(true);
    setLoadingMore(false);
    setOffset(0);
    setHasMore(true);

    try {
      const data = await searchPlants(q, { limit: PAGE_SIZE, offset: 0 });
      if (reqId !== reqIdRef.current) return;

      const norm = normalizeResponse(data, 0);
      setItems(norm.items);
      setOffset(norm.nextOffset);
      setHasMore(norm.hasMore);
    } catch (e) {
      if (reqId !== reqIdRef.current) return;
      setItems([]);
      setOffset(0);
      setHasMore(false);
      console.warn("loadFirstPage failed:", e?.message || e);
    } finally {
      if (reqId === reqIdRef.current) setLoading(false);
    }
  }, [q, normalizeResponse]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;

    const reqId = reqIdRef.current; // same search session
    setLoadingMore(true);

    try {
      const data = await searchPlants(q, { limit: PAGE_SIZE, offset });
      if (reqId !== reqIdRef.current) return;

      const norm = normalizeResponse(data, offset);

      // אם השרת החזיר array ואין pagination, לא נצבור כדי לא לשכפל
      if (Array.isArray(data)) {
        setLoadingMore(false);
        return;
      }

      setItems((prev) => [...prev, ...norm.items]);
      setOffset(norm.nextOffset);
      setHasMore(norm.hasMore);
    } catch (e) {
      if (reqId !== reqIdRef.current) return;
      console.warn("loadMore failed:", e?.message || e);
    } finally {
      if (reqId === reqIdRef.current) setLoadingMore(false);
    }
  }, [q, offset, hasMore, loading, loadingMore, normalizeResponse]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      loadFirstPage();
    }, DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [q, loadFirstPage]);

  return {
    q,
    setQ,
    items,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    reload: loadFirstPage,
    pageSize: PAGE_SIZE,
  };
}