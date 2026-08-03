# Documentation Technique — SUPMEAL

## 1. Présentation du projet

SUPMEAL est une application web de gestion de recettes et de planification de repas. Elle permet aux utilisateurs de créer, organiser et partager des recettes, de planifier leurs repas hebdomadaires et de découvrir des recettes publiques partagées par la communauté.

---

## 2. Architecture générale

L'application suit une architecture **trois tiers** stricte :

┌─────────────────┐ HTTP/REST ┌─────────────────┐ Prisma ORM ┌─────────────────┐
│ Client React │ ────────────────► │ Serveur Node │ ────────────────► │ PostgreSQL 16 │
│ (Vite) │ ◄──────────────── │ (Express) │ ◄──────────────── │ │
│ Port 5173 │ JSON │ Port 3000 │ │ Port 5432 │
└─────────────────┘ └─────────────────┘ └─────────────────┘


**Principe :** Le client ne contient aucune logique métier. Il se contente d'envoyer des requêtes HTTP à l'API REST et d'afficher les réponses JSON. Toute la logique (authentification, permissions, validation) est côté serveur.

---

## 3. Stack technique

### Backend
| Technologie | Version | Justification |
|---|---|---|
| Node.js | 20 LTS | Environnement JavaScript côté serveur, excellente compatibilité avec l'écosystème npm |
| Express | 4.x | Framework web minimaliste, flexible, très documenté, standard de facto pour les API REST Node.js |
| Prisma | 5.x | ORM type-safe avec migrations automatiques, génération du client, et support PostgreSQL natif |
| PostgreSQL | 16 | SGBD relationnel robuste, open-source, excellent support des types JSON et des requêtes complexes |
| bcrypt | 5.x | Hachage sécurisé des mots de passe avec salage automatique (10 rounds) |
| jsonwebtoken | 9.x | Authentification stateless via JWT, évite la gestion de sessions côté serveur |
| Passport.js | 0.7 | Middleware d'authentification modulaire, simplifie l'intégration OAuth2 |
| passport-google-oauth20 | 2.x | Stratégie OAuth2 Google pour Passport |
| Nodemailer | 6.x | Envoi d'emails transactionnels (vérification, réinitialisation mdp) via SMTP |
| Multer | 1.x | Gestion des uploads de fichiers (images de recettes) avec validation MIME et limite de taille |
| swagger-jsdoc + swagger-ui-express | — | Documentation API interactive générée automatiquement depuis les annotations JSDoc |
| csv-parse + csv-stringify | 5.x | Import/Export au format CSV |

### Frontend
| Technologie | Version | Justification |
|---|---|---|
| React | 18 | Bibliothèque UI déclarative, composants réutilisables, écosystème riche |
| Vite | 5.x | Bundler ultra-rapide avec HMR (Hot Module Replacement) pour le développement |
| React Router | 6.x | Routage côté client standard pour les SPA React |
| Tailwind CSS | 4.x | Framework CSS utilitaire permettant un développement UI rapide et cohérent sans CSS custom |
| Axios | 1.x | Client HTTP avec intercepteurs (ajout automatique du token JWT sur chaque requête) |

### Infrastructure
| Technologie | Justification |
|---|---|
| Docker & Docker Compose | Conteneurisation des 3 services (client, server, db), déploiement reproductible en une commande |
| node:20-alpine | Image Docker légère pour Node.js, réduit la taille des images |
| postgres:16-alpine | Image Docker officielle PostgreSQL légère |

---

## 4. Prérequis et variables d'environnement

### Prérequis
- Docker Desktop (version 4.x ou supérieure)
- Git

### Variables d'environnement

Copiez `.env.example` en `.env` et remplissez les valeurs :

```bash
cp .env.example .env
```

