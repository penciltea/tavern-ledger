import mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import { QuestStatus, QuestDifficulty, QuestType, QUEST_STATUS, QUEST_DIFFICULTY, QUEST_TYPE } from "@/constants/quest.constants";
const { Schema } = mongoose;

export interface IQuest extends Document {
    _id: Types.ObjectId;
    questName: string;
    description: string;
    status: QuestStatus;
    difficulty: QuestDifficulty;
    deadlineType: 'none' | 'tomorrow' | 'threeDays' | 'oneWeek' | 'oneMonth' | 'custom';
    deadline: Date;
    questType: QuestType;
    reward: String,
    location: String,
    questGiver: String,
    partyMembers: String,
    createdAt: Date;
    updatedAt: Date;
  }

  const QuestSchema = new Schema<IQuest>(
    {
      questName: { type: String, required: true, trim: true },
      description: { type: String, required: true },
      status: { 
        type: String, 
        enum: QUEST_STATUS, 
        default: 'Not Started',
        required: false
      },
      difficulty: {
        type: String,
        enum: QUEST_DIFFICULTY,
        default: 'Easy', 
        required: false
      },
      deadlineType: {
        type: String,
        enum: ['none', 'tomorrow', 'threeDays', 'oneWeek', 'oneMonth', 'custom'],
        default: 'none',
        required: false
      },
      deadline: {type: Date, default: null, required: false},
      questType: {
        type: String,
        enum: QUEST_TYPE,
        default: 'Side Quest',
        required: false
      },
      reward: {type: String, required: false},
      location: {type: String, required: false},
      questGiver: {type: String, required: false},
      partyMembers: {type: String, required: false}
    },
    { timestamps: true, toJSON: { virtuals: true } }
  );

QuestSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Quest = mongoose.models.Quest || mongoose.model('Quest', QuestSchema, 'quests');
export default Quest;