import type { Quest } from "../quest.interface";

export default function QuestItem({ title, description, status }: Quest){
    return (
        <div>
            <p>{title}</p>
            <p>{description}</p>
            <p>{status}</p>
        </div>
    )
}