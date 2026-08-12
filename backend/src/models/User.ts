import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export type UserRole = 'employee' | 'manager' | 'accounting';

export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    firstName: string;
    lastName: string;
    password: string | null;
    role: UserRole;
    mustSetPassword: boolean;
    createdAt: Date;
}

const userSchema = new Schema<IUser> (
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        password: { type: String, default: null, select: false },
        role: { 
            type: String, 
            enum: ['employee', 'manager', 'accounting'], 
            required: true 
        },
        mustSetPassword: { type: Boolean, default: true },
    },
{ timestamps: true },
);

userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    this.password = await bcrypt.hash(this.password, 10);   
});

export const User = model<IUser>('User', userSchema);