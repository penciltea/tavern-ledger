import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata } from 'next';
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import type { Quest } from "@/components/quests/quest.interface";
import Quests from "@/components/quests/quests";
import ModeSwitch from '@/components/mode-switch';
import MainHeader from '@/components/main-header/main-header';
import QuestList from '@/components/quests/quest-list';


export const metadata: Metadata = {
  title: "Tavern Ledger | A Task Management App",
  description: "Generated by create next app"
};


async function getQuests(): Promise<Quest[]> {
  try {
    const result = await fetch(process.env.URL + '/api/quests', { method: 'GET' });

    if (!result.ok) {
      throw new Error("Failed to fetch quests");
    }
    
    return await result.json();
  } catch (error) {
    console.error("Error fetching quests:", error);
    return [];
  }
}

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const quests = await getQuests();

  return (
    <html lang="en">
        <body>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
                <MainHeader />
                <Container>
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <QuestList quests={quests} />
                    </Grid>
                    <Grid size={8}>
                      {children}
                    </Grid>
                  </Grid>
                </Container>
              <ModeSwitch />
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
    </html>
  );
}
