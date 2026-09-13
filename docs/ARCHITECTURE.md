# Documentation technique — ExpensePro

Ce document décrit l'architecture, les choix techniques, le modèle de données et
la configuration du projet.

> Pour démarrer l'application, voir le **README**.
> Pour le détail des points d'entrée de l'API, voir **`docs/API.md`**.
> Pour l'utilisation, voir **`docs/MANUEL-UTILISATEUR.md`**.

---

## 1. Vue d'ensemble

L'application est une solution **fullstack** découpée en deux parties, réunies
dans un même dépôt (*monorepo*) et orchestrées par Docker :

- un **backend** : une API REST (Node.js / Express) qui expose les données et
  applique les règles métier ;
- un **frontend** : une application React monopage (*SPA*) consommée dans le
  navigateur.

```
┌─────────────┐   HTTP / JSON    ┌──────────────┐   Mongoose   ┌───────────┐
│  Navigateur │ ───────────────► │  API Express │ ───────────► │  MongoDB  │
│ (React SPA) │ ◄─────────────── │   (backend)  │ ◄─────────── │           │
└─────────────┘   JWT + JSON     └──────────────┘              └───────────┘
```

Le navigateur (client React) communique avec l'API en HTTP/JSON. L'authentification
repose sur un **jeton JWT** transmis à chaque requête. L'API lit et écrit dans
**MongoDB** via Mongoose.

---

## 2. Stack technique

| Couche          | Technologies                                                                 |
| --------------- | ---------------------------------------------------------------------------- |
| Frontend        | React 19 + TypeScript, Vite, Tailwind CSS v4, React Router v7, Axios          |
| Backend         | Node.js + TypeScript, Express, Mongoose, bcrypt, jsonwebtoken, Multer, Zod    |
| Base de données | MongoDB                                                                       |
| Infrastructure  | Docker + Docker Compose                                                       |

---

## 3. Choix d'architecture et justifications

