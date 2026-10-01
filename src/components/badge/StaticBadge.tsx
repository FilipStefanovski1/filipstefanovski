import { CARD_COPY } from "./artwork";
import styles from "./badge.module.css";

/** Pill widths for the static card, approximating the canvas measurement. */
const pillWidth = (label: string) => Math.round(label.length * 17.5 + 44);

/** HTML version of the badge: loading state, reduced motion and no-WebGL fallback. Same grid as the canvas art. */
/** Pill positions, laid out once from the static card copy. */
const pills = CARD_COPY.currently.reduce<{ label: string; x: number; w: number }[]>((acc, p) => {
  const prev = acc[acc.length - 1];
  const x = prev ? prev.x + prev.w + 12 : 72;
  acc.push({ label: p.label, x, w: pillWidth(p.label) });
  return acc;
}, []);

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
            <defs>
              <linearGradient id="holo" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#d9c2ff" />
                <stop offset="0.25" stopColor="#9ff3ff" />
                <stop offset="0.5" stopColor="#fdf7a8" />
                <stop offset="0.75" stopColor="#ffc2e6" />
                <stop offset="1" stopColor="#b6c8ff" />
              </linearGradient>
              <pattern id="bars" width="26" height="150" patternUnits="userSpaceOnUse">
                <rect x="0" width="7" height="150" />
                <rect x="11" width="4" height="150" />
                <rect x="19" width="3" height="150" />
              </pattern>
            </defs>
            <text x="72" y="132" className={styles.sSmall} fontSize="40">
              {CARD_COPY.role.toUpperCase()}
            </text>
            <rect x="858" y="70" width="150" height="96" rx="14" fill="url(#holo)" />
            <rect x="72" y="200" width="936" height="4" />
            <text x="72" y="672" textLength="936" lengthAdjust="spacingAndGlyphs" fontSize="640" className={styles.sCond}>
              {CARD_COPY.first.toUpperCase()}
            </text>
            <text x="72" y="858" textLength="936" lengthAdjust="spacingAndGlyphs" fontSize="224" className={styles.sCond}>
              {CARD_COPY.last.toUpperCase()}
            </text>
            <rect x="72" y="908" width="936" height="2" />
            <text x="72" y="968" fontSize="34" className={styles.sSoft}>
              From
            </text>
            <text x="72" y="1034" fontSize="52" className={styles.sSmall}>
              {CARD_COPY.from}
            </text>
            <text x="72" y="1128" fontSize="34" className={styles.sSoft}>
              Currently
            </text>
            {pills.map((p) => (
              <g key={p.label}>
                <rect x={p.x} y="1158" width={p.w} height="66" rx="33" />
                <text x={p.x + 22} y="1201" fontSize="34" className={styles.sPillText}>
                  {p.label}
                </text>
              </g>
            ))}
            <rect x="72" y="1262" width="936" height="2" />
            {CARD_COPY.stats.map((s, i) => (
              <g key={s.label}>
                <text x={72 + i * 312} y="1312" fontSize="34" className={styles.sSoft}>
                  {s.label}
                </text>
                <text x={72 + i * 312} y="1400" fontSize="84" className={styles.sCond}>
                  {s.value}
                </text>
              </g>
            ))}
            <rect x="72" y="1430" width="936" height="2" />
            <rect x="72" y="1470" width="520" height="150" fill="url(#bars)" />
            <text x="1008" y="1550" fontSize="64" textAnchor="end" className={styles.sCond}>
              {CARD_COPY.id}
            </text>
            <text x="1008" y="1602" fontSize="30" textAnchor="end" className={styles.sSoft}>
              Valid while building
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
