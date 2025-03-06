import { Paper, Typography } from "@mui/material";
import type { Quest } from "../quest.interface";

export default function QuestDetails({ selectedItem }: { selectedItem: Quest | null }) {
    return (
      <Paper sx={{ padding: 2 }}>
        {selectedItem ? (
          <>
            <Typography variant="h5">{selectedItem.title}</Typography>
            <Typography>{selectedItem.description}</Typography>
          </>
        ) : (
          <Typography>Select a quest to view details</Typography>
        )}
      </Paper>
    );
  }
  