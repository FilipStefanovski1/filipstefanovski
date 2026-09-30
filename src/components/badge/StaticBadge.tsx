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
          <div className={styles.sFirst}>{CARD_COPY.first}</div>
          <div className={styles.sLast}>{CARD_COPY.last}</div>
          <div className={styles.sFoot}>
            <em>From</em>
            <span className={styles.sFrom}>{CARD_COPY.from}</span>
            <em>Previously</em>
            <span className={styles.sPills}>
              {CARD_COPY.previously.map((p) => (
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
