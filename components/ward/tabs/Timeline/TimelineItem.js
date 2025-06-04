import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MeetingDetails from './MeetingDetails';
import UpdateDetails from './UpdateDetails';
import styles from '../../../../styles/layout/container.module.css';

function getIcon(item) {
  if (item.icon) return item.icon;
  return item.type === 'meeting' ? '👥' : '📝';
}

function formatDate(date, type) {
  if (!(date instanceof Date)) date = new Date(date);
  if (type === 'meeting') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
}

export default function TimelineItem({ item, isLast }) {
  const [active, setActive] = useState(false);

  return (
    <div className={styles.snakeTimelineItem}>
      <div className={styles.timelineConnector}>
        {!isLast && <div className={styles.connectorLine} />}
        <div
          className={`${styles.timelineIcon} ${active ? styles.activeIcon : ''}`}
          onClick={() => setActive(!active)}
          aria-label={active ? 'Collapse details' : 'Expand details'}
        >
          {getIcon(item)}
        </div>
      </div>

      <div
        className={styles.timelineDate}
        onClick={() => setActive(!active)}
        style={{ cursor: 'pointer' }}
      >
        {formatDate(item.date, item.type)}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className={`${styles.timelineCard} ${item.type === 'meeting' ? styles.meetingCard : styles.updateCard}`}
          >
            <div className={styles.cardHeader}>
              <h4 className={styles.timelineCardTitle}>{item.title}</h4>
              <span className={styles.cardTypeBadge}>
                {item.type === 'meeting' ? 'Meeting' : 'Update'}
              </span>
            </div>
            {item.type === 'meeting' ? (
              <MeetingDetails item={item} />
            ) : (
              <UpdateDetails item={item} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}