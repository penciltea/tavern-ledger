import mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
const { Schema } = mongoose;

export interface IQuest extends Document {
    _id: Types.ObjectId;
    questName: string;
    description: string;
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Failed';
    difficulty: 'Easy' | 'Normal' | 'Hard' | 'Legendary';
    deadlineType: 'none' | 'tomorrow' | 'threeDays' | 'oneWeek' | 'oneMonth' | 'custom';
    deadline: Date;
    questType: 'Main Quest' | 'Side Quest' | 'Bounty' | 'Dungeon Raid';
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
        enum: ['Not Started', 'In Progress', 'Completed', 'Failed'], 
        default: 'Not Started',
        required: false
      },
      difficulty: {
        type: String,
        enum: ['Easy', 'Normal', 'Hard', 'Legendary'],
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
        enum: ['Main Quest', 'Side Quest', 'Bounty', 'Dungeon Raid'],
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