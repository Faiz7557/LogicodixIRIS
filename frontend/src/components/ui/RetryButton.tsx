"use client";

import { useRouter } from "next/navigation";

export function RetryButton({ onRetry }: { onRetry?: () => void }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => (onRetry ? onRetry() : router.refresh())}
      className="mt-3 inline-flex min-h-11 items-center rounded-card border border-line bg-paper px-4 font-semibold"
    >
      Coba lagi
    </button>
  );
}
