import { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import api from '../services/api';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get<T>(url);

        if (!ignore) {
          setData(res.data);
        }
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;

        if (!ignore) {
          setError(axiosError.response?.data?.message ?? 'Une erreur est survenue.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [url, reloadIndex]);

  function reload() {
    setReloadIndex((i) => i + 1);
  }

  return { data, loading, error, reload };
}