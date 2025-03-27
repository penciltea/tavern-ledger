export const QUEST_STATUS = ["Not Started", "In Progress", "Completed", "Failed"] as const;
export const QUEST_TYPE = ["Main Quest", "Side Quest", "Bounty", "Dungeon Raid"] as const;
export const QUEST_DIFFICULTY = ["Easy", "Normal", "Hard", "Legendary"];

export type QuestStatus = (typeof QUEST_STATUS)[number];
export type QuestType = (typeof QUEST_TYPE)[number];
export type QuestDifficulty = (typeof QUEST_DIFFICULTY)[number];