| Variable | Obligatoire | Description |
|---|---|---|
| `POSTGRES_USER` | ✅ | Nom d'utilisateur PostgreSQL |
| `POSTGRES_PASSWORD` | ✅ | Mot de passe PostgreSQL |
| `POSTGRES_DB` | ✅ | Nom de la base de données |
| `JWT_SECRET` | ✅ | Clé secrète JWT (minimum 32 caractères) — générez avec `openssl rand -hex 32` |
| `FRONTEND_URL` | ✅ | URL du frontend (ex: `http://localhost:5173`) |
| `GOOGLE_CLIENT_ID` | ❌ | Client ID Google OAuth2 (laisser `changeme` pour désactiver) |
| `GOOGLE_CLIENT_SECRET` | ❌ | Client Secret Google OAuth2 |
| `GOOGLE_CALLBACK_URL` | ❌ | URL de callback OAuth2 (ex: `http://localhost:3000/api/auth/google/callback`) |
| `SMTP_HOST` | ❌ | Hôte SMTP pour les emails (ex: `smtp.gmail.com`) |
| `SMTP_PORT` | ❌ | Port SMTP (ex: `587`) |
| `SMTP_USER` | ❌ | Adresse email SMTP |
| `SMTP_PASS` | ❌ | Mot de passe d'application SMTP |

> **Note :** Les fonctionnalités Google OAuth et envoi d'emails sont optionnelles. L'application fonctionne entièrement sans ces variables.

---

## 5. Guide de déploiement

### Déploiement local (développement)

```bash
# 1. Cloner le dépôt
git clone https://github.com/sdiene/SUPMEAL.git
cd SUPMEAL

# 2. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 3. Lancer l'application (build + migrations + seed + démarrage)
docker compose up --build

# L'application est disponible sur :
# - Frontend : http://localhost:5173
# - API :      http://localhost:3000
# - API Docs : http://localhost:3000/docs
```

### Comptes de test (créés automatiquement par le seed)

| Nom | Email | Mot de passe | Rôle |
|---|---|---|---|
| Chacour Diene | chacour@gmail.com | CourCha1 | OWNER du cookbook de démonstration |
| Lamine Diene | lamine@gmail.com | Lamine1 | EDITOR du cookbook de démonstration |

### Arrêt et nettoyage

```bash
# Arrêter les conteneurs
docker compose down

# Arrêter et supprimer les volumes (repart de zéro)
docker compose down -v

# Reconstruire après modification du code
docker compose up --build
```

---

## 6. Structure du projet

SUPMEAL/
├── docker-compose.yml # Orchestration des 3 services Docker
├── .env.example # Template des variables d'environnement
├── docs/
│ ├── technique.md # Ce document
│ └── manuel-utilisateur.md # Manuel utilisateur
├── server/
│ ├── Dockerfile
│ ├── package.json
│ ├── prisma/
│ │ ├── schema.prisma # Schéma de la base de données
│ │ ├── migrations/ # Historique des migrations SQL
│ │ └── seed.js # Données de démonstration
│ └── src/
│ ├── index.js # Point d'entrée Express
│ ├── controllers/ # Gestion des requêtes/réponses HTTP
│ ├── services/ # Logique métier pure
│ ├── routes/ # Définition des endpoints + annotations Swagger
│ ├── middlewares/ # Auth JWT, permissions cookbook
│ └── lib/ # Prisma client, Passport, Multer, Mailer, Swagger
└── client/
├── Dockerfile
├── package.json
├── vite.config.js
└── src/
├── App.jsx # Routing React
├── api/ # Appels API (axios)
├── components/ # Composants réutilisables
├── context/ # AuthContext (état global)
├── hooks/ # Hooks personnalisés (useAllergyCheck)
├── layouts/ # AppLayout (sidebar)
└── pages/ # Pages de l'application


---

## 7. Schéma de la base de données

