import { graveyard, projects, supporting } from "@/content/site";
import WorkIndex from "./WorkIndex";
import styles from "./Work.module.css";

export default function Work() {
  return (
    <section id="work" className={styles.stage} aria-labelledby="work-title">
      <h2 id="work-title" className="visually-hidden">
        Selected work
      </h2>

      <WorkIndex projects={projects} />

      <div className={`wrap ${styles.also}`}>
        <h3 className={`condensed ${styles.alsoTitle}`}>Side quests</h3>
        <ul className={styles.alsoList}>
          {supporting.map((w) => (
            <li key={w.title}>
              <span className={styles.alsoName}>{w.title}</span>
              <span className={styles.alsoRole}>{w.role}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`wrap ${styles.also} ${styles.grave}`}>
        <h3 className={`condensed ${styles.alsoTitle}`}>Graveyard</h3>
        <ul className={styles.alsoList}>
          {graveyard.projects.map((g) => (
            <li key={g.name}>
              <span className={styles.alsoName}>
                <s className={styles.dead}>{g.name}</s>
                <span className={styles.what}>{g.what}</span>
              </span>
              <span className={styles.alsoRole}>{g.year}</span>
            </li>
          ))}
          <li>
            <span className={styles.rest}>{graveyard.rest}</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
