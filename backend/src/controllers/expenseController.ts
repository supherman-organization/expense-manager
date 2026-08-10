import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { ExpenseNote } from '../models/ExpenseNote';
import { AppError } from '../middlewares/error';

export async function createExpense(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, comment } = req.body;
    const files = (req.files as Express.Multer.File[]) || [];
    const attachments = files.map((f) => f.filename);

    const note = await ExpenseNote.create({
      title,
      comment,
      attachments,
      owner: req.user!.id,
    });

    return res.status(201).json(note);
  } catch (error) {
    next(error);
  }
}

export async function getMyExpenses(req: Request, res: Response, next: NextFunction) {
  try {
    const notes = await ExpenseNote.find({ owner: req.user!.id }).sort({ createdAt: -1 });
    return res.json(notes);
  } catch (error) {
    next(error);
  }
}

export async function getExpenseById(req: Request, res: Response, next: NextFunction) {
  try {
    const note = await ExpenseNote.findById(req.params.id).populate('owner', 'email role');
    if (!note) {
      throw new AppError(404, 'Note introuvable');
    }

    const owner = note.owner as unknown as { _id: Types.ObjectId; email: string };
    const user = req.user!;
    const isOwner = owner._id.toString() === user.id;
    const isPrivileged = user.role === 'manager' || user.role === 'accounting';

    if (!isOwner && !isPrivileged) {
      throw new AppError(403, 'Accès refusé');
    }

    return res.json(note);
  } catch (error) {
    next(error);
  }
}