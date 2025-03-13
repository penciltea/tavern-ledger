import { Paper, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import { Quest } from "@/components/quests/quest.interface"

async function getQuest(id: string): Promise<Quest> {
  try {
    const result = await fetch(`${process.env.URL}/api/quests?id=${id}`, { method: 'GET' });

    if (!result.ok) {
      throw new Error("Failed to fetch quests");
    }
    
    return result.json();
  } catch (error) {
    console.error("Error fetching quests:", error);
    return notFound();
  }
}

export default async function displayQuest({ params }: { params: { id: string } }) {
  if(!params?.id){
    const quest = await getQuest(params.id);

    if (!quest) {
      return (
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h5">Quest Not Found</Typography>
        </Paper>
      );
    }

    return (
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h5">{quest.questName}</Typography>
        <Typography>{quest.description}</Typography>
      </Paper>
    );
  }
}