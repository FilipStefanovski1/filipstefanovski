import Link from "next/link";
import { site } from "@/content/site";
import styles from "./SiteHeader.module.css";

export default function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  return (
    <header className={`${styles.header} ${overlay ? styles.overlay : ""}`}>
      <div className={`wrap ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label={`${site.name}, home`}>
          <span className={styles.mark} aria-hidden>
            FS
          </span>
          <span className={styles.name}>{site.name}</span>
        </Link>
        <nav aria-label="Primary">
          <ul className={styles.nav}>
            <li>
              <Link href="/#work">Work</Link>
            </li>
            <li>
              <Link href="/#about">About</Link>
            </li>
            <li>
              <Link href="/#contact">Contact</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
