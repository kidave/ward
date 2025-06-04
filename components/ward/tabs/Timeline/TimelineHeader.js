import styles from '../../../../styles/layout/header.module.css';

export default function TimelineHeader({ wardName, convenor, coConvenor }) {
  return (
    <div className={styles.timelineHeader}>
      <div className={styles.wardInfo}>
        <h2>{wardName} Ward</h2>
        <div className={styles.leadership}>
          {convenor && <p>Convenor: {convenor}</p>}
          {coConvenor && <p>Co-Convenor: {coConvenor}</p>}
        </div>
      </div>
      <div className={styles.timelineTitle}>
        <h3>Timeline</h3>
        <p>Explore the journey of improvements in {wardName} Ward</p>
      </div>
    </div>
  );
}