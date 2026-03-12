import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Level up your life</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Turn tasks into quests and progress like a hero.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Questboard transforms habits and daily work into an RPG-inspired dashboard with quests,
          XP rewards, and level progression.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/auth/signin"
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            View dashboard
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Demo credentials</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-900">Email:</span> demo@questboard.dev
          </p>
          <p>
            <span className="font-semibold text-slate-900">Password:</span> password123
          </p>
        </div>
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          Complete quests, earn XP, and watch your level rise with every win.
        </div>
      </section>
    </div>
  );
}
