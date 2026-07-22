import mongoose, { Schema, Document } from 'mongoose';

export interface IContentHistory extends Document {
  user: mongoose.Types.ObjectId;
  prompt: string;
  response: string;
  toolUsed: string;
  language?: string;
  tone?: string;
  createdAt: Date;
}

const ContentHistorySchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  toolUsed: { type: String, required: true },
  language: { type: String },
  tone: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IContentHistory>('ContentHistory', ContentHistorySchema);
