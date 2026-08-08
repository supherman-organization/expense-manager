import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';
import { AppError } from '../middlewares/error';

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError(401, 'Email ou mot de passe incorrect');
    }

    // Première connexion : l'utilisateur doit d'abord définir son mot de passe
    if (user.mustSetPassword || !user.password) {
      res.status(200).json({ mustSetPassword: true, email: user.email });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError(401, 'Email ou mot de passe incorrect');
    }

    const token = signToken({ id: user._id.toString(), role: user.role });
    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

export const setPassword: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError(404, 'Utilisateur introuvable');
    }
    if (!user.mustSetPassword) {
      throw new AppError(400, 'Le mot de passe a déjà été défini');
    }

    user.password = password; // haché automatiquement par le hook pre-save
    user.mustSetPassword = false;
    await user.save();

    const token = signToken({ id: user._id.toString(), role: user.role });
    res.status(200).json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      throw new AppError(404, 'Utilisateur introuvable');
    }
    res.json({ id: user._id, email: user.email, role: user.role });
  } catch (error) {
    next(error);
  }
};