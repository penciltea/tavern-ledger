"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Paper, Typography, Button, Box, Stack, Divider } from "@mui/material";
import { Quest } from "@/components/quest.interface";
import dayjs, { Dayjs } from "dayjs";

export default function QuestDetails({ quest }: { quest: Quest }) {
  const router = useRouter();
  
  const handleEdit = useCallback(() => {
    router.push(`/quest?id=${quest._id}`);
  }, [router, quest._id]);

  const formattedDeadline = dayjs(quest.deadline).format("MMMM D, YYYY h:mm A");

  const questDetails = [
    { label: "Difficulty", value: quest.difficulty },
    { label: "Quest Type", value: quest.questType },
    { label: "Deadline", value: formattedDeadline },
    { label: "Quest Giver", value: quest.questGiver },
    { label: "Location", value: quest.location },
    { label: "Rewards", value: quest.reward },
  ];

  return (
    <Paper sx={{ padding: 2, mx: "auto", height: '100%', maxHeight: '80vh', overflow: 'auto' }}>
      <Box sx={{float: 'right'}}>
        <Button variant="contained" color="primary" onClick={handleEdit}>
          Edit Quest
        </Button>
      </Box>
      <Typography variant="h4" gutterBottom> Quest: {quest.questName} </Typography>
      <Typography variant="h5" gutterBottom> Status: { quest.status } </Typography>
      <Typography> {quest.description} </Typography>

      <Divider sx={{my: 4}} />

      <Box sx={{ my: 2 }}>
        <Typography variant="h5" gutterBottom>
          Extra Details
        </Typography>
        <Stack spacing={ 1 }>
          {questDetails.map(({ label, value }) => (
            <Typography key={ label }>
              <strong>{ label }:</strong> { value || "N/A" }
            </Typography>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
