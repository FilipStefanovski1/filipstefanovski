import type { Metadata, Viewport } from "next";
import { Big_Shoulders, IBM_Plex_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const display = Big_Shoulders({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["800"],
  display: "swap",
  fallback: ["Impact", "Haettenschweiler", "Arial Narrow", "sans-serif"],
  adjustFontFallback: false,
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "500",
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
  themeColor: "#f3efe6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
