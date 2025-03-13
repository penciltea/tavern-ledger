'use client'
import { Suspense, useState } from "react";
import { Button, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import QuestDetails from "@/components/quests/quest-details/quest-details";
import type { Quest, QuestList } from '@/components/quests/quest.interface';
import { useRouter, usePathname } from "next/navigation";

export default function QuestList({ quests }: QuestList){
    const [selectedItem, setSelectedItem] = useState<Quest | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    return (
        <Paper>
            <Suspense fallback={<Typography variant="body2">Loading Quests...</Typography>}>
            <Button onClick={() => router.push("/quest/")} variant="contained" color="primary" fullWidth>
                Create New Quest
            </Button>
                <List>
                    {quests.map((quest) => (
                        <ListItem
                            key={quest._id}
                            onClick={() => router.push(`/quest/${quest._id}`)}
                        >
                            <ListItemText
                                primary={quest.questName} 
                                secondary={quest.description} 
                            />
                        </ListItem>
                    ))}
                </List>
            </Suspense>
        </Paper>
    )
  }