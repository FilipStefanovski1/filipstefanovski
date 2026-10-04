import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/site";
import SiteHeader from "@/components/SiteHeader";
import Contact from "@/components/Contact";
import LightUp from "@/components/LightUp";
import Icon from "@/components/Icon";
import ProjectVisual from "@/components/visuals/ProjectVisual";
import { Illustration } from "@/components/visuals/Illustrations";
import Clip from "@/components/Clip";
import ViewCount from "@/components/ViewCount";
import styles from "./case.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.title}, ${p.kind}`, description: p.summary, url: `/work/${p.slug}` },
  };
}

const narrowIds = new Set(["internal-overview"]);

export default async function CasePage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];
  const cs = p.caseStudy;

  return (
    <>
      <div className={styles.page}>
        <SiteHeader />
        <main id="main">
          <article>
            <header className={`wrap ${styles.head}`}>
              <Link href="/#work" className={styles.back}>
                <Icon name="arrow-left" size={14} />
                All work
              </Link>
              <h1 className={`condensed ${styles.title}`}>{p.title}</h1>
              <p className={styles.lede}>{cs.lede}</p>
              <dl className={styles.spec}>
                <div>
                  <dt>My role</dt>
                  <dd>{p.role}</dd>
                </div>
                <div>
                  <dt>Areas</dt>
                  <dd>{p.tags.join(", ")}</dd>
                </div>
                <ViewCount slug={p.slug} />
                {p.url && (
                  <div>
                    <dt>Live</dt>
                    <dd>
                      <a href={p.url} target="_blank" rel="noreferrer" className={styles.ext}>
                        {p.url.replace(/^https?:\/\//, "")}
                        <Icon name="arrow-up-right" size={14} />
                        <span className="visually-hidden"> (opens in a new tab)</span>
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </header>

            <LightUp className={styles.hero}>
              <div className="row-hover">
                <ProjectVisual slug={p.slug} priority />
              </div>
            </LightUp>

            <section className={`wrap ${styles.block}`} aria-labelledby="contribution">
              <h2 id="contribution" className={styles.blockTitle}>
                What I built
              </h2>
              <ul className={styles.contrib}>
                {cs.contribution.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>

            <section className={styles.evidenceBlock} aria-labelledby="evidence">
              <h2 id="evidence" className={`wrap ${styles.blockTitle} ${styles.evidenceTitle}`}>
                The work
              </h2>
              <div className={styles.evidence}>
                {cs.evidence.map((e, n) => (
                  <LightUp
                    key={n}
                    className={`${styles.figureWrap} ${e.kind === "illustration" && narrowIds.has(e.id) ? styles.narrow : ""}`}
                  >
                    <figure className={styles.figure}>
                      {e.kind === "video" ? (
                        <Clip src={e.src} poster={e.poster} label={e.alt} width={e.width} height={e.height} />
                      ) : e.kind === "screenshot" ? (
                        <Image src={e.src} alt={e.alt} width={e.width} height={e.height} sizes="(max-width: 900px) 92vw, 1100px" />
                      ) : (
                        <Illustration id={e.id} />
                      )}
                      <figcaption>{e.caption}</figcaption>
                    </figure>
                  </LightUp>
                ))}
              </div>
              {cs.note && <p className={`wrap ${styles.note}`}>{cs.note}</p>}
            </section>

            <nav className={`wrap ${styles.next}`} aria-label="Next project">
              <Link href={`/work/${next.slug}`} className={styles.nextLink}>
                <span className={`condensed ${styles.nextTitle}`}>
                  <span className="visually-hidden">Next project: </span>
                  {next.title}
                  <Icon name="arrow-right" size={48} />
                </span>
              </Link>
            </nav>
          </article>
        </main>
      </div>
      <Contact />
    </>
  );
}
