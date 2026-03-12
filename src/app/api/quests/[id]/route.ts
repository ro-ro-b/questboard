import { NextRequest, NextResponse } from "next/server";
import { getAuthSession, prisma } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quest = await prisma.quest.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!quest) {
    return NextResponse.json({ error: "Quest not found" }, { status: 404 });
  }

  return NextResponse.json({
    quest: {
      id: quest.id,
      title: quest.title,
      description: quest.description,
      difficulty: quest.difficulty,
      xpReward: quest.xpReward,
      isCompleted: quest.isCompleted,
      completedAt: quest.completedAt?.toISOString() ?? null,
    },
  });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existingQuest = await prisma.quest.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!existingQuest) {
    return NextResponse.json({ error: "Quest not found" }, { status: 404 });
  }

  const body = (await request.json()) as Partial<{
    title: string;
    description: string | null;
  }>;

  const title = body.title?.trim();

  if (body.title !== undefined && !title) {
    return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
  }

  const updatedQuest = await prisma.quest.update({
    where: { id: existingQuest.id },
    data: {
      title: title ?? undefined,
      description: body.description === undefined ? undefined : body.description,
    },
  });

  return NextResponse.json({
    quest: {
      id: updatedQuest.id,
      title: updatedQuest.title,
      description: updatedQuest.description,
      difficulty: updatedQuest.difficulty,
      xpReward: updatedQuest.xpReward,
      isCompleted: updatedQuest.isCompleted,
      completedAt: updatedQuest.completedAt?.toISOString() ?? null,
    },
  });
}
