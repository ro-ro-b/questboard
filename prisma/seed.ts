import bcrypt from "bcrypt";
import { PrismaClient, QuestDifficulty } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const password = process.env.SEED_USER_PASSWORD ?? "password123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.quest.deleteMany();
  await prisma.user.deleteMany();

  const demoUser = await prisma.user.create({
    data: {
      name: "Demo Adventurer",
      email: process.env.SEED_USER_EMAIL ?? "demo@questboard.dev",
      passwordHash,
      level: 2,
      xp: 40,
      totalXp: 140,
      quests: {
        create: [
          {
            title: "Morning workout",
            description: "Complete a 20 minute workout session.",
            difficulty: QuestDifficulty.MEDIUM,
            xpReward: 40,
            isCompleted: false,
          },
          {
            title: "Read 10 pages",
            description: "Read at least 10 pages of a book.",
            difficulty: QuestDifficulty.EASY,
            xpReward: 20,
            isCompleted: false,
          },
          {
            title: "Ship a feature",
            description: "Finish and deploy one meaningful improvement.",
            difficulty: QuestDifficulty.HARD,
            xpReward: 80,
            isCompleted: false,
          },
          {
            title: "Plan tomorrow",
            description: "Write down the top 3 priorities for tomorrow.",
            difficulty: QuestDifficulty.EASY,
            xpReward: 15,
            isCompleted: true,
            completedAt: new Date(),
          },
        ],
      },
    },
  });

  await prisma.user.create({
    data: {
      name: "Guild Master",
      email: "guildmaster@questboard.dev",
      passwordHash,
      level: 4,
      xp: 25,
      totalXp: 325,
      quests: {
        create: [
          {
            title: "Mentor a teammate",
            description: "Help someone unblock a task.",
            difficulty: QuestDifficulty.MEDIUM,
            xpReward: 35,
            isCompleted: false,
          },
          {
            title: "Deep work session",
            description: "Focus for 90 uninterrupted minutes.",
            difficulty: QuestDifficulty.HARD,
            xpReward: 75,
            isCompleted: false,
          },
        ],
      },
    },
  });

  console.log("Seed complete");
  console.log(`Demo user: ${demoUser.email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
