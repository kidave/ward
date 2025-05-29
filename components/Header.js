import styles from '../styles/layout/header.module.css';
import { useRouter } from 'next/router';

export default function Header({ title = "Ward Dashboard" }) {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button 
          className={styles.logoButton} 
          onClick={() => router.push('https://www.walkingproject.org/')} // Adjust the route as needed
        >
          <img src="/wp_icon_sm.png" alt="Logo" className={styles.logo} />
        </button>
        <h1>{title}</h1>
      </div>
      <div className={styles.headerRight}>
        <button 
          className={styles.home} 
          onClick={() => router.push('https://www.walkingproject.org/')}
        >
          Home
        </button>
      </div>
    </header>
  );
}