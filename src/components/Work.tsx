import Link from "next/link";
import { projects, supporting } from "@/content/site";
import ProjectFan from "./visuals/ProjectFan";
import styles from "./Work.module.css";

export default function Work() {
  return (
    <section id="work" className={styles.stage} aria-labelledby="work-title">
      <h2 id="work-title" className="visually-hidden">
        Selected work
      </h2>

      <ul className={styles.list}>
        {projects.map((p) => (
          <li key={p.slug} className={`${styles.row} fan-row`}>
            <Link href={`/work/${p.slug}`} className={`wrap ${styles.rowLink}`}>
              <div className={styles.text}>
                <h3 className={`condensed ${styles.name}`}>{p.title}</h3>
                <p className={styles.line}>{p.line}</p>
                <p className={styles.role}>{p.role}</p>
              </div>
              <div className={styles.fanWrap}>
                <ProjectFan slug={p.slug} />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className={`wrap ${styles.also}`}>
        <h3 className={`condensed ${styles.alsoTitle}`}>Also</h3>
        <ul className={styles.alsoList}>
          {supporting.map((w) => (
            <li key={w.title}>
              <span className={styles.alsoName}>{w.title}</span>
              <span className={styles.alsoRole}>{w.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
