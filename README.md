# ExpensePro — Gestion des notes de frais

Application interne de gestion des notes de frais pour **SUP Herman**.
Solution fullstack conteneurisée : API REST (Node.js / Express / MongoDB) +
interface React, orchestrée par Docker.

---

## Prérequis

L'application s'utilise **via Docker** — c'est la seule méthode prévue.
Toute l'infrastructure (application, API, base de données, emails) est
conteneurisée : **aucune installation de Node.js ou MongoDB n'est nécessaire.**

- **Docker** et **Docker Compose** 
- Lien de téléchargement ([Docker Desktop](https://www.docker.com/products/docker-desktop/))

Vérifier qu'ils sont présents et que Docker Desktop est démarré :

```bash
docker --version
docker compose version
```

---

## Installation 


#### 1. Cloner le projet avec cette commande: 
```bash
git clone https://github.com/supherman-organization/expense-manager.git
```

#### 2. Accéder au dossier et créer le fichier .env: 
```bash
cd expense-manager
cp .env.example .env 
```

#### 3. Génerer un token:
```bash
openssl rand -hex 32
``` 

#### 4. Mettre à jour le JWT dans le .env:
Copier le token généré dans `JWT_SECRET`

---

## Démarrer l'application 
Pour démarrer le projet, on lance:
```bash
docker compose up --build
```
Au **premier démarrage**, la base de données et le **compte manager**
sont créés automatiquement.

---

## Connexion 
#### 1. Pour accéder à l'interface de gestion des notes de frais:
Dans un navigateur, saisir l'adresse: 
- `http://localhost:5173`

#### 2. Saisir l'email et le mot de passe
- Email : `manager@supherman.com`
- Mot de passe : `Suph3rm4n!`


---

## Autres informations

| Service            | URL                       |
| ------------------ | ------------------------- |
| **Application**    | http://localhost:5173     |
| API backend        | http://localhost:4000/api |
| Emails (Mailpit)   | http://localhost:8025     |

**Arrêter l'application :**

```bash
docker compose down       # arrête les conteneurs
docker compose down -v    # + efface les données de la base
```