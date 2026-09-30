import Image from "next/image";
import { SmccMember, SmccPublic } from "./Illustrations";
import s from "./composition.module.css";

/** Each project gets its own composition instead of a repeated image-in-a-box. */
export default function ProjectVisual({ slug, priority = false }: { slug: string; priority?: boolean }) {
  switch (slug) {
    case "q4":
      return (
        <div className={`${s.comp} ${s.q4}`}>
          <div className={`${s.layer} ${s.q4Shot}`}>
            <Image
              src="/work/q4-laptop.jpg"
              alt="Q4 on a laptop: an answer beside its cited source."
              width={2000}
              height={1422}
              sizes="(max-width: 640px) 100vw, (max-width: 1480px) 60vw, 900px"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
            />
          </div>
          <div className={`${s.layer} ${s.q4Answer}`}>
            <Image
              src="/work/q4-ask.jpg"
              alt="A cited answer comparing STC and Mobily."
              width={1600}
              height={738}
              sizes="(max-width: 640px) 100vw, 45vw"
            />
          </div>
          <div className={`${s.layer} ${s.q4Source}`}>
            <Image
              src="/work/q4-verify.jpg"
              alt="A figure next to its source passage."
              width={1600}
              height={738}
              sizes="(max-width: 640px) 100vw, 40vw"
            />
          </div>
        </div>
      );
    case "blockchain-skopje":
      return (
        <div className={`${s.comp} ${s.bks}`}>
          <div className={`${s.layer} ${s.bksSite}`}>
            <Image
              src="/work/bks-site.jpg"
              alt="The Blockchain Skopje website."
              width={1600}
              height={1000}
              sizes="(max-width: 640px) 100vw, (max-width: 1480px) 64vw, 950px"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
            />
          </div>
          <div className={`${s.layer} ${s.bksPhoto}`}>
            <Image
              src="/work/bks-squad.jpg"
              alt="The full squad at Base42."
              width={1478}
              height={1072}
              sizes="(max-width: 640px) 100vw, 40vw"
            />
          </div>
        </div>
      );
    case "aminta":
      return (
        <div className={`${s.comp} ${s.aminta}`}>
          <div className={`${s.layer} ${s.amSite}`}>
            <Image
              src="/work/aminta-hero.jpg"
              alt="Aminta drafting a post inside X, with the extension panel open."
              width={2000}
              height={1194}
              sizes="(max-width: 640px) 100vw, (max-width: 1480px) 72vw, 1080px"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
            />
          </div>
          <div className={`${s.layer} ${s.amForms}`}>
            <Image
              src="/work/aminta-extension.jpg"
              alt="The Aminta extension panel: the companion, today's tasks and Create with Aminta."
              width={1280}
              height={800}
              sizes="(max-width: 640px) 100vw, (max-width: 1480px) 46vw, 680px"
            />
          </div>
        </div>
      );
    case "smcc":
      return (
        <div className={`${s.comp} ${s.smcc}`}>
          <div className={`${s.layer} ${s.smccPublic}`}>
            <SmccPublic />
          </div>
          <div className={`${s.layer} ${s.smccMember}`}>
            <SmccMember />
          </div>
        </div>
      );
    case "nordgate":
      return (
        <div className={`${s.comp} ${s.nordgate}`}>
          <div className={`${s.layer} ${s.ngShot}`}>
            <Image
              src="/work/nordgate-site.jpg"
              alt="The Nordgate website hero on a deep blue background."
              width={1728}
              height={792}
              sizes="(max-width: 640px) 100vw, (max-width: 1480px) 90vw, 1330px"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
            />
          </div>
        </div>
      );
    default:
      return null;
  }
}
