import Image from "next/image";
import { InternalBoard, InternalOverview, Q4Answer, Q4Source, SmccMember, SmccPublic } from "./Illustrations";
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
              sizes="(max-width: 900px) 90vw, 50vw"
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
    case "q4-internal":
      return (
        <div className={`${s.comp} ${s.internal}`}>
          <div className={`${s.layer} ${s.intBoard}`}>
            <InternalBoard />
          </div>
          <div className={`${s.layer} ${s.intPhone}`}>
            <InternalOverview />
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
          <p className={s.ngQuote} aria-hidden>
            Your route
            <br />
            into the Nordics.
          </p>
          <div className={`${s.layer} ${s.ngShot}`}>
            <Image
              src="/work/nordgate-site.jpg"
              alt="The Nordgate website hero on a deep blue background."
              width={1728}
              height={792}
              sizes="(max-width: 900px) 90vw, 50vw"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
            />
          </div>
          <span className={s.ngUrl} aria-hidden>
            thenordgate.com
          </span>
        </div>
      );
    default:
      return null;
  }
}
