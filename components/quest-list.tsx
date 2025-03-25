'use client'
import useSWR from "swr";
import { Suspense, useState } from "react";
import { Button, List, ListItem, ListItemText, Paper, Typography, Divider, ListSubheader } from "@mui/material";
import type { Quest, QuestList } from '@/components/quest.interface';
import { useRouter } from "next/navigation";

const API_URL = process.env.API_URL || "http://localhost:3000"; // Ensure the correct environment variable

const fetcher = (url: string) => fetch(url, { method: "GET" }).then((res) => res.json());

export default function QuestList(){
    const router = useRouter();
    const { data: quests, error, mutate } = useSWR(`${API_URL}/api/quests`, fetcher);
    const [selectedItem, setSelectedItem] = useState<Quest | null>(null);
    
    if(error){ console.log(error); }

    if (error) return <Typography>Error loading quests.</Typography>;
    if (!quests) return <Typography>Loading...</Typography>;

    return (
        <Paper sx={{p: 1, height: '100%', maxHeight: '80vh', overflow: 'auto'}}>
            <Suspense fallback={<Typography variant="body2">Loading Quests...</Typography>}>
            <List>
                <ListSubheader>
                    <Button variant="contained" color="primary" fullWidth onClick={() => router.push("/quest/")}>
                        Create New Quest
                    </Button>
                </ListSubheader>
                {quests.map((quest: Quest, index: number) => (
                    <div key={quest._id} >
                        <ListItem
                            
                            onClick={() => router.push(`/quest/${quest._id}`)}
                        >
                            <ListItemText 
                            primary={quest.questName} 
                            secondary={quest.status}
                            />
                        </ListItem>
                        {/* hide divider for last item in list */}
                        { index < quests.length - 1 && <Divider />} 
                    </div>
                ))}
            </List>
            </Suspense>
        </Paper>
    )
  }