import Link from "next/link";
import { site } from "@/content/site";
import BadgeStage from "./badge/BadgeStage";
import { LinkedInLogo, XLogo } from "./Icon";
import PodcastWaitlist from "./PodcastWaitlist";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.top}>
        <div className={styles.lead}>
          <p className={styles.intro}>
            {site.hero.intro}{" "}
            <Link href="/about" className={styles.more}>
              [more]
            </Link>
          </p>
          <PodcastWaitlist />
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
              <LinkedInLogo size={15} />
              <span className="visually-hidden">LinkedIn (opens in a new tab)</span>
            </a>
            <a
              href={site.x}
              className={styles.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <XLogo size={15} />
              <span className="visually-hidden">
                {site.xHandle} on X (opens in a new tab)
              </span>
            </a>
          </span>
        </div>
      </div>

      <h1 id="hero-title" className={styles.name}>
        {/* Set in Macedonian Cyrillic. x and textLength offset each line's side bearings so the ink spans edge to edge */}
        <svg
          className={styles.nameWide}
          viewBox="0 0 1000 89"
          preserveAspectRatio="xMidYMax meet"
          aria-hidden
        >
          <text x="-0.22" y="83.5" textLength="1003.35" lengthAdjust="spacing">
            ФИЛИП СТЕФАНОВСКИ
          </text>
        </svg>
        <svg className={styles.nameStacked} viewBox="0 0 1000 438" aria-hidden>
          <text x="-0.7" y="258" textLength="1010.47" lengthAdjust="spacing" fontSize="348.8">
            ФИЛИП
          </text>
          <text x="-2.93" y="430" textLength="1007.76" lengthAdjust="spacing" fontSize="172.6">
            СТЕФАНОВСКИ
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
