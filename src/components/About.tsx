import { site } from "@/content/site";
import styles from "./About.module.css";

export default function About() {
  const { about } = site;
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={`wrap ${styles.grid}`}>
        <h2 id="about-title" className={`condensed ${styles.heading}`}>
          {about.heading}
        </h2>
        <p className={styles.line}>{about.line}</p>
        <dl className={styles.facts}>
          {about.facts.map((f) => (
            <div key={f.label} className={styles.fact}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
