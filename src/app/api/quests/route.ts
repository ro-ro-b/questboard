import { NextResponse } from "next/server";
import { getAuthSession, prisma } from "@/lib/auth";

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quests = await prisma.quest.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isCompleted: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({
    quests: quests.map((quest) => ({
      id: quest.id,
      title: quest.title,
      description: quest.description,
      difficulty: quest.difficulty,
      xpReward: quest.xpReward,
      isCompleted: quest.isCompleted,
      completedAt: quest.completedAt?.toISOString() ?? null,
    })),
  });
}
