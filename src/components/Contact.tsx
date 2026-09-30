import { site } from "@/content/site";
import Icon from "./Icon";
import styles from "./Contact.module.css";

export default function Contact() {
  const year = new Date().getFullYear();
  return (
    <footer
      id="contact"
      className={styles.finale}
      aria-labelledby="contact-title"
      data-surface="neon"
    >
      <div className={`wrap ${styles.inner}`}>
        <h2 id="contact-title" className={`condensed ${styles.title}`}>
          {site.close.heading}
        </h2>
        <div className={styles.actions}>
          <a
            href={site.linkedin}
            className={styles.action}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
            <Icon name="arrow-up-right" size={18} />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
          <a
            href={site.x}
            className={styles.action}
            target="_blank"
            rel="noreferrer"
          >
            {site.xHandle}
            <Icon name="arrow-up-right" size={18} />
            <span className="visually-hidden"> on X (opens in a new tab)</span>
          </a>
        </div>
        <div className={styles.base}>
          <span>
            {site.name}, {site.role}
          </span>
          <span>Macedonia / Belgium, {year}</span>
          <a href="#main" className={styles.top}>
            Back to top
            <Icon name="arrow-down" size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
