import Image from "next/image";
import type { ReactNode } from "react";
import { SmccMember, SmccPublic } from "./Illustrations";
import s from "./fan.module.css";

function Shot({ src, alt, w, h }: { src: string; alt: string; w: number; h: number }) {
  return <Image src={src} alt={alt} width={w} height={h} sizes="(max-width: 700px) 70vw, 30vw" />;
}

const fans: Record<string, ReactNode[]> = {
  q4: [
    <Shot key="a" src="/work/q4-chat.jpg" alt="Q4 AI Chat" w={2000} h={1042} />,
    <Shot key="b" src="/work/q4-ask.jpg" alt="Q4 cited answer" w={1600} h={738} />,
    <Shot key="c" src="/work/q4-laptop.jpg" alt="Q4 on a laptop" w={2000} h={1422} />,
  ],
  aminta: [
    <Shot key="a" src="/work/aminta-forms.jpg" alt="Aminta companion forms" w={2000} h={1431} />,
    <Shot key="b" src="/work/aminta-hero.jpg" alt="Aminta drafting a post inside X" w={2000} h={1194} />,
    <Shot key="c" src="/work/aminta-extension.jpg" alt="Aminta extension panel" w={1280} h={800} />,
  ],
  "blockchain-skopje": [
    <Shot key="a" src="/work/bks-site.jpg" alt="Blockchain Skopje website" w={1600} h={1000} />,
    <Shot key="b" src="/work/bks-winners.jpg" alt="Demo Day winners" w={1478} h={922} />,
    <Shot key="c" src="/work/bks-squad.jpg" alt="The full squad at Base42" w={1478} h={1072} />,
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
