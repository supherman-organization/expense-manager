import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AppError } from '../middlewares/error';
import { generateTempPassword } from '../utils/password';

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, role, firstName, lastName } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError(409, 'Un compte avec cet email existe déjà');
    }

    //  On génère un mot de passe temporaire…
    const tempPassword = generateTempPassword();

    const user = await User.create({
      email,
      firstName,
      lastName,
      role,
      password: tempPassword,
      mustSetPassword: true, // force l'écran « choisir mon mot de passe » à la 1re connexion
    });

    // On renvoie le mot de passe temporaire EN CLAIR, une seule fois,
    // pour que le manager puisse le communiquer au nouvel employé.
    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      temporaryPassword: tempPassword,
    });
  } catch (error) {
    next(error);
  }
}