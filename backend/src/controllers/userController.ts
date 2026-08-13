import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AppError } from '../middlewares/error';
import { notifyAccountCreated } from '../utils/notifications';

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, role, firstName, lastName } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError(409, 'Un compte avec cet email existe déjà');
    }

    const user = await User.create({
      email,
      firstName,
      lastName,
      role,
      password: null,
      mustSetPassword: true,
    });
    await notifyAccountCreated(user.email, user.firstName);

    return res.status(201).json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
}