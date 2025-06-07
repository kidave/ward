import buttonStyles from '../../../styles/components/button.module.css';
import styles from '../../../styles/components/roadtab.module.css';

export default function RoadTab({ roads, onRoadClick }) {
  // Group by layer_name, then by fclass
  const grouped = roads.reduce((acc, road) => {
    const layer = road.layer_name || 'Other';
    const fclass = road.fclass || 'Other';
    if (!acc[layer]) acc[layer] = {};
    if (!acc[layer][fclass]) acc[layer][fclass] = [];
    acc[layer][fclass].push(road);
    return acc;
  }, {});

  return (
    <div className={styles.roadTabContainer}>
      {Object.keys(grouped).length === 0 ? (
        <p className={styles.empty}>No roads found.</p>
      ) : (
        Object.entries(grouped).map(([layer_name, fclassGroups]) => (
          <div key={layer_name} className={styles.layerGroup}>
            <div className={styles.layerHeader}>
              <span className={styles.layerBullet} />
              <h3 className={styles.layerTitle}>{layer_name.replace(/_/g, ' ')}</h3>
            </div>
            <div className={styles.fclassGrid}>
              {Object.entries(fclassGroups).map(([fclass, roadsInFclass]) => (
                <div key={fclass} className={styles.fclassColumn}>
                  <div className={styles.fclassHeader}>
                    <span className={styles.fclassTitle}>{fclass.replace(/_/g, ' ')}</span>
                  </div>
                  <ul className={styles.roadListScroll}>
                    {roadsInFclass.map((road) => (
                      <li key={road.name} className={styles.roadListItem}>
                        <button
                          className={buttonStyles.wide + ' ' + styles.roadButton}
                          onClick={() => onRoadClick(road)}
                        >
                          <span className={styles.roadName}>{road.name}</span>
                          <span className={styles.roadSegments}>
                            {road.segments_count} segments
                            {road.total_length_kilometers ? ` • ${road.total_length_kilometers.toFixed(2)} km` : ''}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}