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
          <div className={styles.sHead}>
            <span>Designer &amp; Builder</span>
            <span>MK / BE</span>
          </div>
          <div className={styles.sFirst}>
            Filip<i />
          </div>
          <div className={styles.sLast}>Stefanovski</div>
          <div className={styles.sRole}>
            <em>Designer</em> <b>&amp;</b> <em>Builder</em>
          </div>
          <dl className={styles.sRows}>
            <div>
              <dt>From</dt>
              <dd>Macedonia</dd>
            </div>
            <div>
              <dt>Studied</dt>
              <dd>Belgium</dd>
            </div>
            <div>
              <dt>Works in</dt>
              <dd>Product, Frontend, AI</dd>
            </div>
            <div>
              <dt>Languages</dt>
              <dd>04</dd>
            </div>
          </dl>
          <div className={styles.sBand}>
            <span className={styles.sCode} />
            <span className={styles.sAll}>
              All
              <br />
              Access
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
