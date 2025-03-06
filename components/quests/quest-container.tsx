
import { Suspense } from "react";
import { Container, Paper } from "@mui/material";
import Grid from '@mui/material/Grid2';
import QuestList from "@/components/quests/quest-list/quest-list";
import QuestDetails from "@/components/quests/quest-details/quest-details";
import { Quest } from '@/components/quests/quest.interface';

async function getQuests(): Promise<Quest[]> {
    if(process.env.URL !== undefined){
      const result = await fetch(process.env.URL + '/api/quests', {method: 'GET'});
      if(!result.ok){
        throw new Error("Failed to fetch quests");
      }
      return result.json();
    }
    return [];
  }
  
  async function Quests(){
    const quests = await getQuests();
  
    return <QuestList quests={quests} />
  }

  
  export default function QuestContainer(){
    return (
        <Container>
            <Grid container>
            {/* Left Panel: List */}
            <Grid size={4}>
                <Paper>
                <Suspense fallback={<p>Loading Quests...</p>}>
                    <Quests />
                </Suspense>
                </Paper>
            </Grid>
            
            { /* Right panel */}
            <Grid size={8}>
                <Paper>
                <QuestDetails />
                </Paper>
            </Grid>
            </Grid>
        </Container>
    )
  }