import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Fira_Sans_Extra_Condensed } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

/** One family for the whole site: condensed 800 for names, text widths for everything else. */
const bricolage = Bricolage_Grotesque({
  variable: "--font-name",
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  axes: ["wdth", "opsz"],
  display: "swap",
});

/** The big hero name is set in Macedonian Cyrillic; Bricolage has no Cyrillic, so it gets its own face. */
const firaCyr = Fira_Sans_Extra_Condensed({
  variable: "--font-cyr",
  subsets: ["cyrillic"],
  weight: "900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}, ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name}, ${site.role}`,
    description: site.description,
    url: "/",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}, ${site.role}`,
    description: site.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bricolage.variable} ${firaCyr.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
