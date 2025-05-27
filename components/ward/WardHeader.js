import { useRouter } from 'next/navigation';
import styles from '../../styles/layout/header.module.css';
import buttonStyles from '../../styles/components/button.module.css';

export default function WardHeader() {
  const router = useRouter();
  
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <img src="/wp_icon_sm.png" alt="Ward" className={styles.logo} />
        <h1>Ward Dashboard</h1>
      </div>
      <button 
        className={buttonStyles.home} 
        onClick={() => router.push('/')}
      >
        Home
      </button>
    </div>
  );
}