import Image from "next/image";
import type { ReactNode } from "react";
import { Q4Answer, Q4Sheet, SmccMember, SmccPublic } from "./Illustrations";
import s from "./fan.module.css";

function Shot({ src, alt, w, h }: { src: string; alt: string; w: number; h: number }) {
  return <Image src={src} alt={alt} width={w} height={h} sizes="(max-width: 700px) 70vw, 30vw" />;
}

const fans: Record<string, ReactNode[]> = {
  q4: [
    <Shot key="a" src="/work/q4-site.jpg" alt="Q4 website" w={1728} h={792} />,
    <Q4Answer key="b" />,
    <Q4Sheet key="c" />,
  ],
  aminta: [
    <Shot key="a" src="/work/aminta-site.jpg" alt="Aminta website" w={1728} h={880} />,
    <Shot key="b" src="/work/aminta-forms.jpg" alt="Aminta companion forms" w={1728} h={752} />,
  ],
  smcc: [<SmccPublic key="a" />, <SmccMember key="b" />],
  nordgate: [<Shot key="a" src="/work/nordgate-site.jpg" alt="Nordgate website" w={1728} h={792} />],
};

/** A fan of screen cards that deals out when its row is hovered or focused. */
export default function ProjectFan({ slug }: { slug: string }) {
  const cards = fans[slug] ?? [];
  return (
    <div className={s.fan} data-count={cards.length} aria-hidden>
      {cards.map((c, i) => (
        <div key={i} className={s.card} style={{ ["--i" as string]: i }}>
          {c}
        </div>
      ))}
    </div>
  );
}
