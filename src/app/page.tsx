import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Work />
      </main>
      <Contact />
    </>
  );
}