**Architecture REST + MVC (backend).** L'API suit le style **REST** (ressources
`users`, `expenses`, verbes HTTP, codes de statut) et une organisation **MVC**
adaptée : *models* (schémas Mongoose), *controllers* (logique métier), *routes*
(points d'entrée), complétés d'une couche de *middlewares*. Ce découpage isole
chaque responsabilité et facilite les tests.

**SPA React + API séparée.** Le frontend est totalement découplé du backend : il
ne consomme que l'API. Cela permet de faire évoluer l'interface sans toucher au
serveur, et de tester les deux indépendamment.

**MongoDB (base documentaire).** Les données (utilisateurs, notes de frais) se
modélisent naturellement en documents JSON, ce qui colle au format d'échange de
l'API. Mongoose apporte des schémas typés, de la validation et des hooks
(hachage du mot de passe, horodatage automatique).

**Authentification par JWT (*stateless*).** Le serveur ne conserve pas de session :
le jeton contient l'identité et le rôle, et se suffit à lui-même.

**Validation par Zod.** Chaque entrée est validée par un schéma avant d'atteindre
la logique métier — une barrière unique contre les données malformées.

**Conteneurisation Docker.** Toute l'infrastructure démarre avec une commande, de
façon **reproductible**, sans installer manuellement Node ou MongoDB.

---

## 4. Structure des dossiers

```
expense-manager/
├── docker-compose.yml          # Orchestration des services
├── .env / .env.example         # Secret JWT
├── README.md
├── docs/                       # API, architecture, manuel utilisateur
├── postman/                    # Collection de tests d'API
├── backend/
│   ├── Dockerfile
│   └── src/
│       ├── config/             # Connexion à la base
│       ├── models/             # Schémas Mongoose (User, ExpenseNote)
│       ├── controllers/        # Logique métier
│       ├── routes/             # Définition des endpoints
│       ├── middlewares/        # auth, rôles, validation, upload, erreurs
│       ├── validators/         # Schémas Zod
│       ├── utils/              # jwt, password
│       ├── seed/               # Création du compte manager
│       ├── app.ts              # Configuration Express
│       └── server.ts           # Point d'entrée
└── frontend/
    ├── Dockerfile / nginx.conf
    └── src/
        ├── components/         # Composants réutilisables
        ├── pages/              # Les pages de l'application
        ├── hooks/              # useFetch
        ├── context/            # AuthContext
        ├── services/           # Client Axios
        ├── utils/              # Libellés FR, formatage, styles
        └── App.tsx             # Routage
```

---

## 5. Backend

### 5.1 Architecture en couches

Une requête traverse toujours les mêmes couches, dans cet ordre :

```
Route → Middlewares (auth → rôle → validation) → Controller → Model → MongoDB
```

Chaque couche a une seule responsabilité : la **route** déclare le chemin et les
middlewares, les **middlewares** filtrent (authentification, autorisation,
validation), le **controller** exécute la logique, le **model** parle à la base.

### 5.2 Cycle d'une requête (exemple : créer une note de frais)

1. `POST /api/expenses` arrive sur la route.
2. `authenticate` vérifie le jeton JWT et renseigne `req.user`.
3. `upload` (Multer) traite les fichiers joints.
4. `validate` contrôle le corps de la requête via un schéma Zod.
5. Le `controller` crée la note en base et renvoie `201`.
6. Toute erreur est captée par le middleware d'erreurs centralisé.

### 5.3 Les middlewares

| Middleware      | Rôle                                                                    |
| --------------- | ----------------------------------------------------------------------- |
| `authenticate`  | Vérifie le JWT (`Authorization: Bearer …`), remplit `req.user`.         |
| `authorize`     | Restreint l'accès à certains rôles (`manager`, `accounting`).           |
| `validate`      | Valide le corps de la requête avec un schéma Zod, sinon renvoie `400`.  |
| `upload`        | Gère l'upload de fichiers (Multer) : type, taille (5 Mo), renommage.    |
| `errorHandler`  | Gestion d'erreurs centralisée : traduit toute erreur en réponse JSON.   |

---

## 6. Modèle de données

### Utilisateur (`User`)

| Champ             | Type    | Notes                                              |
| ----------------- | ------- | -------------------------------------------------- |
| `email`           | String  | unique, en minuscules, requis                      |
| `firstName`       | String  | requis                                             |
| `lastName`        | String  | requis                                             |
| `password`        | String  | haché (bcrypt), jamais renvoyé (`select: false`)   |
| `role`            | Enum    | `employee` \| `manager` \| `accounting`            |
| `mustSetPassword` | Boolean | `true` à la création → force le choix du mot de passe |

### Note de frais (`ExpenseNote`)

| Champ             | Type      | Notes                                                     |
| ----------------- | --------- | --------------------------------------------------------- |
| `title`           | String    | requis                                                    |
| `comment`         | String    | optionnel                                                 |
| `amount`          | Number    | requis, ≥ 0                                               |
| `category`        | Enum      | `meal`/`transport`/`accommodation`/`supplies`/`other`     |
| `expenseDate`     | Date      | date de la dépense                                        |
| `attachments`     | String[]  | fichiers justificatifs                                    |
| `status`          | Enum      | `created`/`validated`/`refused`/`processed`               |
| `decisionComment` | String    | motif du manager (validation / refus)                     |
| `owner`           | ObjectId  | référence vers l'utilisateur propriétaire                 |

### Machine à états d'une note

Le statut d'une note ne peut évoluer que selon des transitions autorisées :

```
                 ┌──────────► refused   (refus par un manager)
   created ──────┤
                 └──────────► validated ──────────► processed
                    (validation             (traitement par
                     par un manager)          la comptabilité)
```

Toute transition illégale (par exemple traiter une note non validée) renvoie un
code **409 Conflict**. Cette règle est appliquée **côté serveur**, qui reste
l'autorité sur l'état des données.

---

## 7. API REST

L'API expose les ressources `auth`, `users` et `expenses` selon le style REST.
Le détail complet des points d'entrée (méthodes, corps, réponses, codes de
statut) est décrit dans **`docs/API.md`**. En résumé :

- `auth` : connexion, définition du mot de passe, profil courant ;
- `users` : création de compte (réservée au manager) ;
- `expenses` : création et consultation de notes, workflow de
  validation/refus/traitement selon le rôle.

---

## 8. Authentification et sécurité

**Jetons JWT.** À la connexion, le serveur renvoie un JWT (valable 1 jour)
contenant uniquement `{ id, role }`. Le frontend le stocke et l'ajoute
automatiquement à chaque requête via un intercepteur Axios.

**Mots de passe.** Jamais stockés en clair : hachés par bcrypt via un hook
Mongoose avant chaque sauvegarde, et jamais renvoyés par l'API (`select: false`).

**Création de compte et mot de passe temporaire.** Un compte ne peut être créé que
par un manager. À la création, le serveur **génère un mot de passe temporaire**,
le hache, et le renvoie **en clair une seule fois** au manager (jamais stocké en
clair, jamais re-consultable). Le compte est marqué `mustSetPassword: true`.

**Première connexion.** Lors de sa première connexion, l'utilisateur est
**invité à définir son propre mot de passe** : le backend détecte le drapeau
`mustSetPassword`, dirige l'utilisateur vers l'écran dédié, qui appelle
`/auth/set-password`. Une fois le mot de passe défini, le drapeau passe à `false`
et l'utilisateur accède à l'application.

