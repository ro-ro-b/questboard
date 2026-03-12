import { NextResponse } from "next/server";
import { getAuthSession, prisma } from "@/lib/auth";
import { progressionSummary } from "@/lib/xp-engine";

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    profile: {
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
    },
  });
}
