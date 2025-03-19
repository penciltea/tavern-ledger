import { notFound } from "next/navigation";
import QuestDetails from "@/components/quest-details";
import { Quest } from "@/components/quest.interface";

async function getQuest(id: string): Promise<Quest | null> {
  try {
    const result = await fetch(`${process.env.URL}/api/quests?id=${id}`, { method: "GET" });

    if (!result.ok) {
      throw new Error("Failed to fetch quest");
    }

    const quest = await result.json();
    
    return quest || null;
  } catch (error) {
    console.error("Error fetching quest:", error);
    return null;
  }
}

export default async function QuestPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const quest = await getQuest(id);

  if (!quest) return notFound();

  return <QuestDetails quest={quest} />;
}
