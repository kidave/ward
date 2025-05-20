import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

function Metrics() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data, error } = await supabase
        .from('landing_dashboard_metrics')
        .select('*');

      if (error) {
        console.error('Error fetching metrics:', error.message);
      } else {
        setMetrics(data);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="metrics">
      {metrics.map((m, i) => (
        <div className="metric-card" key={i}>
          <div className="icon">{m.icon}</div>
          <div className="number">{m.number}</div>
          <div className="label">{m.label}</div>
        </div>
      ))}
    </div>
  );
}

export default Metrics;
