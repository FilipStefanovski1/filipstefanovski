import { site } from "@/content/site";
import styles from "./Contact.module.css";

export default function Contact() {
  const { email, links } = site.contact;
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className={styles.footer} aria-labelledby="contact-title">
      <div className={`wrap ${styles.inner}`}>
        <p className={`mono ${styles.label}`}>Contact</p>
        <h2 id="contact-title" className={styles.title}>
          Got a product
          <br />
          that needs <em>both</em>
          <br />
          halves?
        </h2>
        <p className={styles.lede}>Design and build, handled by the same person. Tell me what you are working on.</p>
        {(email || links.length > 0) && (
          <ul className={styles.links}>
            {email && (
              <li>
                <a href={`mailto:${email}`} className={styles.email}>
                  {email}
                </a>
              </li>
            )}
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={styles.link} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
        <div className={styles.base}>
          <span className="mono">
            {site.name}, {year}
          </span>
          <span className="mono">Macedonia / Belgium</span>
          <a href="#main" className={`mono ${styles.top}`}>
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
