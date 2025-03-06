'use client'; 
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import type { Quest, QuestList } from "../quest.interface";
import QuestItem from "../quest-item/quest-item";
import styles from './quest-list.module.scss';

export default function QuestList({ quests }: QuestList){
    return (
        <List>
            {quests.map(({ _id, title, description, status}: Quest) => (
                <ListItem key={_id}>
                    <ListItemText onClick={() => {console.log("clicked")}}
                        primary={title}
                        secondary={description}
                    />
                </ListItem>
            ))}
        </List>
    )
}