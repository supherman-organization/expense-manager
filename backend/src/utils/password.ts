import { randomBytes } from 'crypto';

// Génère un mot de passe temporaire lisible, respectant la règle des 8+ caractères.
export function generateTempPassword(): string {
  return 'Tmp-' + randomBytes(9).toString('base64url');
}