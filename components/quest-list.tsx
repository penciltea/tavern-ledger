'use client'
import useSWR from "swr";
import { Suspense, useState } from "react";
import { TextField, Button, List, ListItem, ListItemText, Paper, Typography, Divider, ListSubheader } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import type { Quest, QuestList } from '@/components/quest.interface';
import { useRouter } from "next/navigation";

const API_URL = process.env.API_URL || "http://localhost:3000"; // Ensure the correct environment variable

const fetcher = (url: string) => fetch(url, { method: "GET" }).then((res) => res.json());

export default function QuestList(){
    const router = useRouter();
    const { data: quests, error } = useSWR(`${API_URL}/api/quests`, fetcher);

    const [searchText, setSearchText] = useState("");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filteredQuests, setFilteredQuests] = useState(quests);

    if(error){ console.log(error); }

    if (error) return <Typography>Error loading quests.</Typography>;
    if (!quests) return <Typography>Loading...</Typography>;

    

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value.toLowerCase();
        setSearchText(text);
        setFilteredQuests(
          quests.filter((quest: Quest) =>
            quest.questName.toLowerCase().includes(text)
          )
        );
      };

    return (
        <Paper sx={{p: 1, height: '100%', maxHeight: '80vh', overflow: 'auto'}}>
            <Suspense fallback={<Typography variant="body2">Loading Quests...</Typography>}>
            <List>
                <ListSubheader sx={{p: 1}}>
                    <TextField
                        label="Search Quests"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={searchText}
                        onChange={handleSearch}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button startIcon={ <AddIcon /> } variant="contained" color="primary" fullWidth onClick={() => router.push("/quest/")}>
                        Create
                    </Button>
                </ListSubheader>
                {(filteredQuests || quests).map((quest: Quest, index: number) => (
                    <div key={quest._id} >
                        <ListItem
                            onClick={() => router.push(`/quest/${quest._id}`)}
                            sx={{ 
                                cursor: "pointer"
                             }}
                        >
                            <ListItemText 
                            sx={{
                                display: "flex",
                                flexFlow: "row",
                                justifyContent: "space-between"
                            }}
                            primary={
                                <Typography 
                                    variant="body1" 
                                    sx={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        mr: 2
                                    }}
                                >
                                    {quest.questName}
                                </Typography>
                            }
                            secondary={
                                <Typography 
                                    variant="body2" 
                                    color="textSecondary"
                                    sx={{ 
                                        width: '12rem',
                                        textAlign: "right"
                                    }}
                                >
                                    Status: {quest.status}
                                </Typography>
                            }
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