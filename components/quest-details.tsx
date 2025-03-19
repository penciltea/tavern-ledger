"use client";

import { useRouter } from "next/navigation";
import { Paper, Typography, Button } from "@mui/material";
import { Quest } from "@/components/quest.interface";

export default function QuestDetails({ quest }: { quest: Quest }) {
  const router = useRouter();

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5">{quest.questName}</Typography>
      <Typography>{quest.description}</Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        onClick={() => router.push(`/quest?id=${quest._id}`)}
      >
        Edit Quest
      </Button>
    </Paper>
  );
}
