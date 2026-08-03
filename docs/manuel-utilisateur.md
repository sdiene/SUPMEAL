# Manuel Utilisateur — SUPMEAL

## Bienvenue sur SUPMEAL

SUPMEAL est votre application de gestion de recettes et planification de repas. Ce guide vous explique comment utiliser toutes les fonctionnalités.

---

## 1. Premiers pas

### Créer un compte

1. Ouvrez `http://localhost:5173` dans votre navigateur
2. Cliquez sur **"S'inscrire"**
3. Renseignez votre nom, email et mot de passe (minimum 8 caractères)
4. Cliquez sur **"Créer mon compte"**
5. Si le serveur email est configuré, vérifiez votre boîte mail et cliquez sur le lien de vérification
6. Vous êtes automatiquement redirigé vers votre tableau de bord

> **Comptes de démonstration :**
> - `chacour@gmail.com` / `CourCha1` (propriétaire du cookbook de démo)
> - `lamine@gmail.com` / `Lamine1` (éditeur du cookbook de démo)

### Se connecter

1. Cliquez sur **"Se connecter"**
2. Entrez votre email et mot de passe
3. Ou cliquez sur **"Continuer avec Google"** si disponible

### Mot de passe oublié

1. Sur la page de connexion, cliquez sur **"Mot de passe oublié ?"**
2. Entrez votre adresse email
3. Cliquez sur le lien reçu par email
4. Choisissez un nouveau mot de passe

---

## 2. Le tableau de bord

Le tableau de bord vous donne un aperçu de votre activité :

- **Stats** : nombre de recettes, cookbooks et favoris
- **Recettes récentes** : vos 4 dernières recettes (cliquables)
- **Fil d'actualité** : les dernières recettes des cuisiniers que vous suivez
- **Mes cookbooks** : vos cookbooks partagés (cliquables)

---

## 3. Gestion des recettes

### Créer une recette

1. Cliquez sur **"Mes recettes"** dans la sidebar
2. Cliquez sur **"+ Nouvelle recette"**
3. Remplissez les informations :
   - **Titre** (obligatoire)
   - **Temps de préparation et cuisson** (en minutes)
   - **Portions**
   - **Source** (URL ou description)
   - **Tags** (séparés par virgules, ex: "Dessert, Facile")
   - **Image** (JPEG/PNG/WebP, max 5 Mo)
4. Ajoutez vos **ingrédients** (nom, quantité, unité)
5. Ajoutez les **étapes** de préparation
6. Cliquez sur **"Enregistrer la recette"**

### Modifier une recette

1. Ouvrez la recette
2. Cliquez sur **"✏️ Modifier"**
3. Modifiez les champs souhaités
4. Cliquez sur **"Enregistrer"**

### Supprimer une recette

1. Ouvrez la recette
2. Cliquez sur **"🗑️ Supprimer"**
3. Confirmez la suppression

### Ajouter aux favoris

- Cliquez sur l'étoile ☆ sur la carte ou dans le détail de la recette
- L'étoile devient ⭐ pour indiquer que la recette est en favori
- Retrouvez vos favoris dans la section **"Favoris"** de la sidebar

### Rendre une recette publique

1. Ouvrez la recette
2. Cliquez sur **"🔒 Privée"** pour la rendre publique (devient **"🌍 Publique"**)
3. La recette est maintenant visible par tous les utilisateurs dans la découverte

### Exporter une recette

1. Ouvrez la recette
2. Cliquez sur **"⬇️ Exporter"**
3. Choisissez **JSON** ou **CSV**
4. Le fichier est téléchargé automatiquement

### Ajouter au planning

1. Ouvrez la recette
2. Cliquez sur **"📅 Planning"**
3. La recette est ajoutée au dîner d'aujourd'hui

### Noter une recette

