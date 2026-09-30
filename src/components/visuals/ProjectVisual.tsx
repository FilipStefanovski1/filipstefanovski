import Image from "next/image";
import { Q4Answer, Q4Source, SmccMember, SmccPublic } from "./Illustrations";
import s from "./composition.module.css";

/** Each project gets its own composition instead of a repeated image-in-a-box. */
export default function ProjectVisual({ slug, priority = false }: { slug: string; priority?: boolean }) {
  switch (slug) {
    case "q4":
      return (
        <div className={`${s.comp} ${s.q4}`}>
          <div className={`${s.layer} ${s.q4Shot}`}>
            <Image
              src="/work/q4-site.jpg"
              alt="The public Q4 website hero."
              width={1728}
              height={792}
              sizes="(max-width: 640px) 100vw, (max-width: 1480px) 72vw, 1080px"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
            />
          </div>
          <div className={`${s.layer} ${s.q4Answer}`}>
            <Q4Answer />
          </div>
          <div className={`${s.layer} ${s.q4Source}`}>
            <Q4Source />
          </div>
        </div>
      );
    case "aminta":
      return (
        <div className={`${s.comp} ${s.aminta}`}>
          <div className={`${s.layer} ${s.amSite}`}>
            <Image
              src="/work/aminta-site.jpg"
              alt="The Aminta website hero with the extension drafting a post inside X."
              width={1728}
              height={880}
              sizes="(max-width: 640px) 100vw, (max-width: 1480px) 72vw, 1080px"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
            />
          </div>
          <div className={`${s.layer} ${s.amForms}`}>
            <Image
              src="/work/aminta-forms.jpg"
              alt="Aminta's evolving companion forms."
              width={1728}
              height={752}
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
