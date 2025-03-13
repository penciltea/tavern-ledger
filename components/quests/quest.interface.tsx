export interface Quest {
    questName: string;
    description: string;
    status?: number;
    _id?: number;
    difficulty: string;
    deadlineType: string;
    deadline: null | string;
    questType?: string;
    reward?: string;
    questGiver?: string;
    location?: string;
    partyMembers?: string;
}

export interface QuestList{
    quests: Quest[]
}
