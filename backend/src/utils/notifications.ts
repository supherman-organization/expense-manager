import { sendMail } from './mailer';
import { ExpenseStatus } from '../models/ExpenseNote';

export async function notifyAccountCreated(email: string, firstName: string): Promise<void> {
  const subject = 'Votre compte Expense Manager a été créé';
  const text =
    `Bonjour ${firstName},\n\n` +
    `Un compte vient d'être créé pour vous sur Expense Manager.\n` +
    `Connectez-vous avec votre email (${email}) pour choisir votre mot de passe.\n\n` +
    `L'équipe SUP Herman`;
  await sendMail(email, subject, text);
}

const STATUS_LABELS: Record<ExpenseStatus, string> = {
  created: 'créée',
  validated: 'validée',
  refused: 'refusée',
  processed: 'remboursée',
};

export async function notifyStatusChange(
    email: string,
    firstName: string,
    title: string,
    status: ExpenseStatus,
    decisionComment?: string,
):Promise<void> {
    const label = STATUS_LABELS[status];
    const subject = `Votre note de frais a été ${label}`;
    let text = `Bonjour ${firstName},\n\nVotre note de frais « ${title} » a été ${label}.\n`;
    if (decisionComment) {
        text += `\ncommentaire du manager : ${decisionComment}\n`;
    }
    text += `\n L'équipe SUP Herman`;
    await sendMail(email, subject, text);
}
    