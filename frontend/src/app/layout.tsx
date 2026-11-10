import type { Metadata, Viewport } from "next";
import { Geist, Source_Serif_4 } from "next/font/google";
import { Suspense } from "react";
import { SiteHeader, SiteHeaderCadangan } from "@/components/layout/SiteHeader";
import "./globals.css";

const geist = Geist({
  variable: "--font-ui",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// Hanya dipakai di dokumen usulan cetak.
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SiapKemarau",
    template: "%s · SiapKemarau",
  },
  description:
    "Kesiapan desa rawan karhutla: paparan dari deteksi satelit, kondisi alat padam, dan prioritas pendanaan sebelum musim kering.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f4f1",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geist.variable} ${sourceSerif.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-card focus:bg-surface focus:px-4 focus:py-3"
        >
          Lewati ke konten
        </a>
        <Suspense fallback={<SiteHeaderCadangan />}>
          <SiteHeader />
        </Suspense>
        <main id="konten" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
