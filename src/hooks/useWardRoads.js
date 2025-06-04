import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function useWardRoads(wardId, enabled = true) {
  const [roads, setRoads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!wardId || !enabled) return;
    setLoading(true);
    setError(null);
    supabase
      .from('major_roads_count')
      .select('*')
      .eq('ward_id', wardId)
      .then(({ data, error }) => {
        setRoads(data || []);
        setError(error ? error.message : null);
        setLoading(false);
      });
  }, [wardId, enabled]);

  return { roads, loading, error };
}