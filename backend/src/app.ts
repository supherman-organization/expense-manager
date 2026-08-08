import exoress from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middlewares/error';

const app = exoress();

app.use(cors());
app.use(exoress.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok'})
});

app.use('/api/auth', authRoutes);

// Gestion des erreurs
app.use(errorHandler);

export default app;

