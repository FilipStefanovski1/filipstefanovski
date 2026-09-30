import { site } from "@/content/site";
import BadgeStage from "./badge/BadgeStage";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.top}>
        <p className={styles.intro}>
          {site.hero.intro}{" "}
          <a href="#about" className={styles.more}>
            [more]
          </a>
        </p>
        <p className={styles.meta}>
          {site.hero.meta.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </p>
      </div>

      <h1 id="hero-title" className={styles.name}>
        <svg viewBox="0 0 1000 116" preserveAspectRatio="xMidYMax meet" aria-hidden>
          <text x="0" y="115" textLength="1000" lengthAdjust="spacing">
            {site.name.toUpperCase()}
          </text>
        </svg>
        <span className="visually-hidden">{site.name}</span>
      </h1>

      <div className={styles.stage}>
        <BadgeStage />
      </div>
    </section>
  );
}
