import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Icon from "@/components/Icon";

export default function NotFound() {
  return (
    <div style={{ color: "var(--light)", minHeight: "100svh" }}>
      <SiteHeader />
      <main id="main" className="wrap" style={{ paddingBlock: "clamp(64px, 10vw, 140px)" }}>
        <h1 className="condensed" style={{ margin: 0, fontSize: "clamp(80px, 16vw, 240px)" }}>
          Nothing
          <br />
          on stage.
        </h1>
        <p style={{ maxWidth: "36ch", marginTop: 28, color: "var(--dim)", fontSize: 20 }}>
          This page does not exist. The badge is still hanging on the homepage.
        </p>
        <Link
          href="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 20, fontWeight: 650, textDecoration: "none" }}
        >
          Back home
          <Icon name="arrow-right" />
        </Link>
      </main>
    </div>
  );
}
