'use client'
import { Suspense, useState } from "react";
import { Button, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import QuestDetails from "@/components/quests/quest-details/quest-details";
import type { Quest, QuestList } from '@/components/quests/quest.interface';
import { useRouter } from "next/navigation";

export default function Quests({ quests }: QuestList){
    const [selectedItem, setSelectedItem] = useState<Quest | null>(null);
    const router = useRouter();

    return (
        <Grid container spacing={1}>
            {/* Left Panel: List */}
            <Grid size={4}>
                <Paper>
                    <Suspense fallback={<Typography variant="body2">Loading Quests...</Typography>}>
                    <Button onClick={() => router.push("/quest/add")} variant="contained" color="primary" fullWidth>
                        Create New Quest
                    </Button>
                        <List>
                            {quests.map(({ _id, title, description, status}: Quest) => (
                                <ListItem key={_id}>
                                    <ListItemText onClick={() => setSelectedItem({ _id, title, description, status })}
                                        primary={title}
                                        secondary={description}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Suspense>
                </Paper>
            </Grid>
            
            { /* Right panel: details */}
            <Grid size={8}>
                <QuestDetails selectedItem={ selectedItem } />
            </Grid>
        </Grid>
    )
  }