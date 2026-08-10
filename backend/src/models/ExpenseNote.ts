import { Schema, model, Document, Types } from 'mongoose';

export type ExpenseStatus = 'created' | 'validated' | 'refused' | 'processed';

export interface IExpenseNote extends Document {
  title: string;
  comment?: string;
  attachments: string[];
  status: ExpenseStatus;
  owner: Types.ObjectId;
  createdAt: Date;
}

const expenseNoteSchema = new Schema<IExpenseNote>(
  {
    title: { type: String, required: true, trim: true },
    comment: { type: String, default: '' },
    attachments: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['created', 'validated', 'refused', 'processed'],
      default: 'created',
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const ExpenseNote = model<IExpenseNote>('ExpenseNote', expenseNoteSchema);