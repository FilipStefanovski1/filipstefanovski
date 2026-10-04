import { site } from "@/content/site";
import { LinkedInLogo, XLogo } from "./Icon";
import LocalTime from "./LocalTime";
import LastShipped from "./LastShipped";
import LiveVisitors from "./LiveVisitors";
import { lastPushedAt } from "@/lib/github";
import styles from "./Contact.module.css";

export default async function Contact() {
  const pushedAt = await lastPushedAt(site.github);
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
            <LinkedInLogo size={22} />
            <span className="visually-hidden">LinkedIn (opens in a new tab)</span>
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
          <span className={styles.live}>
            {pushedAt && <LastShipped at={pushedAt} />}
            <LiveVisitors />
          </span>
        </div>
      </div>
    </footer>
  );
}
