import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="wrap" style={{ padding: "clamp(64px, 10vw, 140px) var(--gutter)", minHeight: "70svh" }}>
        <p className="mono" style={{ color: "var(--ink-soft)" }}>
          404
        </p>
        <h1
          style={{
            margin: "16px 0 24px",
            font: "800 clamp(64px, 12vw, 180px)/0.84 var(--font-display)",
            textTransform: "uppercase",
          }}
        >
          No access
          <br />
          here.
        </h1>
        <p style={{ maxWidth: "36ch" }}>This page does not exist. The badge is still hanging on the homepage.</p>
        <p style={{ marginTop: 28 }}>
          <Link href="/" className="mono">
            Back home
          </Link>
        </p>
      </main>
    </>
  );
}
