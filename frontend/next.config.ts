import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Langkah 1 Prioritas dulu bernama "Simulasi pagu"; tautan lama tetap sampai.
  async redirects() {
    return [{ source: "/desa/:kode/prioritas/simulasi", destination: "/desa/:kode/prioritas/pagu", permanent: true }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