┌─────────────┐ ┌──────────────────┐ ┌────────────┐
│ User │ │ CookbookMember │ │ Cookbook │
│─────────────│ │──────────────────│ │────────────│
│ id (PK) │──┐ │ id (PK) │ ┌──│ id (PK) │
│ email │ └───►│ userId (FK) │ │ │ name │
│ password │ │ cookbookId (FK)──│────┘ │ description│
│ name │ │ role │ │ isPublic │
│ oauthProvider│ └──────────────────┘ │ createdAt │
│ oauthId │ └────────────┘
│ diet │ ┌──────────────────┐ │
│ allergies │ │ Recipe │ │
│ defaultPortions│ │──────────────────│ │
│ emailVerified│ ┌──►│ id (PK) │◄─────────────┘
│ verifyToken │ │ │ title │
│ resetToken │ │ │ prepTime │
│ createdAt │ │ │ cookTime │
└─────────────┘ │ │ servings │
│ │ │ source │
│ │ │ imageUrl │
│ │ │ isFavorite │
└──────────┘ │ isPublic │
(userId FK) │ userId (FK) │
│ cookbookId (FK) │
│ createdAt │
└──────────────────┘
│
┌────────────────┼────────────────┐
│ │ │
┌──────────┐ ┌──────────────┐ ┌──────────┐
│Ingredient│ │ Step │ │ RecipeTag│
│──────────│ │──────────────│ │──────────│
│ id (PK) │ │ id (PK) │ │recipeId │
│ recipeId │ │ recipeId │ │tagId │
│ name │ │ order │ └──────────┘
│ quantity │ │ instruction │ │
│ unit │ └──────────────┘ ┌──────────┐
└──────────┘ │ Tag │
│──────────│
┌──────────┐ ┌──────────────┐ │ id (PK) │
│ Comment │ │ MealPlan │ │ name │
│──────────│ │──────────────│ │ type │
│ id (PK) │ │ id (PK) │ └──────────┘
│ recipeId │ │ userId (FK) │
│ userId │ │ recipeId(FK) │ ┌──────────┐
│ content │ │ date │ │ Rating │
│ createdAt│ │ mealType │ │──────────│
└──────────┘ └──────────────┘ │ id (PK) │
│ recipeId │
┌──────────────────┐ │ userId │
│CookbookInvitation│ │ value │
│──────────────────│ └──────────┘
│ id (PK) │
│ cookbookId (FK) │ ┌──────────┐
│ invitedById (FK) │ │ Follow │
│ invitedUserId(FK)│ │──────────│
│ role │ │ id (PK) │
│ status │ │followerId│
└──────────────────┘ │followingId│
└──────────┘
┌──────────┐
│ Message │
│──────────│
│ id (PK) │
│cookbookId│
│ userId │
│ content │
│ createdAt│
└──────────┘


---

## 8. Diagrammes UML

### Diagramme de séquence — Authentification

Client Serveur Base de données
│ │ │
│─── POST /api/auth/register ──────►│
│ │──── findUnique ──►│
│ │◄─── null ─────────│
│ │──── bcrypt.hash │
│ │──── create ──────►│
│ │◄─── user ─────────│
│ │──── sendEmail │
│◄── 201 + msg ──│ │
│ │ │
│─── POST /api/auth/login ─────────►│
│ │──── findUnique ──►│
│ │◄─── user ─────────│
│ │──── bcrypt.compare│
│ │──── jwt.sign │
│◄── 200 + token─│ │


### Diagramme de séquence — Création de recette

Client Serveur Base de données
│ │ │
│─── POST /api/recipes ────────────►│
│ (multipart/form-data) │
│ │──── requireAuth │
│ │──── multer save │
│ │──── recipe.create►│
│ │◄─── recipe ───────│
│◄── 201 + recipe│ │


### Diagramme de cas d'utilisation
                ┌─────────────────────────────┐
                │         SUPMEAL             │
                │                             │

Utilisateur ───────►│ S'inscrire / Se connecter │
non connecté │ Voir recettes publiques │
│ Voir cookbooks publics │
│ Voir profils publics │
└─────────────────────────────┘

                ┌─────────────────────────────┐
                │         SUPMEAL             │
                │                             │

