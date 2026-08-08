import 'dotenv/config';
import app from './app';
import { connectDB } from './config/db';
import { seedManager } from './seed/seedManager';

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();
  await seedManager();
  app.listen(PORT, () => {
    console.log(` Serveur démarré sur http://localhost:${PORT}`);
  });
}

start();