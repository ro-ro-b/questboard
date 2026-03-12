"use client";

import { useMemo, useState } from "react";

type Profile = {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  totalXp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPercentage: number;
};

type Quest = {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  xpReward: number;
  isCompleted: boolean;
  completedAt: string | null;
};

type DashboardClientProps = {
  initialProfile: Profile;
  initialQuests: Quest[];
};

export function DashboardClient({ initialProfile, initialQuests }: DashboardClientProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [quests, setQuests] = useState(initialQuests);
  const [loadingQuestId, setLoadingQuestId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeQuests = useMemo(() => quests.filter((quest) => !quest.isCompleted), [quests]);
  const completedQuests = useMemo(() => quests.filter((quest) => quest.isCompleted), [quests]);

  async function completeQuest(id: string) {
    setLoadingQuestId(id);
    setError(null);

    try {
      const response = await fetch(`/api/quests/${id}/complete`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to complete quest");
      }

      setProfile(data.profile);
      setQuests((current) =>
        current.map((quest) => (quest.id === id ? data.quest : quest)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoadingQuestId(null);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">Adventurer Profile</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{profile.name}</h2>
            <p className="text-sm text-slate-500">{profile.email}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-slate-500">Level</p>
            <p className="text-3xl font-bold text-slate-900">{profile.level}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
            <span>XP Progress</span>
            <span>
              {profile.xpForCurrentLevel} / {profile.xpForNextLevel} XP
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${profile.progressPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-slate-500">Total XP earned: {profile.totalXp}</p>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">Active Quests</h3>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              {activeQuests.length}
            </span>
          </div>

          <div className="space-y-4">
            {activeQuests.length === 0 ? (
              <p className="text-sm text-slate-500">No active quests. Time to create more adventures.</p>
            ) : (
              activeQuests.map((quest) => (
                <article key={quest.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900">{quest.title}</h4>
                      {quest.description ? (
                        <p className="mt-1 text-sm text-slate-600">{quest.description}</p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700">
                          {quest.difficulty}
                        </span>
                        <span className="rounded-full bg-emerald-100 px-2 py-1 font-medium text-emerald-700">
                          +{quest.xpReward} XP
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => completeQuest(quest.id)}
                      disabled={loadingQuestId === quest.id}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loadingQuestId === quest.id ? "Completing..." : "Complete"}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">Completed Quests</h3>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {completedQuests.length}
            </span>
          </div>

          <div className="space-y-4">
            {completedQuests.length === 0 ? (
              <p className="text-sm text-slate-500">Complete a quest to start your streak.</p>
            ) : (
              completedQuests.map((quest) => (
                <article key={quest.id} className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <h4 className="font-semibold text-slate-900">{quest.title}</h4>
                  {quest.description ? <p className="mt-1 text-sm text-slate-600">{quest.description}</p> : null}
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-white px-2 py-1 font-medium text-slate-700">{quest.difficulty}</span>
                    <span className="rounded-full bg-white px-2 py-1 font-medium text-emerald-700">+{quest.xpReward} XP</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
