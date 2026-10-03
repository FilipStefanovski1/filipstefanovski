import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Contact from "@/components/Contact";

// Refresh "Last shipped" from GitHub at most every 10 minutes
export const revalidate = 600;

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
