import 'dotenv/config';
import express from 'express';
import {connectDB} from './config/db';

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function start() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
}
start();
