import { site } from "@/content/site";
import BadgeStage from "./badge/BadgeStage";
import Icon from "./Icon";
import Peeker from "./Peeker";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.top}>
        <div className={styles.lead}>
          <p className={styles.intro}>
            {site.hero.intro}{" "}
            <a href="#work" className={styles.more}>
              [more]
            </a>
          </p>
          <p className={styles.teaser}>
            {site.hero.teaser}{" "}
            <span role="img" aria-label="shh">
              🤫
            </span>
          </p>
        </div>
        <div className={styles.meta}>
          <p>
            {site.hero.meta.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </p>
          <span className={styles.socials}>
            <a
              href={site.linkedin}
              className={styles.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
              <Icon name="arrow-up-right" size={14} />
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
            <a
              href={site.x}
              className={styles.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              {site.xHandle}
              <Icon name="arrow-up-right" size={14} />
              <span className="visually-hidden">
                {" "}
                on X (opens in a new tab)
              </span>
            </a>
          </span>
        </div>
      </div>

      <h1 id="hero-title" className={styles.name}>
        <svg
          className={styles.nameWide}
          viewBox="0 0 1000 116"
          preserveAspectRatio="xMidYMax meet"
          aria-hidden
        >
          <text x="0" y="115" textLength="1000" lengthAdjust="spacing">
            {site.name.toUpperCase()}
          </text>
        </svg>
        <svg className={styles.nameStacked} viewBox="0 0 1000 646" aria-hidden>
          <text
            x="0"
            y="451"
            textLength="1000"
            lengthAdjust="spacing"
            fontSize="683"
          >
            FILIP
          </text>
          <text
            x="0"
            y="645"
            textLength="1000"
            lengthAdjust="spacing"
            fontSize="239"
          >
            STEFANOVSKI
          </text>
        </svg>
        <span className="visually-hidden">{site.name}</span>
      </h1>

      <Peeker />

      <div className={styles.stage}>
        <BadgeStage />
      </div>
    </section>
  );
}