**Sécurité côté serveur.** Le frontend masque ou adapte l'interface selon le rôle,
mais **c'est le backend qui fait respecter les permissions** (middlewares
`authenticate` + `authorize`). Un appel direct non autorisé renvoie `401` ou `403`,
indépendamment de ce qu'affiche l'interface.

**Gestion des rôles.**

| Rôle           | Peut faire                                                            |
| -------------- | -------------------------------------------------------------------- |
| `employee`     | Créer et consulter ses propres notes.                                |
| `manager`      | + voir toutes les notes, valider/refuser, créer des comptes.         |
| `accounting`   | Voir les notes validées/traitées et les marquer comme traitées.      |

---

## 9. Validation et gestion des erreurs

**Validation (Zod).** Chaque corps de requête est validé par un schéma dédié
(dossier `validators/`) avant d'atteindre le controller. En cas d'entrée invalide,
l'API renvoie `400` avec un message clair.

**Erreurs centralisées.** Une classe `AppError(statusCode, message)` et un unique
middleware `errorHandler` traduisent toutes les erreurs en réponses JSON cohérentes.
Les controllers n'ont qu'à « lancer » l'erreur : le middleware s'occupe du reste
(statut HTTP, format de réponse, journalisation).

---

## 10. Frontend

**Structure.** Application React monopage (Vite + TypeScript). Le routage est géré
par React Router : chaque page correspond à une route, protégée selon le rôle.

**Authentification (`AuthContext`).** Un contexte React expose l'utilisateur
connecté et les fonctions `login` / `logout` / `setPassword` à toute l'application.
Le jeton JWT est conservé dans le `localStorage` du navigateur.

**Protection des routes (`ProtectedRoute`).** Les pages réservées vérifient le rôle
avant de s'afficher ; un accès non autorisé redirige vers l'accueil ou la connexion.

**Récupération de données (`useFetch`).** Un hook générique centralise les appels à
l'API (états de chargement, erreur, rechargement), réutilisé par toutes les pages
qui listent des données.

**Conventions de code.** Le code (fichiers, variables, fonctions) est **en anglais**,
l'interface visible **en français**. La traduction des valeurs techniques (statuts,
rôles, catégories) vers le français est centralisée dans un seul fichier
(`utils/labels.ts`).

---

## 11. Configuration

En mode Docker, l'ensemble est préconfiguré dans `docker-compose.yml`. Seule la
variable `JWT_SECRET` (dans le `.env` à la racine) est à renseigner.

| Variable            | Défini dans        | Rôle                                | Valeur par défaut                       |
| ------------------- | ------------------ | ----------------------------------- | --------------------------------------- |
| `JWT_SECRET`        | `.env` (racine)    | Secret de signature des tokens JWT  | *(à définir — obligatoire)*             |
| `MONGO_URI`         | `docker-compose`   | Connexion à MongoDB                 | `mongodb://mongo:27017/expense_manager` |
| `PORT`              | `docker-compose`   | Port du backend                     | `4000`                                  |
| `VITE_API_BASE_URL` | `frontend/.env`    | URL de l'API vue par le navigateur  | `http://localhost:4000/api`             |

**Secrets.** Le seul secret est `JWT_SECRET`, stocké dans le `.env` de la racine,
**non versionné** (voir `.gitignore`). Docker Compose le lit automatiquement au
lancement. Un `.env.example` sert de modèle.

**Base de données.** MongoDB tourne dans le conteneur `mongo`. La base
`expense_manager` est créée automatiquement, et un script de *seed* insère le
compte manager d'évaluation au démarrage. Les données sont persistées dans un
volume Docker (`mongo-data`).

---

## 12. Mode développement

Pour développer le frontend avec rechargement instantané (serveur Vite) :

```bash
# 1. Base + backend dans Docker
docker compose up mongo backend

# 2. Frontend en local, dans un autre terminal
cd frontend
npm install
npm run dev
```

L'interface de développement est alors servie sur `http://localhost:5173`.

> **Attention — port partagé.** Le conteneur frontend et le serveur Vite utilisent
> tous deux le port `5173`. Ne pas lancer `docker compose up --build` (qui démarre
> le frontend) en parallèle de `npm run dev`.

---

## 13. Workflow Git

Le développement suit une **branche par lot de travail** (`feature/…`), avec des
commits fréquents et préfixés (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`,
`style:`), fusionnés dans `main` via des *Pull Requests*. Le dépôt reste **privé**
pendant le développement et passe **public** au moment du rendu.