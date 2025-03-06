export interface Quest {
    title: string,
    description: string,
    status?: number
    _id?: number
}

export interface QuestList{
    quests: Quest[]
}
