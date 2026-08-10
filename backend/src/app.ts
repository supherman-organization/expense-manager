import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import expenseRoutes from './routes/expenseRoutes';
import { errorHandler } from './middlewares/error';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/expenses', expenseRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', (_req, res) => {
    res.json({ status: 'ok'})
});

app.use('/api/auth', authRoutes);

// Gestion des erreurs
app.use(errorHandler);

export default app;

