import type { Metadata } from "next";
import { TimeMachineView } from "@/components/timemachine/TimeMachineView";

export const metadata: Metadata = { title: "Time Machine" };

export default function TimeMachinePage() {
  return <TimeMachineView />;
}
