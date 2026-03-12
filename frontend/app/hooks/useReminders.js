import { useCallback, useEffect, useState } from "react";
import { getReminders } from "../services/api";

export function useReminders({ auto = true } = {}) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reloadReminders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReminders();
      setReminders(Array.isArray(data) ? data : []);
    } catch (e) {
      setReminders([]);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auto) reloadReminders();
  }, [auto, reloadReminders]);

  return { reminders, loading, error, reloadReminders };
}
