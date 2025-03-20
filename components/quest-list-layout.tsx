import Grid from '@mui/material/Grid2';
import QuestList from '@/components/quest-list';

export default function QuestListLayout({ children }: { children: React.ReactNode }){
    return (
        <Grid container spacing={1}>
            <Grid size={4}>
                <QuestList />
            </Grid>
            <Grid size={8}>
                {children}
            </Grid>
        </Grid>
    )
}