import { useState, useCallback } from "react";

/**
 * useApi - hook reutilizable para llamadas al API.
 * Maneja loading, error y data automáticamente.
 * 
 * Uso:
 *   const { data, loading, error, execute } = useApi(clientsApi.getAll);
 *   useEffect(() => { execute(); }, []);
 */
export function useApi(apiFunc) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return { data, loading, error, execute, setData };
}
