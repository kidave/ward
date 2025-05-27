import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import styles from '../styles/components/card.module.css';

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
    <div className={styles.metrics}>
      {metrics.map((m, i) => (
        <div className={styles.metricSmall} key={i}>
          <div className={styles.number}>{m.number}</div>
          <div className={styles.label}>{m.label}</div>
        </div>
      ))}
    </div>
  );
}

export default Metrics;