Utilisateur ───────►│ Gérer ses recettes (CRUD) │
connecté │ Créer des cookbooks │
│ Inviter des membres │
│ Planifier ses repas │
│ Suivre des cuisiniers │
│ Noter des recettes │
│ Commenter des recettes │
│ Importer / Exporter │
└─────────────────────────────┘

                ┌─────────────────────────────┐
                │         SUPMEAL             │
                │                             │

Owner ─────────────►│ Gérer les membres │
cookbook │ Modifier les rôles │
│ Supprimer le cookbook │
│ Rendre public/privé │
└─────────────────────────────┘


---

## 9. Sécurité

- **Mots de passe** : hachés avec bcrypt (10 rounds de salage), jamais stockés en clair
- **Authentification** : JWT avec expiration 7 jours, validé à chaque requête protégée
- **Permissions** : système de rôles (OWNER/EDITOR/READER/COMMENTER) vérifié côté serveur à chaque appel
- **Uploads** : validation du type MIME (jpeg/png/webp uniquement) et limite de taille (5 Mo)
- **Variables sensibles** : aucun secret dans le code source, tout via variables d'environnement
- **OAuth2** : flux standard avec code d'autorisation, token jamais exposé côté client directement

---

## 10. API Documentation

L'API REST est documentée et testable interactivement via Swagger UI :

http://localhost:3000/docs


### Endpoints principaux

| Méthode | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Inscription | Non |
| POST | `/api/auth/login` | Connexion | Non |
| GET | `/api/auth/me` | Profil connecté | Oui |
| GET | `/api/auth/google` | OAuth2 Google | Non |
| POST | `/api/auth/forgot-password` | Demande reset mdp | Non |
| POST | `/api/auth/reset-password` | Reset mdp | Non |
| GET | `/api/recipes` | Mes recettes | Oui |
| POST | `/api/recipes` | Créer recette | Oui |
| GET | `/api/recipes/:id` | Détail recette | Oui |
| PUT | `/api/recipes/:id` | Modifier recette | Oui |
| DELETE | `/api/recipes/:id` | Supprimer recette | Oui |
| PATCH | `/api/recipes/:id/favorite` | Toggle favori | Oui |
| PATCH | `/api/recipes/:id/public` | Toggle public | Oui |
| POST | `/api/recipes/:id/rating` | Noter recette | Oui |
| GET | `/api/recipes/:id/comments` | Commentaires | Oui |
| POST | `/api/recipes/:id/comments` | Commenter | Oui |
| GET | `/api/cookbooks` | Mes cookbooks | Oui |
| POST | `/api/cookbooks` | Créer cookbook | Oui |
| GET | `/api/cookbooks/:id` | Détail cookbook | Oui |
| POST | `/api/cookbooks/:id/invite` | Inviter membre | Oui |
| GET | `/api/cookbooks/public` | Cookbooks publics | Oui |
| GET | `/api/search` | Recherche filtrée | Oui |
| GET | `/api/public/recipes` | Recettes publiques | Non |
| GET | `/api/mealplan` | Planning semaine | Oui |
| POST | `/api/mealplan` | Ajouter au planning | Oui |
| GET | `/api/mealplan/shopping-list` | Liste de courses | Oui |
| GET | `/api/profiles` | Chercher cuisiniers | Oui |
| GET | `/api/profiles/:id` | Profil public | Oui |
| POST | `/api/profiles/:id/follow` | Follow/Unfollow | Oui |
| GET | `/api/profiles/feed` | Fil d'actualité | Oui |
| GET | `/api/export` | Exporter recettes | Oui |
| POST | `/api/import` | Importer recettes | Oui |
| GET | `/api/invitations` | Mes invitations | Oui |
| POST | `/api/invitations/:id/respond` | Répondre invitation | Oui |

