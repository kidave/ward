import styles from '../../../../styles/layout/container.module.css';

function formatOperationPoints(operation) {
  if (!operation) return [];
  return operation.split(/\d+\.|\n/).filter(point => point.trim()).map(point => point.trim());
}

export default function UpdateDetails({ item }) {
  return (
    <div className={styles.updateDetails}>
      {item.operation && (
        <div className={styles.operationSection}>
          <h5 className={styles.sectionTitle}>Key Operations</h5>
          <ul className={styles.discussionList}>
            {formatOperationPoints(item.operation).map((op, i) => (
              <li key={i} className={styles.discussionPoint}>
                <span className={styles.bullet}>•</span>
                {op}
              </li>
            ))}
          </ul>
        </div>
      )}
      {item.description && (
        <div className={styles.descriptionSection}>
          <h5 className={styles.sectionTitle}>Description</h5>
          <ul className={styles.discussionList}>
            {formatOperationPoints(item.description).map((desc, i) => (
              <li key={i} className={styles.discussionPoint}>
                <span className={styles.bullet}>•</span>
                {desc}
              </li>
            ))}
          </ul>
        </div>
      )}
      {item.support && (
        <div className={styles.supportSection}>
          <h5 className={styles.sectionTitle}>Support Needed</h5>
          <ul className={styles.discussionList}>
            {formatOperationPoints(item.support).map((sup, i) => (
              <li key={i} className={styles.discussionPoint}>
                <span className={styles.bullet}>•</span>
                {sup}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}