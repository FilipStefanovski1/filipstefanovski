import Link from "next/link";
import { site } from "@/content/site";
import Icon, { XLogo } from "./Icon";
import styles from "./SiteHeader.module.css";

/** Header for inner pages, which sit on the dark stage. */
export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.inner}`}>
        <Link
          href="/"
          className={styles.brand}
          aria-label={`${site.name}, home`}
        >
          <span className={`condensed ${styles.name}`}>{site.name}</span>
          <span className={styles.role}>{site.role}</span>
        </Link>
        <nav aria-label="Primary">
          <ul className={styles.nav}>
            <li>
              <Link href="/#work">Work</Link>
            </li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
                className={styles.linkedin}
              >
                LinkedIn
                <Icon name="arrow-up-right" size={13} />
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a
                href={site.x}
                target="_blank"
                rel="noreferrer"
                className={styles.linkedin}
              >
                <XLogo size={13} />
                <span className="visually-hidden">X</span>
                <Icon name="arrow-up-right" size={13} />
                <span className="visually-hidden">
                  {" "}
                  {site.xHandle} (opens in a new tab)
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
