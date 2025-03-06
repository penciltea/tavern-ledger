import styles from "./main-header.module.scss";
import Box from '@mui/material/Box';

export default function MainHeader(){
    return (
        <Box component="header" className={styles.header}>
            <p>Tavern Ledger</p>
        </Box>
    )
}