import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import SiteHeader from "@/components/SiteHeader";
import Contact from "@/components/Contact";
import Icon from "@/components/Icon";
import styles from "./about.module.css";

const description = "How Filip Stefanovski went from basketball in Belgium to building products.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: `About ${site.name}`, description, url: "/about" },
};

export default function AboutPage() {
  const { story, beliefs } = site.about;
  return (
    <>
      <div className={styles.page}>
        <SiteHeader />
        <main id="main">
          <article>
            <header className={`wrap ${styles.head}`}>
              <Link href="/" className={styles.back}>
                <Icon name="arrow-left" size={14} />
                Home
              </Link>
            </header>

            <section className={`wrap ${styles.block}`} aria-labelledby="story-title">
              <h1 id="story-title" className={`condensed ${styles.blockTitle}`}>
                Story
              </h1>
              <div className={styles.story}>
                {story.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>

            <section className={`wrap ${styles.block}`} aria-labelledby="rules-title">
              <h2 id="rules-title" className={`condensed ${styles.blockTitle}`}>
                Rules
              </h2>
              <ul className={styles.list}>
                {beliefs.map((b) => (
                  <li key={b.title}>
                    <span className={styles.rule}>{b.title}</span>
                    <span className={styles.ruleBody}>{b.body}</span>
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </main>
      </div>
      <Contact />
    </>
  );
}
