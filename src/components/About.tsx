import { site } from "@/content/site";
import Reveal from "./Reveal";
import styles from "./About.module.css";

export default function About() {
  const { about } = site;
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={`wrap ${styles.grid}`}>
        <p className={`mono ${styles.label}`}>About</p>
        <Reveal className={styles.headWrap}>
          <h2 id="about-title" className={styles.heading}>
            {about.heading}
          </h2>
        </Reveal>
        <div className={styles.copy}>
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <p className={styles.disciplines}>
            {about.disciplines.map((d, i) => (
              <span key={d}>
                {d}
                {i < about.disciplines.length - 1 && <i aria-hidden> / </i>}
              </span>
            ))}
          </p>
        </div>
        <dl className={styles.facts}>
          {about.facts.map((f) => (
            <div key={f.label} className={styles.fact}>
              <dt className="mono">{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
