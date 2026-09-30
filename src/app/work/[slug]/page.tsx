import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/site";
import SiteHeader from "@/components/SiteHeader";
import Contact from "@/components/Contact";
import ProjectVisual from "@/components/visuals/ProjectVisual";
import { Illustration } from "@/components/visuals/Illustrations";
import Reveal from "@/components/Reveal";
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

export default async function CasePage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];
  const cs = p.caseStudy;

  return (
    <>
      <SiteHeader />
      <main id="main">
        <article>
          <header className={`wrap ${styles.head}`}>
            <Link href="/#work" className={`mono ${styles.back}`}>
              <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden>
                <path d="M14 5H1.5M5.5 1l-4 4 4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              All work
            </Link>
            <div className={styles.titleRow}>
              <span className={styles.index} aria-hidden>
                {p.index}
              </span>
              <h1 className={styles.title}>{p.title}</h1>
            </div>
            <p className={styles.lede}>{cs.lede}</p>
            <dl className={styles.spec}>
              <div>
                <dt className="mono">Project</dt>
                <dd>{p.kind}</dd>
              </div>
              <div>
                <dt className="mono">My role</dt>
                <dd>{p.role}</dd>
              </div>
              <div>
                <dt className="mono">Areas</dt>
                <dd>{p.tags.join(", ")}</dd>
              </div>
              {p.url && (
                <div>
                  <dt className="mono">Live</dt>
                  <dd>
                    <a href={p.url} target="_blank" rel="noreferrer" className={styles.ext}>
                      {p.url.replace(/^https?:\/\//, "")}
                      <span aria-hidden> ↗</span>
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </header>

          <div className={`wrap ${styles.hero} row-hover`}>
            <ProjectVisual slug={p.slug} priority />
          </div>

          <section className={`wrap ${styles.block}`} aria-labelledby="problem">
            <h2 id="problem" className={`mono ${styles.blockLabel}`}>
              The problem
            </h2>
            <p className={styles.problem}>{cs.problem}</p>
          </section>

          <section className={`wrap ${styles.block}`} aria-labelledby="contribution">
            <h2 id="contribution" className={`mono ${styles.blockLabel}`}>
              What I worked on
            </h2>
            <ul className={styles.contrib}>
              {cs.contribution.map((c, n) => (
                <li key={c}>
                  <span className="mono">{String(n + 1).padStart(2, "0")}</span>
                  {c}
                </li>
              ))}
            </ul>
          </section>

          <section className={`wrap ${styles.block}`} aria-labelledby="decisions">
            <h2 id="decisions" className={`mono ${styles.blockLabel}`}>
              Decisions
            </h2>
            <ol className={styles.decisions}>
              {cs.decisions.map((d) => (
                <li key={d.title}>
                  <h3>{d.title}</h3>
                  <p>{d.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className={`wrap ${styles.block}`} aria-labelledby="evidence">
            <h2 id="evidence" className={`mono ${styles.blockLabel}`}>
              The work
            </h2>
            <div className={styles.evidence}>
              {cs.evidence.map((e, n) => (
                <Reveal key={n} className={`${styles.figureWrap} ${e.kind === "illustration" && (e.id === "internal-overview" || e.id === "smcc-member") ? styles.narrow : ""}`}>
                  <figure className={styles.figure}>
                    {e.kind === "screenshot" ? (
                      <Image src={e.src} alt={e.alt} width={e.width} height={e.height} sizes="(max-width: 900px) 92vw, 80vw" />
                    ) : (
                      <Illustration id={e.id} />
                    )}
                    <figcaption className="mono">{e.caption}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
            {cs.note && <p className={styles.note}>{cs.note}</p>}
          </section>

          <nav className={`wrap ${styles.next}`} aria-label="Next project">
            <Link href={`/work/${next.slug}`} className={styles.nextLink}>
              <span className="mono">Next project</span>
              <span className={styles.nextTitle}>
                {next.title}
                <svg width="0.6em" height="0.45em" viewBox="0 0 14 10" aria-hidden>
                  <path d="M0 5h12.5M8.5 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
            </Link>
          </nav>
        </article>
      </main>
      <Contact />
    </>
  );
}
