import type { Status } from "@/lib/types";

// Status selalu ikon + teks, tidak hanya warna (Design Brief §3, §11).
const map: Record<Status, { text: string; color: string; icon: React.ReactNode }> = {
  siap: {
    text: "Siap",
    color: "text-ok",
    icon: <path d="M5 12l5 5 9-10" />,
  },
  sebagian: {
    text: "Sebagian siap",
    color: "text-warn",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
      </>
    ),
  },
  rawan: {
    text: "Rawan",
    color: "text-danger",
    icon: (
      <>
        <path d="M12 3l10 18H2z" />
        <path d="M12 10v5M12 18h.01" />
      </>
    ),
  },
};

export function StatusBadge({ status, size = "md" }: { status: Status; size?: "md" | "lg" }) {
  const s = map[status];
  const px = size === "lg" ? 24 : 18;
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold ${s.color} ${size === "lg" ? "text-lg" : "text-sm"}`}>
      <svg aria-hidden="true" width={px} height={px} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {s.icon}
      </svg>
      {s.text}
    </span>
  );
}
