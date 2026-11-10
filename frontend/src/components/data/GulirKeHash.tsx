"use client";

import { useEffect } from "react";

/**
 * Menggulir ke bagian #hash setelah halaman siap. Perlu karena saat masuk, tampilan publik (cadangan Suspense)
 * diganti kerangka dasbor, sehingga loncatan bawaan peramban ke #batasan dan sejenisnya meleset.
 */
export function GulirKeHash() {
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, []);
  return null;
}
