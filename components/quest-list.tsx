'use client'
import useSWR from "swr";
import { Suspense, useState } from "react";
import { TextField, Button, List, ListItem, ListItemText, Paper, Typography, Divider, ListSubheader, Box, Pagination, MenuItem } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useQuestContext } from "@/contexts/quest";
import type { Quest, QuestList } from '@/interfaces/quest.interface';
import { useRouter } from "next/navigation";
import { defaultQuestFilters, generateQuestKey } from "@/lib/swrKeys";
import FilterDialog from "@/components/filter-dialog";

const fetcher = (url: string) => fetch(url, { method: "GET" }).then((res) => res.json());

export default function QuestList(){
    const router = useRouter();
    const { searchText, setSearchText, currentPage, setCurrentPage, filters, setFilters } = useQuestContext();
    const queryFilters = { search: searchText, page: currentPage, ...filters };

    const queryKey = generateQuestKey(queryFilters);
      
    const { data, error } = useSWR(queryKey, fetcher);

    const quests = data?.quests || []; // Use an empty array as fallback
    const totalPages = data?.totalPages || 1;

    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filteredQuests, setFilteredQuests] = useState(quests);
    const [isFilterDialogOpen, setFilterDialogOpen] = useState(false);

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

    const handleOpenFilterDialog = () => setFilterDialogOpen(true);
    const handleCloseFilterDialog = () => setFilterDialogOpen(false);

    const handleApplyFilters = (appliedFilters: any) => {
        setFilters(appliedFilters); // Save applied filters to state
        setFilterDialogOpen(false); // Close the dialog
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page); // Update the current page
    };

    return (
        <Paper sx={{p: 1, height: '100%', maxHeight: '80vh', overflow: 'auto'}}>
            <Suspense fallback={<Typography variant="body2">Loading Quests...</Typography>}>
                <List>
                    <ListSubheader sx={{p: 1}}>
                        <Button 
                            startIcon={ <AddIcon /> } 
                            variant="contained" color="primary" 
                            fullWidth 
                            onClick={() => router.push("/quest/")}
                            sx={{ mb: 2 }}
                        >
                            Create
                        </Button>
                        <TextField
                            label="Search Quests"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={searchText}
                            onChange={handleSearch}
                            sx={{ marginBottom: 2 }}
                        />
                        <Box
                            sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' }, // Stacks on small screens
                            gap: 2,
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={handleOpenFilterDialog}
                                sx={{ 
                                    mb: 2,
                                    width: 1/2
                                }}
                            >
                                Filter
                            </Button>
                            
                        </Box>
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
                {/* Filter Dialog */}
                <FilterDialog
                    open={isFilterDialogOpen}
                    onClose={handleCloseFilterDialog}
                    onApply={handleApplyFilters}
                />
            </Suspense>
        </Paper>
    )
  }