import Link from "next/link";
import { projects, supporting } from "@/content/site";
import ProjectVisual from "./visuals/ProjectVisual";
import Reveal from "./Reveal";
import styles from "./Work.module.css";

export default function Work() {
  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <div className="wrap">
        <header className={styles.head}>
          <h2 id="work-title" className={styles.title}>
            Selected work
          </h2>
          <p className={styles.note}>
            Products and websites I have worked on, from AI research tools to member portals.
          </p>
          <span className={`mono ${styles.count}`}>{String(projects.length).padStart(2, "0")} projects</span>
        </header>

        <ol className={styles.list}>
          {projects.map((p, i) => (
            <li key={p.slug} className={`${styles.row} row-hover`} data-flip={i % 2 === 1 ? "true" : "false"}>
              <Reveal className={styles.visualWrap}>
                <Link href={`/work/${p.slug}`} className={styles.visualLink} tabIndex={-1} aria-hidden>
                  <ProjectVisual slug={p.slug} />
                </Link>
              </Reveal>
              <div className={styles.meta}>
                <span className={styles.index} aria-hidden>
                  {p.index}
                </span>
                <p className={`mono ${styles.kind}`}>{p.kind}</p>
                <h3 className={styles.name}>
                  <Link href={`/work/${p.slug}`} className={styles.nameLink}>
                    {p.title}
                  </Link>
                </h3>
                <p className={styles.summary}>{p.summary}</p>
                <p className={`mono ${styles.role}`}>
                  <span>Role</span> {p.role}
                </p>
                <Link href={`/work/${p.slug}`} className={styles.cta} aria-label={`Read the ${p.title} case study`}>
                  Case study
                  <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden>
                    <path d="M0 5h12.5M8.5 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </Link>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.also}>
          <h3 className={`mono ${styles.alsoTitle}`}>Also</h3>
          <ul className={styles.alsoList}>
            {supporting.map((w) => (
              <li key={w.title} className={styles.alsoItem}>
                <span className={styles.alsoName}>{w.title}</span>
                <span className={`mono ${styles.alsoRole}`}>{w.role}</span>
                <span className={styles.alsoBody}>{w.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