1. Ouvrez une recette
2. Faites défiler jusqu'à la section **"⭐ Notes"**
3. Cliquez sur le nombre d'étoiles souhaité (1 à 5)
4. La note est enregistrée et la moyenne se met à jour

### Commenter une recette

1. Ouvrez une recette
2. Faites défiler jusqu'à la section **"💬 Commentaires"**
3. Tapez votre commentaire dans le champ en bas
4. Cliquez sur **"Envoyer"**

---

## 4. Recherche et filtrage

### Rechercher dans mes recettes

1. Cliquez sur **"Mes recettes"**
2. Utilisez la barre de recherche en haut pour filtrer par titre
3. Cliquez sur **"🎛️ Filtres"** pour accéder aux filtres avancés :
   - **Cookbook** : filtrer par cookbook spécifique
   - **Ingrédient** : trouver les recettes avec un ingrédient précis
   - **Tags** : filtrer par tags (séparés par virgules)
   - **Temps de préparation/cuisson maximum**
   - **Favoris uniquement**
   - **Compatible mon profil** (selon vos allergies et régime)

### Découvrir des recettes publiques

1. Cliquez sur **"🌍 Découverte"** dans la sidebar
2. Onglet **"🍽️ Recettes publiques"** : recherchez par titre, ingrédient, tags ou temps
3. Onglet **"📚 Cookbooks publics"** : recherchez des cookbooks partagés par la communauté
4. Onglet **"👨‍🍳 Cuisiniers"** : recherchez des cuisiniers par nom

---

## 5. Cookbooks partagés

### Créer un cookbook

1. Cliquez sur **"Cookbooks"** dans la sidebar
2. Cliquez sur **"+ Nouveau cookbook"**
3. Donnez un nom et une description optionnelle
4. Cliquez sur **"Créer"**

### Inviter des membres

1. Ouvrez le cookbook
2. Cliquez sur l'onglet **"👥 Membres"**
3. Dans le formulaire **"Inviter un membre"** :
   - Entrez l'email de l'utilisateur
   - Choisissez son rôle :
     - **OWNER** : contrôle total
     - **EDITOR** : peut ajouter/modifier des recettes
     - **COMMENTER** : peut commenter les recettes
     - **READER** : lecture seule
4. Cliquez sur **"Inviter"**
5. L'utilisateur reçoit une notification dans son onglet **"🔔 Invitations"**

### Gérer les invitations reçues

1. Cliquez sur **"🔔 Invitations"** dans la sidebar
2. Vous voyez les invitations en attente avec le nom du cookbook et le rôle proposé
3. Cliquez sur **"✅ Accepter"** ou **"❌ Refuser"**

### Ajouter des recettes dans un cookbook

1. Ouvrez le cookbook
2. Dans l'onglet **"🍽️ Recettes"** :
   - **"+ Ajouter une recette existante"** : sélectionnez une de vos recettes perso
   - **"+ Créer une nouvelle recette"** : créez directement dans ce cookbook

### Messagerie du cookbook

1. Ouvrez le cookbook
2. Cliquez sur l'onglet **"💬 Messages"**
3. Tapez votre message et cliquez sur **"Envoyer"**
4. Les messages se rafraîchissent automatiquement toutes les 5 secondes

### Rendre un cookbook public

1. Ouvrez le cookbook (en tant que OWNER)
2. Cliquez sur **"🔒 Privé"** → devient **"🌍 Public"**
3. N'importe quel utilisateur peut maintenant voir vos recettes et les copier

---

## 6. Planning de repas

### Accéder au planning

Cliquez sur **"📅 Planning"** dans la sidebar.

### Naviguer entre les semaines

- **"← Semaine précédente"** : semaine passée
- **"Aujourd'hui"** : revenir à la semaine courante
- **"Semaine suivante →"** : semaine prochaine

### Ajouter une recette au planning

1. Cliquez sur **"+ Ajouter"** dans la case du jour et du repas souhaité
2. Sélectionnez une recette dans la liste déroulante
3. Cliquez sur **"Ajouter au planning"**

