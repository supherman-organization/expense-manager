import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error("MONGO_URI est manquant dans les variables d'environnement");
    }
    try {
        await mongoose.connect(uri);
        console.log('Connecté à la base de données MongoDB');
    } catch (error) {
        console.error('Erreur lors de la connexion à la base de données MongoDB:', error);
        process.exit(1); // Arrête le processus en cas d'erreur de connexion
    }
}