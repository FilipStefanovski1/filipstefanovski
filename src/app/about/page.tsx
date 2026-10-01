import type { Metadata } from "next";
import { site } from "@/content/site";
import SiteHeader from "@/components/SiteHeader";
import Contact from "@/components/Contact";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: site.about.intro,
  alternates: { canonical: "/about" },
  openGraph: { title: `About ${site.name}`, description: site.about.intro, url: "/about" },
};

export default function AboutPage() {
  const { intro, basedOutOf, story, beliefs } = site.about;
  return (
    <>
      <div className={styles.page}>
        <SiteHeader />
        <main id="main">
          <article className="wrap">
            <header className={styles.head}>
              <h1 className={`condensed ${styles.title}`}>About</h1>
              <p className={styles.intro}>{intro}</p>
              <dl className={styles.based}>
                <dt>Based out of</dt>
                <dd>{basedOutOf}</dd>
              </dl>
            </header>

            <div className={styles.story}>
              {story.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <section className={styles.beliefs} aria-labelledby="beliefs-title">
              <h2 id="beliefs-title" className={styles.beliefsTitle}>
                Some things I believe
              </h2>
              <ol className={styles.list}>
                {beliefs.map((b) => (
                  <li key={b.title}>
                    <strong className="condensed">{b.title}</strong>
                    <span>{b.body}</span>
                  </li>
                ))}
              </ol>
            </section>
          </article>
        </main>
      </div>
      <Contact />
    </>
  );
}
