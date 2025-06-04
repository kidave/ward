import styles from '../../../../styles/layout/container.module.css';

export default function MeetingDetails({ item }) {
  return (
    <div className={styles.meetingDetails}>
      {item.location && (
        <div className={styles.detailItem}>
          <span className={styles.detailIcon}>📍</span>
          <span className={styles.detailText}><strong>Location: </strong>{item.location}</span>
        </div>
      )}
      {item.attendees && (
        <div className={styles.detailItem}>
          <span className={styles.detailIcon}>👥</span>
          <span className={styles.detailText}><strong>Key Attendees: </strong>{item.attendees}</span>
        </div>
      )}
      {item.mood && (
        <div className={styles.detailItem}>
          <span className={styles.detailIcon}>⭐</span>
          <span className={styles.detailText}><strong>Mood: </strong>{item.mood}/10</span>
        </div>
      )}
      {item.discussion?.length > 0 && (
        <div className={styles.discussionSection}>
          <h5 className={styles.sectionTitle}>Discussion Points</h5>
          <ul className={styles.discussionList}>
            {item.discussion.map((pt, i) => (
              <li key={i} className={styles.discussionPoint}>
                <span className={styles.bullet}>•</span>
                {pt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}