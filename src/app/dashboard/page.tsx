import { redirect } from "next/navigation";
import { DashboardClient } from "@/lib/dashboard-client";
import { getAuthSession, prisma } from "@/lib/auth";
import { progressionSummary } from "@/lib/xp-engine";

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      quests: {
        orderBy: [{ isCompleted: "asc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const profile = {
    id: user.id,
    name: user.name,
    email: user.email,
    level: user.level,
    xp: user.xp,
    totalXp: user.totalXp,
    ...progressionSummary({
      level: user.level,
      xp: user.xp,
      totalXp: user.totalXp,
    }),
  };

  const quests = user.quests.map((quest) => ({
    id: quest.id,
    title: quest.title,
    description: quest.description,
    difficulty: quest.difficulty,
    xpReward: quest.xpReward,
    isCompleted: quest.isCompleted,
    completedAt: quest.completedAt?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Your quest log</h1>
        <p className="mt-2 text-slate-600">Track progress, complete quests, and level up.</p>
      </div>
      <DashboardClient initialProfile={profile} initialQuests={quests} />
    </div>
  );
}
