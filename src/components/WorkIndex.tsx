import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/site";
import Icon from "./Icon";
import styles from "./Work.module.css";

/** One screen per project, in its own slot at the end of the row. */
const covers: Record<string, { src: string; w: number; h: number }> = {
  q4: { src: "/work/q4-demo.jpg", w: 1240, h: 640 },
  aminta: { src: "/work/aminta-hero.jpg", w: 2000, h: 1194 },
  "blockchain-skopje": { src: "/work/bks-site.jpg", w: 1600, h: 1000 },
};

export default function WorkIndex({ projects }: { projects: Project[] }) {
  return (
    <ul className={styles.list}>
      {projects.map((p) => {
        const c = covers[p.slug];
        return (
          <li key={p.slug} className={styles.row}>
            <Link href={`/work/${p.slug}`} className={`wrap ${styles.rowLink}`}>
              <span className={styles.idx}>{p.index}</span>
              <h3 className={`condensed ${styles.name}`}>{p.title}</h3>
              <div className={styles.meta}>
                <p className={styles.line}>{p.line}</p>
                <p className={styles.role}>{p.role}</p>
              </div>
              {c && (
                <span className={styles.thumb} aria-hidden>
                  <Image src={c.src} alt="" fill sizes="(max-width: 899px) 92vw, 280px" />
                </span>
              )}
              <span className={styles.go} aria-hidden>
                <Icon name="arrow-up-right" size={22} />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
