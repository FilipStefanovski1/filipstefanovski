import { CARD_COPY } from "./artwork";
import styles from "./badge.module.css";

/** HTML version of the badge: loading state, reduced motion and no-WebGL fallback. */
export default function StaticBadge() {
  return (
    <div className={styles.static}>
      <div className={`${styles.sStrap} ${styles.sStrapL}`} />
      <div className={`${styles.sStrap} ${styles.sStrapR}`} />
      <div className={styles.sClip} />
      <div className={styles.sSleeve}>
        <span className={styles.sSlot} />
        <div className={styles.sCard}>
          <svg className={styles.sName} viewBox="0 0 1080 1720" aria-hidden>
            <text x="72" y="526" textLength="936" lengthAdjust="spacingAndGlyphs" fontSize="640">
              {CARD_COPY.first.toUpperCase()}
            </text>
            <text x="72" y="716" textLength="936" lengthAdjust="spacingAndGlyphs" fontSize="224" className={styles.sNameLast}>
              {CARD_COPY.last.toUpperCase()}
            </text>
          </svg>
          <div className={styles.sFoot}>
            <em>From</em>
            <span className={styles.sFrom}>{CARD_COPY.from}</span>
            <em>Currently</em>
            <span className={styles.sPills}>
              {CARD_COPY.currently.map((p) => (
                <i key={p.label} data-style={p.style}>
                  {p.label}
                </i>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
