import { Container, Paper } from "@mui/material";
import Grid from '@mui/material/Grid2';
import MainHeader from "@/components/main-header/main-header";
import QuestContainer from "@/components/quests/quest-container";


export default function HomePage(){
  return (
    <>
      <MainHeader /> 
      <QuestContainer />
    </>
  );
}

/*
<MainHeader /> 
      <main className={styles.main}>
          <Drawer />
          <QuestList quests={quests} />
          <QuestDetails />
      </main>
*/