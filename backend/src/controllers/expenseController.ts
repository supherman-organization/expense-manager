import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { ExpenseNote, ExpenseStatus } from '../models/ExpenseNote';
import { AppError } from '../middlewares/error';

// Création d'une note
export async function createExpense(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, comment, amount, category, expenseDate } = req.body;
    const files = (req.files as Express.Multer.File[]) || [];
    const attachments = files.map((f) => f.filename);

    const note = await ExpenseNote.create({
      title,
      comment,
      amount,
      category,
      expenseDate,
      attachments,
      owner: req.user!.id,
    });

    return res.status(201).json(note);
  } catch (error) {
    next(error);
  }
}

// --- Liste des notes de l'utilisateur connecté (Page 2) ---
export async function getMyExpenses(req: Request, res: Response, next: NextFunction) {
  try {
    const notes = await ExpenseNote.find({ owner: req.user!.id }).sort({ createdAt: -1 });
    return res.json(notes);
  } catch (error) {
    next(error);
  }
}

// --- Détail d'une note (propriétaire ou rôle privilégié) ---
export async function getExpenseById(req: Request, res: Response, next: NextFunction) {
  try {
    const note = await ExpenseNote.findById(req.params.id).populate('owner', 'email role firstName lastName');
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

// --- Liste de toutes les notes, filtrée par rôle (Manager & Compta, Page 4) ---
export async function getAllExpenses(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user!;

    // La comptabilité ne voit que les notes validées ou traitées.
    const filter =
      user.role === 'accounting'
        ? { status: { $in: ['validated', 'processed'] as ExpenseStatus[] } }
        : {};

    const notes = await ExpenseNote.find(filter)
      .populate('owner', 'email role firstName lastName')
      .sort({ createdAt: -1 });

    return res.json(notes);
  } catch (error) {
    next(error);
  }
}

// --- Transitions de statut (machine à états) ---
type Transition = { from: ExpenseStatus; to: ExpenseStatus };

async function changeStatus(id: string, { from, to }: Transition, decisionComment?: string) {
  const note = await ExpenseNote.findById(id);
  if (!note) {
    throw new AppError(404, 'Note introuvable');
  }
  if (note.status !== from) {
    throw new AppError(
      409,
      `Transition impossible : la note est « ${note.status} », attendu « ${from} »`,
    );
  }
  note.status = to;
  if(decisionComment !== undefined) {
    note.decisionComment = decisionComment;
  }
  await note.save();
  return note;
}

// Manager : valide une note créée
export async function validateExpense(req: Request, res: Response, next: NextFunction) {
  try {
    const note = await changeStatus(String(req.params.id), { from: 'created', to: 'validated' },
    req.body.decisionComment,
  );
    return res.json(note);
  } catch (error) {
    next(error);
  }
}

// Manager : refuse une note créée
export async function refuseExpense(req: Request, res: Response, next: NextFunction) {
  try {
    const note = await changeStatus(String(req.params.id), { from: 'created', to: 'refused' }, 
    req.body.decisionComment,
  );
    return res.json(note);
  } catch (error) {
    next(error);
  }
}

// Comptabilité : marque une note validée comme traitée
export async function processExpense(req: Request, res: Response, next: NextFunction) {
  try {
    const note = await changeStatus(String(req.params.id), { from: 'validated', to: 'processed' });
    return res.json(note);
  } catch (error) {
    next(error);
  }
}