import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: Number(process.env.SMTP_PORT) || 1025,
    secure: false,  // Mailpit accepte le SMTP en clair
});

export async function sendMail(to: string, subject: string, text: string):  Promise<void> {
    try{
        await transporter.sendMail({
            from: process.env.Mail_from || 'noreply@supherman.com',
            to, 
            subject,
            text,
        });
        console.log(`Email envoyé à $(to) : ${subject}`);
    } catch (err) {
        console.error("Echec de l'envoi, de l'email :", err)
    }
}