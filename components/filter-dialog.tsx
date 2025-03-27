'use client'
import { useState } from "react";
import { Button, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, Chip, Stack, Typography} from "@mui/material";
import type Filters from '@/interfaces/filter.interface';
import { QUEST_STATUS, QUEST_DIFFICULTY } from "@/constants/quest.constants";

interface FilterDialogProps {
    open: boolean;
    onClose: () => void;
    onApply: (filters: Filters) => void;
  }

  
  
  export default function FilterDialog({ open, onClose, onApply }: FilterDialogProps) {
    const [filters, setFilters] = useState<Filters>({
        //setting each filter to an array for multi-selection
        status: [],
        difficulty: [],
        questType: [],
        deadline: [],
      });
    
  
      const handleChipToggle = (key: keyof Filters, value: string) => {
        setFilters((prev) => {
          const currentValues = prev[key] as string[];
          if (!Array.isArray(currentValues)) return prev;
          const newValues = currentValues.includes(value)
            ? currentValues.filter((v: string) => v !== value) // Remove if already selected
            : [...currentValues, value]; // Add if not selected
          return { ...prev, [key]: newValues };
        });
      };
    
      const handleApply = () => {
        onApply(filters); // Pass the selected filters to the parent
        onClose();
      };
    
      const handleClear = () => {
        setFilters({
          status: [],
          difficulty: [],
          questType: [],
          deadline: [],
        });
      };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Filter Quests</DialogTitle>
        <DialogContent>
            {/* Status Filter */}
            <Typography variant="h6">Status</Typography>
            <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 2, mb: 2, flexWrap: "wrap" }}
            >
              {QUEST_STATUS.map((status) => (
                <Chip
                  key={status}
                  label={status}
                  variant={filters.status.includes(status) ? "filled" : "outlined"}
                  color={filters.status.includes(status) ? "primary" : "default"}
                  onClick={() => handleChipToggle("status", status)}
                />
              ))}
            </Stack>

            {/* Status Filter */}
            <Typography variant="h6">Difficulty</Typography>
            <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 2, mb: 2, flexWrap: "wrap" }}
            >
              {QUEST_DIFFICULTY.map((difficulty) => (
                <Chip
                  key={difficulty}
                  label={difficulty}
                  variant={filters.difficulty.includes(difficulty) ? "filled" : "outlined"}
                  color={filters.difficulty.includes(difficulty) ? "primary" : "default"}
                  onClick={() => handleChipToggle("difficulty", difficulty)}
                />
              ))}
            </Stack>
    
          {/* Other filters... */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClear} color="secondary">
            Clear All
          </Button>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleApply} variant="contained" color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  