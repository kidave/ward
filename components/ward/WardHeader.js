import styles from '../../styles/layout/header.module.css';

export default function WardHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <img src="/wp_icon_sm.png" alt="Ward" className={styles.logo} />
        <h1>Ward Dashboard</h1>
      </div>
    </header>
  );
}