### Retirer une recette du planning

1. Survolez la recette dans le calendrier
2. Cliquez sur le **"×"** qui apparaît

### Générer la liste de courses

1. Cliquez sur **"🛒 Liste de courses"**
2. La liste agrégée de tous les ingrédients de la semaine s'affiche
3. Cochez les ingrédients au fur et à mesure de vos achats

---

## 7. Profils et communauté

### Voir son propre profil

Cliquez sur votre nom/avatar en bas de la sidebar.

Vous voyez :
- Vos statistiques (recettes publiques, abonnés, abonnements)
- Vos recettes publiques
- Vos cookbooks publics

### Découvrir des cuisiniers

1. Allez sur **"🌍 Découverte"** → onglet **"👨‍🍳 Cuisiniers"**
2. Recherchez par nom
3. Cliquez sur un cuisinier pour voir son profil

### Suivre un cuisinier

1. Ouvrez le profil d'un cuisinier
2. Cliquez sur **"+ Suivre"**
3. Ses nouvelles recettes apparaîtront dans votre **"📡 Fil d'actualité"**

### Fil d'actualité

1. Cliquez sur **"📡 Fil d'actualité"** dans la sidebar
2. Vous voyez les 20 dernières recettes publiques des cuisiniers que vous suivez

---

## 8. Import / Export

### Exporter toutes mes recettes

1. Allez dans **"⚙️ Paramètres"**
2. Section **"📦 Import / Export"**
3. Cliquez sur **"⬇️ Export JSON"** ou **"⬇️ Export CSV"**
4. Confirmez l'avertissement (données exportées en clair)
5. Le fichier est téléchargé

### Exporter une recette spécifique

1. Ouvrez la recette
2. Cliquez sur **"⬇️ Exporter"**
3. Choisissez **JSON** ou **CSV**

### Importer des recettes

1. Allez dans **"⚙️ Paramètres"**
2. Section **"📦 Import / Export"**
3. Cliquez sur **"⬆️ Importer un fichier"**
4. Sélectionnez un fichier JSON ou CSV compatible SUPMEAL
5. Les recettes sont importées dans vos recettes personnelles

---

## 9. Paramètres du compte

### Modifier son profil

1. Allez dans **"⚙️ Paramètres"**
2. Section **"Mon profil"** :
   - Modifiez votre nom
   - Choisissez votre régime alimentaire (végétarien, vegan, sans gluten, halal, kasher)
   - Renseignez vos allergies (séparées par virgules)
   - Définissez vos portions par défaut
3. Cliquez sur **"Sauvegarder"**

> **Note :** Vos allergies et régime alimentaire sont utilisés pour afficher des avertissements sur les recettes incompatibles et filtrer les résultats de recherche.

### Changer son mot de passe

1. Allez dans **"⚙️ Paramètres"**
2. Section **"Changer le mot de passe"**
3. Entrez votre mot de passe actuel
4. Entrez et confirmez votre nouveau mot de passe (minimum 8 caractères)
5. Cliquez sur **"Changer le mot de passe"**

### Supprimer son compte

1. Allez dans **"⚙️ Paramètres"**
2. Section **"⚠️ Zone dangereuse"**
3. Cliquez sur **"🗑️ Supprimer mon compte"**
4. Confirmez dans la popup
5. Toutes vos données sont supprimées définitivement

---

## 10. Mode sombre

Cliquez sur **"🌙 Mode sombre"** en bas de la sidebar pour basculer entre le mode clair et le mode sombre. Votre préférence est sauvegardée automatiquement.

---

## 11. Avertissements allergènes

Si vous avez renseigné des allergies dans vos paramètres, des badges **"⚠️ Allergène"** apparaissent automatiquement sur les recettes contenant des ingrédients correspondants. Un avertissement détaillé s'affiche aussi sur la page de détail de la recette.

