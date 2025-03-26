'use client'
import useSWR from "swr";
import { Suspense, useState } from "react";
import { TextField, Button, List, ListItem, ListItemText, Paper, Typography, Divider, ListSubheader, Box, Pagination, Stack } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useQuestContext } from "@/contexts/quest";
import type { Quest, QuestList } from '@/components/quest.interface';
import { useRouter } from "next/navigation";
import { generateQuestKey } from "@/lib/swrKeys";

const API_URL = process.env.API_URL || "http://localhost:3000"; // Ensure the correct environment variable

const fetcher = (url: string) => fetch(url, { method: "GET" }).then((res) => res.json());

export default function QuestList(){
    const { searchText, setSearchText, currentPage, setCurrentPage } = useQuestContext();

    const router = useRouter();

    const queryKey = generateQuestKey(searchText, currentPage);   
    const { data, error } = useSWR(queryKey, fetcher);

    const quests = data?.quests || []; // Use an empty array as fallback
    const totalPages = data?.totalPages || 1;

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

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page); // Update the current page
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
                {quests.length === 0 ? (
                    <Typography sx={{ textAlign: "center", mt: 2 }}>
                    No quests found.
                    </Typography>
                ) : (
                    quests.map((quest: Quest, index: number) => (
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
                )
                ))}
            </List>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                    count={totalPages} // Total number of pages
                    page={currentPage} // Current active page
                    onChange={handlePageChange} // Event handler for page changes
                    color="primary"
                />
                </Box>
            </Suspense>
        </Paper>
    )
  }