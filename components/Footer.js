import styles from "../styles/layout/footer.module.css";
import { FaFacebook, FaYoutube, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaBluesky, FaXTwitter } from "react-icons/fa6";


export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.socialIcons}>
        <a
          href="https://x.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
          className="xtwitter"
        >
          <FaXTwitter/>
        </a>
        <a
          href="https://facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="facebook"
        >
          <FaFacebook />
        </a>
        <a 
            href="https://youtube.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Youtube"
            className="youtube"
        >
          <FaYoutube />
        </a>
        <a
          href="https://linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="linkedin"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="instagram"
        >
          <FaInstagram />
        </a>
        <a href="https://bluesky.com/" target="_blank" rel="noopener noreferrer" aria-label="BlueSky" className="bluesky">
          <FaBluesky />
        </a>
      </div>
      <div className={styles.copyright}>
        Mumbai Sustainability Centre © 2024
      </div>
    </footer>
  );
}