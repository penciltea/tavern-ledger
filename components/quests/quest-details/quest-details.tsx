import { Paper, Typography } from "@mui/material";
import type { Quest } from "../quest.interface";

export default function QuestDetails({ selectedItem }: { selectedItem: Quest | null }) {
  let formattedDeadline: Date | string = "-";

  if(selectedItem?.deadline){
    let deadline = new Date(selectedItem.deadline);

    formattedDeadline = deadline.toLocaleDateString('en-US', { year: 'numeric', day: '2-digit', month: 'short', hour: 'numeric', minute: 'numeric', hour12: true })
  }

    return (
      <Paper sx={{ padding: 2 }}>
        {selectedItem ? (
          <>
            <Typography variant="h5">{selectedItem.questName}</Typography>
            <Typography>{selectedItem.description}</Typography>
            <Typography>Status: {selectedItem.status}</Typography>
            <Typography>Deadline: {formattedDeadline}</Typography>
            <Typography>Difficulty: {selectedItem.difficulty}</Typography>
            <Typography>Reward: {selectedItem.reward}</Typography>
            <Typography>Quest Giver: {selectedItem.questGiver}</Typography>
            <Typography>Location: {selectedItem.location}</Typography>
            <Typography>Party Members: {selectedItem.partyMembers}</Typography>
          </>
        ) : (
          <Typography>Select a quest to view details</Typography>
        )}
      </Paper>
    );
  }
  