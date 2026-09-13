# ExpensePro — Gestion des notes de frais

Application interne de gestion des notes de frais pour **SUP Herman**.
Solution fullstack conteneurisée : API REST (Node.js / Express / MongoDB) +
interface React, orchestrée par Docker.

## Prérequis

L'application s'utilise **via Docker** — c'est la seule méthode prévue.
Toute l'infrastructure (application, API, base de données) est conteneurisée :
aucune installation de Node.js ou MongoDB n'est nécessaire.

- **Docker** et **Docker Compose**
- Lien de téléchargement : [Docker Desktop](https://www.docker.com/products/docker-desktop/)

Vérifier qu'ils sont présents et que Docker Desktop est démarré :

```bash
docker --version
docker compose version
```

## Installation

**1. Cloner le projet :**

```bash
git clone https://github.com/supherman-organization/expense-manager.git
```

**2. Accéder au dossier et créer les fichiers `.env` :**

```bash
cd expense-manager
cp .env.example .env
cp frontend/.env.example frontend/.env
```

**3. Générer un secret :**

```bash
openssl rand -hex 32
```

**4. Mettre à jour le secret dans le `.env` :**

Copier le secret généré dans la variable `JWT_SECRET` du fichier `.env` à la racine.

## Démarrer l'application

Pour démarrer le projet, on lance :

```bash
docker compose up --build
```

Au **premier démarrage**, le compte manager d'évaluation est créé automatiquement :
**aucune commande de seed n'est à lancer.**

## Connexion

**1.** Dans un navigateur, saisir l'adresse :

```
http://localhost:5173
```

**2.** Saisir l'email et le mot de passe :

- Email : `manager@supherman.com`
- Mot de passe : `Suph3rm4n!`

## Documentation

Les instructions d'installation, la configuration des variables d'environnement,
la configuration de la base de données et le lancement de l'application figurent
dans ce README. Les trois autres livrables sont dans le dossier `docs/` :

| Document                    | Contenu                       |
| --------------------------- | ----------------------------- |
| `docs/API.md`               | Documentation de l'API REST   |
| `docs/ARCHITECTURE.md`      | Documentation technique       |
| `docs/MANUEL-UTILISATEUR.md`| Manuel utilisateur            |

Ce découpage a été retenu pour la lisibilité : chaque document s'adresse à un
lecteur différent — administrateur système, développeur, utilisateur final.

## Autres informations

| Service        | URL                          |
| -------------- | ---------------------------- |
| Application    | http://localhost:5173        |
| API backend    | http://localhost:4000/api    |
| État de l'API  | http://localhost:4000/health |

**Variables d'environnement :**

| Fichier         | Variable            | Rôle                                              |
| --------------- | ------------------- | ------------------------------------------------- |
| `.env` (racine) | `JWT_SECRET`        | Clé de signature des jetons d'authentification    |
| `frontend/.env` | `VITE_API_BASE_URL` | URL de l'API vue par le navigateur (défaut fourni)|

**Arrêter l'application :**

```bash
docker compose down       # arrête les conteneurs
docker compose down -v    # + efface les données de la base
```

**Repartir d'une base vierge :**

```bash
docker compose down -v
docker compose up -d --build
```

Le compte manager est recréé automatiquement au démarrage.