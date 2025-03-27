import Grid from '@mui/material/Grid2';
import QuestList from '@/components/quest-list';

export default function QuestListLayout({ children }: { children: React.ReactNode }){
    return (
        <Grid container spacing={1}>
            <Grid size={5}>
                <QuestList />
            </Grid>
            <Grid size={7}>
                {children}
            </Grid>
        </Grid>
    )
}