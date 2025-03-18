'use client'
import useSWR from "swr";
import { Suspense, useState } from "react";
import { Button, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import type { Quest, QuestList } from '@/components/quest.interface';
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // Ensure the correct environment variable

const fetcher = (url: string) => fetch(url, { method: "GET" }).then((res) => res.json());

export default function QuestList(){
    const router = useRouter();
    const { data: quests, error, mutate } = useSWR(`${API_URL}/api/quests`, fetcher);
    const [selectedItem, setSelectedItem] = useState<Quest | null>(null);
    

    if (error) return <Typography>Error loading quests.</Typography>;
    if (!quests) return <Typography>Loading...</Typography>;

    return (
        <Paper>
            <Suspense fallback={<Typography variant="body2">Loading Quests...</Typography>}>
            <Button onClick={() => router.push("/quest/")} variant="contained" color="primary" fullWidth>
                Create New Quest
            </Button>
            <List>
                {quests.map((quest: Quest) => (
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