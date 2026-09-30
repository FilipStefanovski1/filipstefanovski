import Link from "next/link";
import { projects, supporting } from "@/content/site";
import ProjectVisual from "./visuals/ProjectVisual";
import LightUp from "./LightUp";
import Icon from "./Icon";
import StageCounter from "./StageCounter";
import styles from "./Work.module.css";

export default function Work() {
  return (
    <section id="work" className={styles.stage} aria-labelledby="work-title">
      <h2 id="work-title" className="visually-hidden">
        Selected work
      </h2>
      <StageCounter titles={projects.map((p) => p.title)} />

      <ol className={styles.segments}>
        {projects.map((p, i) => (
          <li key={p.slug} className={styles.segment} data-segment={i}>
            <article aria-labelledby={`seg-${p.slug}`}>
              <div className={`wrap ${styles.segHead}`}>
                <h3 id={`seg-${p.slug}`} className={`condensed ${styles.name}`}>
                  {p.title}
                </h3>
                <p className={styles.line}>{p.line}</p>
              </div>

              <LightUp className={styles.spot}>
                <Link href={`/work/${p.slug}`} className={`${styles.visual} row-hover`} tabIndex={-1} aria-hidden>
                  <ProjectVisual slug={p.slug} />
                </Link>
              </LightUp>

              <div className={`wrap ${styles.segFoot}`}>
                <ul className={styles.built} aria-label="What I built">
                  {p.built.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className={styles.actions}>
                  <p className={styles.role}>{p.role}</p>
                  <Link href={`/work/${p.slug}`} className={styles.cta}>
                    How it was built
                    <Icon name="arrow-right" />
                    <span className="visually-hidden">: {p.title}</span>
                  </Link>
                  {p.url && (
                    <a href={p.url} className={styles.ext} target="_blank" rel="noreferrer">
                      {p.url.replace(/^https?:\/\//, "")}
                      <Icon name="arrow-up-right" size={14} />
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>

      <div className={`wrap ${styles.also}`}>
        <h3 className={`condensed ${styles.alsoTitle}`}>Also</h3>
        <ul className={styles.alsoList}>
          {supporting.map((w) => (
            <li key={w.title}>
              <span className={styles.alsoName}>{w.title}</span>
              <span className={styles.alsoRole}>{w.role}</span>
              <span className={styles.alsoBody}>{w.body}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
