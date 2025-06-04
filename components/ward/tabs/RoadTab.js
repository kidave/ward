import buttonStyles from '../../../styles/components/button.module.css';
import cardStyles from '../../../styles/components/card.module.css';
import styles from '../../../styles/components/roadtab.module.css'; // Create this file

export default function RoadTab({ roads, onRoadClick }) {
  // Group roads by fclass
  const grouped = roads.reduce((acc, road) => {
    if (!acc[road.fclass]) acc[road.fclass] = [];
    acc[road.fclass].push(road);
    return acc;
  }, {});

  return (
    <div className={buttonStyles.list}>
      {Object.keys(grouped).length === 0 ? (
        <p className={styles.empty}>No roads found.</p>
      ) : (
        Object.entries(grouped).map(([fclass, roadsInClass]) => (
          <div key={fclass} className={cardStyles.metricSmall + ' ' + styles.fclassGroup}>
            <div className={styles.fclassHeader}>
              <span className={styles.fclassBullet} />
              <h3 className={styles.fclassTitle}>{fclass}</h3>
            </div>
            <ul className={styles.roadList}>
              {roadsInClass.map((road) => (
                <li key={road.name} className={styles.roadListItem}>
                  <button
                    className={buttonStyles.wide + ' ' + styles.roadButton}
                    onClick={() => onRoadClick(road)}
                  >
                    <span className={styles.roadName}>{road.name}</span>
                    <span className={styles.roadSegments}>
                      {road.road_segments_count} segments
                      {road.length ? ` • ${road.length.toFixed(2)} km` : ''}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}