import { Paper, Typography } from "@mui/material";

export default function Home() {
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5">Welcome to the Tavern Ledger</Typography>
      <Typography>Select a quest or create a new one to get started.</Typography>
    </Paper>
  );
}