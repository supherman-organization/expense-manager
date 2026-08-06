import 'dotenv/config';
import mongoose from 'mongoose';
import{ connectDB } from '../config/db';
import { User } from '../models/User';

const MANAGER_EMAIL = 'manager@supherman.com';
const MANAGER_PASSWORD = 'Suph3rm4n!';

export async function seedManager(): Promise<void> {
    const existing = await User.findOne({ email: MANAGER_EMAIL });
    if (existing) {
        console.log('Le manager existe déjà dans la base de données. Aucune action de seed nécessaire.');
        return;
    }
    await User.create({
        email: MANAGER_EMAIL,
        password: MANAGER_PASSWORD, //Hashage automatique grâce au middleware pre('save') dans le modèle User
        role: 'manager',
        mustSetPassword: false,  // Le manager n'a pas besoin de changer son mot de passe initial
    });

    console.log(' le compte Manager créé avec succès dans la base de données:', MANAGER_EMAIL);
}

// Si ce fichier est exécuté, on se connecte à la base de données, on exécute le seed, puis on se déconnecte.
if (require.main === module) {
    (async () => {
        await connectDB();
        await seedManager();
        await mongoose.disconnect();
        process.exit(0);
    })();
}