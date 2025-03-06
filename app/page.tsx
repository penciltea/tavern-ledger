import type { Quest } from "@/components/quests/quest.interface";
import Quests from "@/components/quests/quests";

async function getQuests(): Promise<Quest[]> {
  try {
    const result = await fetch(process.env.URL + '/api/quests', { method: 'GET' });
    if (!result.ok) {
      throw new Error("Failed to fetch quests");
    }
    return await result.json();
  } catch (error) {
    console.error("Error fetching quests:", error);
    return [];
  }
}

export default async function HomePage(){
  const quests = await getQuests();

  return (
    <Quests quests={quests} />
  );
}