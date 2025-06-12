import styles from '../../../../styles/layout/timeline.module.css';
import { FaMapMarkerAlt, FaUserFriends, FaStar } from 'react-icons/fa';

export default function MeetingDetails({ item }) {
  return (
    <div className={styles.meetingDetails}>
      {item.location && (
        <div className={styles.detailItem}>
          <span className={styles.detailIcon}><FaMapMarkerAlt color="#e53935"/></span>
          <span className={styles.detailText}><strong>Location: </strong>{item.location}</span>
        </div>
      )}
      {item.attendees && (
        <div className={styles.detailItem}>
          <span className={styles.detailIcon}><FaUserFriends color="#333"/></span>
          <span className={styles.detailText}><strong>Key Attendees: </strong>{item.attendees}</span>
        </div>
      )}
      {item.mood && (
        <div className={styles.detailItem}>
          <span className={styles.detailIcon}><FaStar /></span>
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