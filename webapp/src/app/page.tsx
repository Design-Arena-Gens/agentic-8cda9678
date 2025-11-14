import BatteryExperience from "@/components/BatteryExperience";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 px-6 py-20 font-sans text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-[32px] border border-white/10 bg-white/60 p-10 shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl transition-colors dark:border-zinc-700/30 dark:bg-zinc-900/60 dark:shadow-[0_24px_60px_rgba(2,6,23,0.6)] sm:p-14">
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Solid State Battery Monitor
              </h1>
              <p className="mt-3 max-w-lg text-base text-zinc-600 dark:text-zinc-400">
                Visualize a high fidelity 3D lithium cell with real-time telemetry. Tune the
                charge slider to simulate performance under different load scenarios.
              </p>
            </div>
            <div className="rounded-full border border-white/40 bg-white/80 px-5 py-2 text-sm uppercase tracking-[0.4em] text-zinc-500 shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-800/90 dark:text-zinc-300">
              Live Mode
            </div>
          </div>
        </section>
        <BatteryExperience />
      </main>
    </div>
  );
}
