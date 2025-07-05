import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { initialFetch = true, dependencies = [] } = options;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(url);
      setData(response.data);
      setError(null);
    } catch (error) {
      setError(error.response?.data || { message: error.message });
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (initialFetch) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};
