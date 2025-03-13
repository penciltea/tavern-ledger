'use client'
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, TextField, Typography, Select, MenuItem, FormControl, 
  InputLabel, Alert } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

export default function QuestForm(){
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

    const [enteredValues, setEnteredValues] = useState({
        questName: '',
        description: '',
        status: "",
        difficulty: "",
        deadlineType: "",
        deadline: null as Dayjs | null,
        questType: "",
        reward: '',
        questGiver: '',
        location: '',
        partyMembers: ''
      });

    function handleInputChange(identifier: string, value: any) {
      setEnteredValues((prevValues) => ({
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
      setEnteredValues({
        ...enteredValues,
        deadlineType: value,
        deadline: deadlineOptions[value] || null,
      });
    };

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      setSuccessMessage("");
      setErrorMessage("");
  
      if (!enteredValues.questName || !enteredValues.description) {
        setErrorMessage("Quest Name and Description are required.");
        return;
      }
  
      try {
        const res = await fetch("/api/quests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...enteredValues, deadline: enteredValues.deadline?.toISOString() || null }),
        });
  
        const data = await res.json();
        if (res.ok) {
          setSuccessMessage("Quest created successfully!");
          setEnteredValues({
            questName: "",
            description: "",
            status: "",
            difficulty: "",
            deadlineType: "",
            deadline: null,
            questGiver: "",
            questType: "",
            reward: "",
            partyMembers: "",
            location: ""
          });

          router.push("/");
        } else {
          setErrorMessage(data.message || "Failed to create quest.");
        }
      } catch (error) {
        setErrorMessage("Something went wrong. Please try again.");
      }
    };


    return(
      <>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      
      <Typography variant="h3" gutterBottom> Create a New Quest </Typography>
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
                  onChange={(event) => handleInputChange('questName', event.target.value)}
                  value={enteredValues.questName}
              />
            
              <TextField
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                margin="normal"
                fullWidth
                onChange={(event) => handleInputChange('description', event.target.value)}
                value={enteredValues.description}
              />
              
              {/* Quest Status */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Quest Status</InputLabel>
                <Select name="questStatus" value={enteredValues.status} onChange={(event) => handleInputChange('status', event.target.value)}>
                  <MenuItem value="Not Started">Not Started</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </Select>
              </FormControl>


              {/* Difficulty Level */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Difficulty Level</InputLabel>
                <Select name="difficulty" value={enteredValues.difficulty} onChange={(event) => handleInputChange('difficulty', event.target.value)}>
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Normal">Normal</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                  <MenuItem value="Legendary">Legendary</MenuItem>
                </Select>
              </FormControl>

              {/* Deadline */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Deadline</InputLabel>
                <Select value={enteredValues.deadlineType} onChange={handleDeadlineChange}>
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="tomorrow">Tomorrow</MenuItem>
                  <MenuItem value="threeDays">In 3 Days</MenuItem>
                  <MenuItem value="oneWeek">In 1 Week</MenuItem>
                  <MenuItem value="oneMonth">In 1 Month</MenuItem>
                  <MenuItem value="custom">Custom Date</MenuItem>
                </Select>
              </FormControl>
              {enteredValues.deadlineType === "custom" && (
                <DatePicker value={enteredValues.deadline} onChange={(newValue) => setEnteredValues({ ...enteredValues, deadline: newValue })} />
              )}
            </Box>

            <Accordion>
              <AccordionSummary id="advanced-details" expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Advanced Details (Optional)</Typography>
              </AccordionSummary>
                <AccordionDetails>
                
                  {/* Quest Type*/}
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Quest Type</InputLabel>
                    <Select name="questType" value={enteredValues.questType} onChange={(event) => handleInputChange('questType', event.target.value)}>
                      <MenuItem value="Main Quest">Main Quest (Critical task)</MenuItem>
                      <MenuItem value="Side Quest">Side Quest (Optional but useful)</MenuItem>
                      <MenuItem value="Bounty">Bounty (Time-limited)</MenuItem>
                      <MenuItem value="Dungeon Raid">Dungeon Raid (Group effort)</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <TextField
                    label="Rewards"
                    name="rewards"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                    value={enteredValues.reward}
                    onChange={(event) => handleInputChange('reward', event.target.value)}
                  />

                  <TextField
                    label="Quest Giver"
                    name="questGiver"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                    value={enteredValues.questGiver}
                    onChange={(event) => handleInputChange('questGiver', event.target.value)}
                  />

                  <TextField
                    label="Location"
                    name="location"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                    value={enteredValues.location}
                    onChange={(event) => handleInputChange('location', event.target.value)}
                  />
              </AccordionDetails>
            </Accordion>

              <Button type="submit" variant="contained" sx={{ mt: 2 }} size="large">Submit</Button>
          </form>
        </LocalizationProvider>
      </>
    )
}