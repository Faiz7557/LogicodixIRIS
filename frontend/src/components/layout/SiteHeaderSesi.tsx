import { getSesiAkun } from "@/server/auth";
import { SiteHeader } from "./SiteHeader";

/** Membaca sesi di server lalu meneruskannya ke SiteHeader (klien), supaya header tahu pengguna sudah masuk. */
export async function SiteHeaderSesi() {
  const akun = await getSesiAkun();
  return <SiteHeader sesi={akun ? { desaKode: akun.desaKode } : null} />;
}
