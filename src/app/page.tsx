import { TerminalShell } from "@/components/terminal/TerminalShell";
import { VisitorTracker } from "@/components/telemetry/VisitorTracker";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0f17] flex flex-col justify-center items-center p-3 sm:p-6 lg:p-8 font-sans">
      <VisitorTracker />
      <TerminalShell />
    </main>
  );
}
