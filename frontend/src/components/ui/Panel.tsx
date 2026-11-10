import type { ReactNode } from "react";

/**
 * Kartu dasar: radius 20 px, garis rambut, bayangan tipis.
 * Tidak pernah bersarang: jangan menaruh Panel di dalam Panel (Design Brief §6).
 */
export function Panel({
  children,
  className = "",
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
}) {
  return <Tag className={`rounded-panel border border-line bg-surface shadow-card ${className}`}>{children}</Tag>;
}
