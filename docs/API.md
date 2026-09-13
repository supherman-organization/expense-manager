# Documentation de l'API REST — ExpensePro

Ce document décrit les points d'entrée (*endpoints*) de l'API du backend.

- **URL de base :** `http://localhost:4000/api`
- **Format des échanges :** JSON (sauf l'upload de fichiers, en `multipart/form-data`)
- **État de santé :** `GET http://localhost:4000/health` → `{ "status": "ok" }`

---

## Authentification

L'API utilise des **jetons JWT**. La plupart des routes exigent un jeton valide,
transmis dans l'en-tête HTTP :

```
Authorization: Bearer <jeton>
```

Le jeton est obtenu à la connexion (`POST /api/auth/login`) et reste valable
**1 jour**. Il contient l'identifiant et le rôle de l'utilisateur.

### Niveaux d'accès

| Niveau          | Signification                                            |
| --------------- | ------------------------------------------------------- |
| **public**      | Aucun jeton requis.                                     |
| **authentifié** | Jeton valide requis (n'importe quel rôle).              |
| **manager**     | Jeton d'un utilisateur au rôle `manager`.               |
| **comptabilité**| Jeton d'un utilisateur au rôle `accounting`.            |

---

## Format des erreurs

Toutes les erreurs suivent le même format :

```json
{ "message": "Description de l'erreur" }
```

| Code  | Signification                                             |
| ----- | -------------------------------------------------------- |
| `400` | Requête invalide (validation échouée).                   |
| `401` | Non authentifié (jeton absent, invalide ou expiré).      |
| `403` | Authentifié mais rôle insuffisant.                       |
| `404` | Ressource introuvable.                                   |
| `409` | Conflit (ex. email déjà utilisé, transition illégale).   |
| `500` | Erreur interne du serveur.                               |

---

## 1. Authentification

### `POST /api/auth/login` — public

Connexion par email et mot de passe.

**Corps de la requête :**

```json
{ "email": "manager@supherman.com", "password": "Suph3rm4n!" }
```

**Réponses :**

- `200` — connexion réussie :

```json
{
  "token": "eyJhbGciOi...",
  "user": { "id": "...", "email": "...", "firstName": "...", "lastName": "...", "role": "manager" }
}
```

- `200` — première connexion (mot de passe à définir), **sans jeton** :

```json
{ "mustSetPassword": true, "email": "employe@supherman.com" }
```

- `401` — email ou mot de passe incorrect.

---

### `POST /api/auth/set-password` — public

Définit le mot de passe d'un compte lors de sa première connexion.

**Corps de la requête :**

```json
{ "email": "employe@supherman.com", "password": "monNouveauMdp8" }
```

Le mot de passe doit contenir **au moins 8 caractères**.

**Réponses :**

- `200` — mot de passe défini, renvoie un jeton et l'utilisateur (même format que le login).
- `400` — le mot de passe a déjà été défini.
- `404` — utilisateur introuvable.

---

### `GET /api/auth/me` — authentifié

Renvoie les informations de l'utilisateur connecté.

**Réponse `200` :**

```json
{ "id": "...", "email": "...", "firstName": "...", "lastName": "...", "role": "employee" }
```

---

## 2. Utilisateurs

### `POST /api/users` — manager

Crée un nouveau compte. Un **mot de passe temporaire** est généré par le serveur
et renvoyé **en clair une seule fois** (il n'est jamais stocké en clair ni
re-consultable). Le nouvel utilisateur devra le changer à sa première connexion.

**Corps de la requête :**

```json
{
  "email": "nouveau@supherman.com",
  "firstName": "Jean",
  "lastName": "Dupont",
  "role": "employee"
}
```

`role` ∈ `employee` | `manager` | `accounting`.

**Réponses :**

- `201` — compte créé :

```json
{
  "user": { "id": "...", "email": "...", "firstName": "...", "lastName": "...", "role": "employee" },
  "temporaryPassword": "Tmp-AC3y3jXt6B36"
}
```

- `409` — un compte avec cet email existe déjà.

---

## 3. Notes de frais

### `GET /api/expenses/me` — authentifié

Renvoie les notes de frais de l'utilisateur connecté, triées de la plus récente
à la plus ancienne.

**Réponse `200` :** un tableau de notes.

---

### `POST /api/expenses` — authentifié

Crée une note de frais, avec pièces justificatives.
Format : **`multipart/form-data`** (ne pas fixer manuellement le `Content-Type`).

**Champs :**

| Champ         | Type      | Requis | Notes                                            |
| ------------- | --------- | ------ | ------------------------------------------------ |
| `title`       | texte     | oui    | Titre de la dépense.                             |
| `amount`      | nombre    | oui    | Montant en euros (≥ 0).                          |
| `expenseDate` | date      | oui    | Date de la dépense.                              |
| `category`    | texte     | non    | `meal`/`transport`/`accommodation`/`supplies`/`other`. |
| `comment`     | texte     | non    | Commentaire justificatif.                        |
| `attachments` | fichiers  | non    | Jusqu'à 5 fichiers, PDF/JPEG/PNG, 5 Mo max chacun. |

**Réponses :**

- `201` — la note créée (statut initial `created`).
- `400` — validation échouée ou fichier non conforme.

---

### `GET /api/expenses/:id` — propriétaire / manager / comptabilité

Renvoie le détail d'une note. Accessible à son propriétaire, aux managers et à
la comptabilité.

**Réponses :** `200` (la note) · `403` (accès refusé) · `404` (introuvable).

---

### `GET /api/expenses` — manager / comptabilité

Renvoie les notes de tous les employés (email du propriétaire inclus).

- **manager** : voit **toutes** les notes.
- **comptabilité** : voit **uniquement** les notes `validated` et `processed`
  (filtrage appliqué côté serveur).

**Réponse `200` :** un tableau de notes.

---

### `PATCH /api/expenses/:id/validate` — manager

Valide une note (`created` → `validated`).

**Corps (optionnel) :** `{ "decisionComment": "Motif de la décision" }`

**Réponses :** `200` (note mise à jour) · `409` (la note n'est pas au statut `created`).

---

### `PATCH /api/expenses/:id/refuse` — manager

Refuse une note (`created` → `refused`). Même corps et mêmes codes que `validate`.

---

### `PATCH /api/expenses/:id/process` — comptabilité

Marque une note comme traitée (`validated` → `processed`).

**Réponses :** `200` (note mise à jour) · `409` (la note n'est pas au statut `validated`).

---

## 4. Fichiers

### `GET /uploads/:fichier` — public

Sert un fichier justificatif uploadé (image ou PDF), servi en statique.

---

## Machine à états d'une note

Les routes de workflow respectent des transitions strictes ; toute transition
illégale renvoie `409` :

```
created ──validate──► validated ──process──► processed
   │
   └──refuse──► refused
```

---

