import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AppError } from '../middlewares/error';

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError(409, 'Un compte avec cet email existe déjà');
    }

    const user = await User.create({
      email,
      role,
      password: null,
      mustSetPassword: true,
    });

    return res.status(201).json({
      id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
}