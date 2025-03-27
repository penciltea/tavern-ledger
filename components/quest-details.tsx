"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Paper, Typography, Button, Box, Stack, Divider} from "@mui/material";
import { Quest } from "@/interfaces/quest.interface";
import dayjs from "dayjs";
import { useSnackbar } from "@/contexts/snackbar";

export default function QuestDetails({ quest }: { quest: Quest }) {
  const router = useRouter();

  const { showSnackbar } = useSnackbar();
  
  const handleEdit = useCallback(() => {
    router.push(`/quest?id=${quest._id}`);
  }, [router, quest._id]);

  let formattedDeadline = "N/A"
  if(quest.deadline){
    formattedDeadline = dayjs(quest.deadline).format("MMMM D, YYYY h:mm A");
  }

  const questDetails = [
    { label: "Difficulty", value: quest.difficulty },
    { label: "Quest Type", value: quest.questType },
    { label: "Deadline", value: formattedDeadline },
    { label: "Quest Giver", value: quest.questGiver },
    { label: "Location", value: quest.location },
    { label: "Rewards", value: quest.reward },
  ];

  async function handleDelete(){
    const confirmDelete = window.confirm("Are you sure you want to delete this quest?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/quests?id=${quest._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        showSnackbar("Failed to delete the quest", "error");
        //throw new Error("Failed to delete quest");
      }

      showSnackbar("Quest deleted successfully!", "success");
      setTimeout(() => {
        router.push("/"); // Redirect to home page
      }, 2000);
    } catch (error) {
      showSnackbar(`Failed to delete the quest: ${error}`, "error");
      //console.error("Error deleting quest:", error);
    }
  }


  
  return (
    <Paper sx={{ padding: 2, mx: "auto", height: '100%', maxHeight: '80vh', overflow: 'auto' }}>
      <Box sx={{float: 'right'}}>
        <Button variant="contained" color="primary" onClick={handleEdit}>
          Edit Quest
        </Button>
        <Button sx={{ mx: 2 }} variant="text" color="primary" onClick={handleDelete}>
          Delete
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
