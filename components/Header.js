import styles from '../styles/layout/header.module.css';

export default function Header({ title = "Ward Dashboard" }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <img src="/wp_icon_sm.png" alt="Logo" className={styles.logo} />
        <h1>{title}</h1>
      </div>
    </header>
  );
}