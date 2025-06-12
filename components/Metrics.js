import { useEffect, useState, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';
import styles from '../styles/components/card.module.css';
import { FaChartBar } from 'react-icons/fa';

function Metrics() {
  const [metrics, setMetrics] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const popupTimeout = useRef();

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data, error } = await supabase
        .from('landing_dashboard_metrics')
        .select('*');
      if (!error) setMetrics(data);
    };
    fetchMetrics();
  }, []);

  // Handlers for hover logic
  const handleMouseEnter = () => {
    clearTimeout(popupTimeout.current);
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    popupTimeout.current = setTimeout(() => setShowPopup(false), 120);
  };

  return (
    <>
      <div
        className={styles.metricsHeader}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        tabIndex={0}
        style={{ cursor: 'pointer' }}
      >
        <FaChartBar className={styles.metricsIcon} />
      </div>
      {showPopup && (
        <div
          className={styles.metricsOverlay}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setShowPopup(false)}
        >
          <div
            className={styles.metricsPopup}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.metricsHeaderPopup}>
              <FaChartBar className={styles.metricsIcon} />
              <span>Project Metrics</span>
            </div>
            <div className={styles.metricsList}>
              {metrics.map((m, i) => (
                <div className={styles.metricSmall} key={i}>
                  <div className={styles.number}>{m.number}</div>
                  <div className={styles.label}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Metrics;