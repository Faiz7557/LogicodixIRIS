import Link from "next/link";
import type { ReactNode } from "react";
import { RetryButton } from "./RetryButton";

/*
 * Tiga keadaan wajib setiap layar data (Design Brief §10):
 * memuat, kosong dengan arahan berikutnya, dan galat dengan tombol coba lagi.
 */

export function SkeletonBlock({ className = "h-5 w-full" }: { className?: string }) {
  return <div aria-hidden="true" className={`skeleton ${className}`} />;
}

export function LoadingState({ label = "Memuat data", lines = 4 }: { label?: string; lines?: number }) {
  return (
    <div role="status" aria-live="polite" className="space-y-3 py-2">
      <span className="sr-only">{label}…</span>
      <SkeletonBlock className="h-7 w-2/3" />
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonBlock key={i} className={`h-4 ${i % 2 ? "w-5/6" : "w-full"}`} />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: { href: string; label: string };
}) {
  return (
    <div className="rounded-card border border-dashed border-line-2 bg-surface-2 px-4 py-6">
      <p className="font-semibold text-ink">{title}</p>
      {children ? <div className="mt-1 text-muted">{children}</div> : null}
      {action ? (
        <Link href={action.href} className="btn btn-utama mt-4">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function ErrorState({
  message = "Data gagal dimuat. Periksa sinyal, lalu coba lagi.",
}: {
  message?: string;
}) {
  return (
    <div role="alert" className="rounded-card border border-danger/30 bg-danger-soft px-4 py-5">
      <p className="font-semibold text-danger">{message}</p>
      <RetryButton />
    </div>
  );
}
