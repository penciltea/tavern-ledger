'use client'
import { useSWRConfig } from 'swr';
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, TextField, Typography, Select, MenuItem, FormControl, 
  InputLabel, Alert, Snackbar, Paper } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from "dayjs";

const API_URL = process.env.API_URL || "http://localhost:3000"; // Ensure the correct environment variable

export default function QuestForm(){
  const searchParams = useSearchParams();
  const questId = searchParams.get("id"); // Get ID from URL params
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { mutate: globalMutate } = useSWRConfig();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "error", "warning", "info"
  });

  const showSnackbar = (message: string, severity: "success" | "error" | "warning" | "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const [formData, setFormData] = useState({
    questName: "",
    description: "",
    status: "",
    difficulty: null,
    deadlineType: null,
    deadline: null as Dayjs | null,
    questType: null,
    reward: "",
    questGiver: "",
    location: "",
    partyMembers: ""
  });

  // Fetch existing quest data if questId is present
  useEffect(() => {
    if (!questId) return; // Only fetch if editing

    const fetchQuest = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/quests?id=${questId}`);
        if (!response.ok) throw new Error("Failed to fetch quest");
        
        const quest = await response.json();
        setFormData({
          questName: quest.questName || "",
          description: quest.description || "",
          status: quest.status || null,
          difficulty: quest.difficulty || null,
          deadlineType: quest.deadlineType || "custom",
          deadline: quest.deadline ? dayjs(quest.deadline) : null,
          questType: quest.questType || null,
          reward: quest.reward || "",
          questGiver: quest.questGiver || "",
          location: quest.location || "",
          partyMembers: quest.partyMembers || ""
        });
      } catch (error) {
        console.error("Error fetching quest:", error);
        showSnackbar("There was a problem fetching the quest details.", "warning");
      } finally {
        setLoading(false);
      }
    };

    fetchQuest();
  }, [questId]);

    function handleInputChange(identifier: string, value: any) {
      setFormData((prevValues) => ({
        ...prevValues,
        [identifier]: value,
      }));
    }

    const deadlineOptions: Record<string, Dayjs | null> = {
      tomorrow: dayjs().add(1, "day"),
      threeDays: dayjs().add(3, "days"),
      oneWeek: dayjs().add(1, "week"),
      oneMonth: dayjs().add(1, "month"),
      custom: null, // Custom date should be handled separately
    };
    
    const handleDeadlineChange = (event: any) => {
      const value = event.target.value;
      setFormData({
        ...formData,
        deadlineType: value,
        deadline: deadlineOptions[value] || null,
      });
      console.log(value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      const submittedData = {
        questName: formData.questName, 
        description: formData.description,
        status: formData.status,
        difficulty: formData.difficulty,
        deadlineType: formData.deadlineType,
        deadline: formData.deadline || null,
        reward: formData.reward || "",
        questType: formData.questType,
        questGiver: formData.questGiver || "",
        location: formData.location || "",
        partyMembers: formData.partyMembers || ""
      };

      if (!submittedData.questName || !submittedData.description) {
        showSnackbar("Quest name, description, and status are required", "error");
        return;
      }
        
      try {
        const response = await fetch(`/api/quests${questId ? `?id=${questId}` : ''}`, {
          method: questId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submittedData)
        });

        globalMutate(`${API_URL}/api/quests`);

        if (!response.ok) {
          showSnackbar(`Failed to ${questId ? "update" : "create"} quest: ${response.statusText}`, "error");
        }
        
        if(response.status === 201 || response.status === 200){
          const { _id } = await response.json();
          showSnackbar(`Quest ${questId ? "updated" : "created"} successfully!`, "success");
          router.push(`/quest/${_id}?success=true`); // Redirect to the created/updated quest  
        } else {
          showSnackbar(`Failed to ${questId ? "update" : "create"} quest: ${response.statusText}`, "error");
        }                
      } catch (err) {
          console.error("Error submitting form:", err);
          showSnackbar("Something went wrong. Please try again.", "error");
      }
    };


    return(
      <>
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Paper sx={{padding: 2, height: '100%', maxHeight: '80vh', overflow: 'auto'}}>
          <Button variant="text" onClick={() => router.back()} > <ArrowBackIosIcon fontSize="small" /> Go back </Button>
          
          <Typography variant="h3" gutterBottom>
            {questId ? "Edit Quest" : "Create a New Quest"}
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={handleSubmit}>
              <Box sx={{mb: 2}}>
                <Typography variant="h5">Basic Details (Required)</Typography>
                <TextField 
                    id="questName" 
                    label="Quest Name" 
                    variant="outlined" 
                    name="questName" 
                    margin="normal"
                    fullWidth
                    required
                    onChange={(event) => handleInputChange('questName', event.target.value)}
                    value={formData.questName}
                />
              
                <TextField
                  id="description"
                  name="description"
                  label="Description"
                  multiline
                  rows={4}
                  margin="normal"
                  fullWidth
                  required
                  onChange={(event) => handleInputChange('description', event.target.value)}
                  value={formData.description}
                />

                {/* Quest Status */}
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Quest Status</InputLabel>
                  <Select name="questStatus" value={formData.status} onChange={(event) => handleInputChange('status', event.target.value || null)}>
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Failed">Failed</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Accordion>
                <AccordionSummary id="extra-details" expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Extra Details (Optional)</Typography>
                </AccordionSummary>
                <AccordionDetails>

                  {/* Difficulty Level */}
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Difficulty Level</InputLabel>
                    <Select name="difficulty" value={formData.difficulty ?? ""} onChange={(event) => handleInputChange('difficulty', event.target.value || null)}>
                      <MenuItem value="Easy">Easy</MenuItem>
                      <MenuItem value="Normal">Normal</MenuItem>
                      <MenuItem value="Hard">Hard</MenuItem>
                      <MenuItem value="Legendary">Legendary</MenuItem>
                    </Select>
                  </FormControl>
                
                  {/* Quest Type*/}
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Quest Type</InputLabel>
                    <Select name="questType" value={formData.questType ?? "" } onChange={(event) => handleInputChange('questType', event.target.value || null)}>
                      <MenuItem value="Main Quest">Main Quest (Critical task)</MenuItem>
                      <MenuItem value="Side Quest">Side Quest (Optional but useful)</MenuItem>
                      <MenuItem value="Bounty">Bounty (Time-limited)</MenuItem>
                      <MenuItem value="Dungeon Raid">Dungeon Raid (Group effort)</MenuItem>
                    </Select>
                  </FormControl>

                  <Box>
                  {/* Deadline */}
                  <FormControl sx={{width: 1/2}} margin="normal">
                    <InputLabel>Deadline</InputLabel>
                    <Select name="deadlineType" value={formData.deadlineType ?? ""} onChange={(event) => handleDeadlineChange(event)}>
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="tomorrow">Tomorrow</MenuItem>
                      <MenuItem value="threeDays">In 3 Days</MenuItem>
                      <MenuItem value="oneWeek">In 1 Week</MenuItem>
                      <MenuItem value="oneMonth">In 1 Month</MenuItem>
                      <MenuItem value="custom">Custom Date</MenuItem>
                    </Select>
                  </FormControl>
                  {formData.deadlineType === "custom" && (
                    <DateTimePicker sx={{ mt: 2, pl: 2, width: 1/2 }} value={formData.deadline} onChange={(newValue) => setFormData({ ...formData, deadline: newValue })} />
                  )}
                  </Box>
                  <TextField
                    label="Quest Giver"
                    name="questGiver"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.questGiver}
                    onChange={(event) => handleInputChange('questGiver', event.target.value)}
                  />

                  <TextField
                    label="Location"
                    name="location"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.location}
                    onChange={(event) => handleInputChange('location', event.target.value)}
                  />

                  <TextField
                    label="Rewards"
                    name="rewards"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.reward}
                    onChange={(event) => handleInputChange('reward', event.target.value)}
                  />
                </AccordionDetails>
              </Accordion>

              <Button type="submit" variant="contained" sx={{ mt: 2, px: 8 }} size="large"> {questId ? "update" : "create"} </Button>
            </form>
          </LocalizationProvider>
        </Paper>
      </>
    )
}