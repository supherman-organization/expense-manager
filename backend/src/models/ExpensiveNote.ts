import { Schema, model, Document, Types } from 'mongoose';

export type ExpenseStatus = 'created' | 'validated' | 'refused' | 'processed' ;

export interface IExpensiveNote extends Document {
    title: string;
    comment?: string;
    attachment?: string[];
    status: ExpenseStatus;
    owner: Types.ObjectId;
    createdAt: Date;
}

const expensiveNoteSchema = new Schema<IExpensiveNote>(
    {
        title: { type: String, required: true, trim: true },
        comment: { type: String, default: '' },
        attachment: { type: [String], default: [] },
        status: {
            type: String,
            enum: ['created', 'validated', 'refused', 'processed'],
            default: 'created',
        },
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true },
);

export const ExpensiveNote = model<IExpensiveNote>('ExpensiveNote', expensiveNoteSchema);

