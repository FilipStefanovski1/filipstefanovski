import { site } from "@/content/site";
import { LinkedInLogo, XLogo } from "./Icon";
import LocalTime from "./LocalTime";
import styles from "./Contact.module.css";

export default function Contact() {
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
            <LinkedInLogo size={18} />
            LinkedIn
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
          <a
            href={site.x}
            className={styles.action}
            target="_blank"
            rel="noreferrer"
          >
            <XLogo size={22} />
            <span className="visually-hidden">{site.xHandle} on X (opens in a new tab)</span>
          </a>
        </div>
        <div className={styles.base}>
          <span>
            {site.name}, {site.role}
          </span>
          <LocalTime />
        </div>
      </div>
    </footer>
  );
}
