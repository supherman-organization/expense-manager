import { Schema, model, Document, Types } from 'mongoose';

export type ExpenseStatus = 'created' | 'validated' | 'refused' | 'processed';

export interface IExpenseNote extends Document {
  title: string;
  comment?: string;
  amount: number;
  category: string;
  expenseDate: Date;
  attachments: string[];
  decisionComment: string;
  status: ExpenseStatus;
  owner: Types.ObjectId;
  createdAt: Date;
}

const expenseNoteSchema = new Schema<IExpenseNote>(
  {
    title: { type: String, required: true, trim: true },
    comment: { type: String, default: '' },
    amount: { type: Number, required: true, min: 0 },
    category: { 
      type: String,
      enum: ['repas', 'transport', 'hébergement', 'fournitures', 'autres'],
      default: 'other,'
     },
    expenseDate: { type: Date, required: true },
    attachments: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['created', 'validated', 'refused', 'processed'],
      default: 'created',
    },
    decisionComment: { type: String, default: "" },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const ExpenseNote = model<IExpenseNote>('ExpenseNote', expenseNoteSchema);