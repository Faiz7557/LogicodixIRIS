import { KerangkaAkun } from "@/components/layout/KerangkaAkun";

/*
 * Layout halaman berakun (kesiapan, inventaris, prioritas, usulan). Isi kerangka dan aturan akses ada di
 * KerangkaAkun. `params` adalah data runtime, jadi dibaca di dalam Suspense (cacheComponents aktif).
 */
export default function AkunLayout({ children, params }: LayoutProps<"/desa/[kode]">) {
  return <KerangkaAkun kode={params.then((p) => p.kode)}>{children}</KerangkaAkun>;
}
