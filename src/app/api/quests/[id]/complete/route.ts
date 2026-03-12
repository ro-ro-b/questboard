import { NextResponse } from "next/server";
import { getAuthSession, prisma } from "@/lib/auth";
import { applyXp, progressionSummary } from "@/lib/xp-engine";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const quest = await tx.quest.findFirst({
        where: {
          id: params.id,
          userId: session.user.id,
        },
      });

      if (!quest) {
        throw new Error("NOT_FOUND");
      }

      if (quest.isCompleted) {
        throw new Error("ALREADY_COMPLETED");
      }

      const user = await tx.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      const progression = applyXp(
        {
          level: user.level,
          xp: user.xp,
          totalXp: user.totalXp,
        },
        quest.xpReward,
      );

      const updatedQuest = await tx.quest.update({
        where: { id: quest.id },
        data: {
          isCompleted: true,
          completedAt: new Date(),
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          level: progression.level,
          xp: progression.xp,
          totalXp: progression.totalXp,
        },
      });

      return { updatedQuest, updatedUser };
    });

    return NextResponse.json({
      quest: {
        id: result.updatedQuest.id,
        title: result.updatedQuest.title,
        description: result.updatedQuest.description,
        difficulty: result.updatedQuest.difficulty,
        xpReward: result.updatedQuest.xpReward,
        isCompleted: result.updatedQuest.isCompleted,
        completedAt: result.updatedQuest.completedAt?.toISOString() ?? null,
      },
      profile: {
        id: result.updatedUser.id,
        name: result.updatedUser.name,
        email: result.updatedUser.email,
        level: result.updatedUser.level,
        xp: result.updatedUser.xp,
        totalXp: result.updatedUser.totalXp,
        ...progressionSummary({
          level: result.updatedUser.level,
          xp: result.updatedUser.xp,
          totalXp: result.updatedUser.totalXp,
        }),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NOT_FOUND") {
        return NextResponse.json({ error: "Quest not found" }, { status: 404 });
      }

      if (error.message === "ALREADY_COMPLETED") {
        return NextResponse.json({ error: "Quest already completed" }, { status: 400 });
      }

      if (error.message === "USER_NOT_FOUND") {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Failed to complete quest" }, { status: 500 });
  }
}
