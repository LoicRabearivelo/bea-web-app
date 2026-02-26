# Coordinateur de Vie — Application Web Périnatale pour La Réunion 🌺

> Plateforme d'accompagnement périnatal des **1 000 premiers jours** (de la pré-conception à la petite enfance), conçue spécifiquement pour **La Réunion (974)**.

## Stack technique

| Technologie | Version |
|-------------|---------|
| React | 19 |
| React Router | 7 |
| Font Awesome | 7 |
| Create React App | — |

**Pas de serveur backend** — toutes les données sont en mémoire (données locales simulées), sauf le chatbot IA qui appelle une API externe.

---

## Rôles utilisateur

| Rôle | Description |
|------|-------------|
| **Patient** | Parents / familles traversant le parcours périnatal (fertilité, grossesse, post-partum) |
| **Professionnel** | Professionnels de santé (sage-femme, pédiatre, doula, consultante en lactation, ostéopathe, psychologue périnatale) |
| **Visiteur** | Utilisateur non connecté, accès limité |

### Comptes de démonstration

| Profil | Email | Mot de passe |
|--------|-------|-------------|
| Patient Camille | `camille.fontaine@email.re` | `motdepasse123` |
| Patient Laura | `laura.riviere@email.re` | `motdepasse456` |
| Professionnel | `mc.hoarau@email.re` | `prosecret123` |

---

## Fonctionnalités implémentées

### 1. Authentification & Routage

- Système d'authentification via React Context (`connecter`, `déconnecter`, `mettreAJourUtilisateur`)
- Routes protégées par rôle (patient ou professionnel)
- Routes publiques avec redirection automatique si déjà connecté
- Redirection catch-all vers `/`

### 2. Page d'accueil

- Section héro avec CTA d'inscription / connexion
- Présentation du continuum **1 000 jours** (Avant, Pendant, Après)
- Grille de 6 fonctionnalités principales
- Section spécifique La Réunion (zones géographiques : Hauts, Nord, Sud, Est, Ouest)
- Footer

### 3. Inscription

- Sélection du type de profil (Patient / Professionnel) via cartes cliquables
- Formulaire : nom, email, mot de passe, confirmation
- Validation (longueur min 6 caractères, correspondance des mots de passe)
- Redirection après inscription : Patient → Questionnaire d'onboarding · Professionnel → Profil

### 4. Connexion

- Formulaire email / mot de passe avec validation
- Boutons de connexion rapide pour les comptes de démonstration
- Spinner de chargement

### 5. Questionnaire d'onboarding (Patient)

Assistant en **5 étapes** avec barre de progression :

| Étape | Contenu |
|-------|---------|
| 1 | **Zone géographique** — Nord, Sud, Est, Ouest, Hauts |
| 2 | **Étape périnatale** — Désir de fertilité, T1, T2, T3, Post-natal + semaines d'aménorrhée |
| 3 | **Besoins** — Sélection multiple parmi 10 options (suivi médical, préparation naissance, nutrition, santé mentale, post-partum, allaitement, fertilité, couple, pédiatrie, suivi cycle) |
| 4 | **Projet de naissance** — Type d'accouchement, rang de grossesse, antécédents médicaux |
| 5 | **Récapitulatif** — Résumé de toutes les réponses avant validation |

Les données alimentent le profil patient et l'algorithme de recommandation de professionnels.

### 6. Barre de navigation

- Responsive avec menu hamburger mobile
- Fermeture automatique au clic extérieur ou touche Échap
- 3 états de navigation distincts : Visiteur · Patient · Professionnel
- Mise en surbrillance du lien actif

### 7. Tableau de bord Patient

- Message de bienvenue personnalisé selon le stade de grossesse
- Badges des besoins identifiés
- **6 raccourcis rapides** : Suivi, Annuaire, Messages, Articles, Communauté, Fiche enfant
- **Professionnels recommandés** — top 3 via algorithme de scoring (zone, besoins, projet de naissance, antécédents, stade, avis)
- **Articles recommandés** — 4 derniers articles
- **Barre latérale** :
  - Rendez-vous à venir (statut confirmé/en attente)
  - Programme diététique personnalisé avec aliments locaux réunionnais
  - Liens de suivi contextuels selon le stade périnatal

### 8. Tableau de bord Professionnel

- En-tête de bienvenue avec nom et spécialité
- **4 KPIs** : rendez-vous du jour, demandes en attente, rendez-vous à venir, messages non lus
- **3 onglets** :
  - **Agenda** — rendez-vous du jour + à venir, actions confirmer/annuler
  - **Demandes** — demandes de rendez-vous en attente avec boutons confirmer/refuser
  - **Avis** — liste des avis patients avec notes en étoiles

### 9. Annuaire des professionnels

- **Filtres** : recherche textuelle (nom/spécialité), filtre par spécialité, filtre par zone géographique
- Bouton de réinitialisation des filtres
- Cartes résultat avec avatar, nom, badge spécialité, localisation, note moyenne en étoiles
- Détails dépliables : coordonnées (téléphone, email), spécialisations, disponibilités
- Section avis patients avec auteur, étoiles, date, commentaire
- **Prise de rendez-vous** (patients uniquement) — modale avec date, heure, motif + message de confirmation
- Compteur de résultats

### 10. Module de suivi santé (Patient)

Système de suivi en **7 onglets** :

| Onglet | Fonctionnalités |
|--------|----------------|
| **Grossesse** | Saisie : semaine d'aménorrhée, poids, tension, humeur, notes. Historique trié par entrée. |
| **Cycle menstruel** | Saisie : mois, durée du cycle, dates début/fin, ovulation estimée, symptômes. Historique avec badges de symptômes. |
| **Santé mentale** | Score bien-être (1-10), sélecteur d'humeur, journal libre. Codes couleur rouge/jaune/vert. Notice d'urgence : 3114 ou messagerie. |
| **Allaitement** | Nombre de tétées, durée moyenne, difficultés, notes. Historique. |
| **Couple** | Score communication (1-10), qualité de communication (excellent à très difficile), réflexions personnelles. |
| **Diététique** | Programme alimentaire personnalisé : objectif + recommandations avec aliments locaux réunionnais (rougail, brèdes, chouchou…). |
| **Post-natal** | Fiches info : saignements post-partum, sommeil/récupération, santé émotionnelle, visite post-natale obligatoire. |

### 11. Messagerie

- Interface en deux panneaux : liste des conversations (gauche) + fil de discussion (droite)
- Regroupement des messages par interlocuteur avec aperçu du dernier message
- Création de nouvelle conversation avec sélection d'un professionnel
- Bulles de message envoyé/reçu, défilement automatique vers le bas
- Formatage relatif des dates (Aujourd'hui, Hier, date complète)
- Fonctionne pour les patients et les professionnels

### 12. Communauté & FAQ

**Deux onglets :**

- **FAQ** :
  - Accordéon de questions/réponses
  - Questions répondues avec auteur expert
  - Questions sans réponse avec mention « en attente d'un professionnel »
  - Soumission de nouvelles questions (utilisateurs connectés)

- **Forum** :
  - Publication de sujets avec titre, catégorie (Général, Grossesse, Accouchement, Post-partum, Allaitement, Bébé) et contenu
  - Carte de message avec avatar auteur, date, badge catégorie
  - Système de réponses en fil sous chaque sujet
  - Réservé aux utilisateurs connectés pour poster/répondre

### 13. Articles & Contenu éducatif

- Filtrage par catégorie : Grossesse, Nutrition, Santé mentale, Accouchement, Post-partum, Allaitement
- Grille de cartes : icône catégorie, date, titre, extrait (150 caractères), auteur, bouton « Lire »
- Vue article complète : badge catégorie, date, auteur, temps de lecture, contenu intégral (rendu par paragraphes), tags
- Bouton retour vers la liste

### 14. Fiche enfant

- **Support multi-enfant** — onglets pour basculer entre les enfants + bouton d'ajout
- **Formulaire de création** : prénom, date de naissance, poids, taille, périmètre crânien, mode d'alimentation (allaitement exclusif, mixte, biberon, diversification), notes
- **Vue détaillée** :
  - En-tête avec calcul automatique de l'âge (jours/mois/années), poids, taille, périmètre crânien, mode d'alimentation
  - **Suivi sommeil** — durée (heures), qualité (excellent/bon/moyen/difficile), historique
  - **Suivi repas** — type, quantité, heure, historique
  - **Courbe de croissance** — affichage des dernières mesures
  - **Jalons de développement** — checklist : premier sourire, préhension, babillage, tenue assise, premiers pas

### 15. Profil utilisateur

- Carte d'identité : avatar, nom, badge rôle, localisation géographique
- Bascule édition / consultation pour tous les champs
- **Champs communs** : prénom, nom, email, téléphone, adresse, zone géographique
- **Champs patient** : stade de grossesse, date prévue d'accouchement
- **Champs professionnel** : spécialité, numéro RPPS, description professionnelle
- Sauvegarde avec notification de succès
- Bouton de déconnexion

### 16. Chatbot IA « Béa » 🌺

- **Bouton flottant** visible uniquement pour les patients connectés, avec badge de notification pour les nouveaux utilisateurs
- **Formulaire de qualification pré-chat** :
  - Âge (14-55), stade périnatal (6 options), commune (24 communes de La Réunion)
  - Validation avec messages d'erreur
- **Interface de chat** :
  - Message d'accueil de Béa
  - Appel API vers `POST https://bea-chatbot.onrender.com/chat` avec contexte profil (âge, stade, localisation)
  - Réponses avec formatage markdown gras
  - Indicateur de frappe animé (points)
  - Persistance localStorage (historique de conversation + profil)
  - Bouton de réinitialisation de la conversation
  - Gestion d'erreur avec message de fallback (recommandation d'appeler REPERE au 0262 40 50 60)
  - Envoi par touche Entrée, défilement et focus automatiques

---

## Algorithme de recommandation

Les professionnels sont recommandés aux patients selon un scoring pondéré :

| Critère | Points |
|---------|--------|
| Zone géographique | 30 pts |
| Correspondance besoins ↔ mots-clés | 20 pts / correspondance |
| Projet de naissance | 15 pts |
| Antécédents médicaux | 10 pts |
| Stade de grossesse | 15 pts |
| Note moyenne des avis | ×2 multiplicateur |

---

## Données locales simulées

| Type de données | Quantité | Détails |
|----------------|----------|---------|
| Professionnels | 6 | Sage-femme (Cilaos), Pédiatre (Saint-Denis), Doula (Saint-Pierre), Consultante lactation (Le Tampon), Ostéopathe (Saint-Paul), Psychologue (Saint-André) |
| Patients | 3 | Camille (T2, Cilaos), Laura (post-natal, Saint-Denis), Anaïs (fertilité, Saint-Pierre) |
| Articles | 6 | Aides CAF, nutrition locale, post-partum, allaitement, sécurité sociale, préparation naissance |
| FAQ | 12 | 10 répondues + 2 en attente |
| Messages | 20 | Conversations patient-professionnel |
| Forum | 6 | Sujets communautaires (préparation naissance, fertilité, allaitement au travail, recettes, PMA, baby blues) |
| Rendez-vous | 13 | Statuts confirmés + en attente |

---

## Carte des routes

| Chemin | Accès | Page |
|--------|-------|------|
| `/` | Public | Page d'accueil |
| `/connexion` | Public | Connexion |
| `/inscription` | Public | Inscription |
| `/articles` | Tous | Articles |
| `/communaute` | Tous | Communauté & FAQ |
| `/annuaire` | Tous | Annuaire |
| `/patient/questionnaire` | Patient | Questionnaire d'onboarding |
| `/patient/tableau-de-bord` | Patient | Tableau de bord |
| `/patient/annuaire` | Patient | Annuaire |
| `/patient/suivi` | Patient | Suivi santé |
| `/patient/messagerie` | Patient | Messagerie |
| `/patient/fiche-enfant` | Patient | Fiche enfant |
| `/patient/profil` | Patient | Profil |
| `/professionnel/tableau-de-bord` | Professionnel | Tableau de bord |
| `/professionnel/rendez-vous` | Professionnel | Rendez-vous |
| `/professionnel/messagerie` | Professionnel | Messagerie |
| `/professionnel/avis` | Professionnel | Avis |
| `/professionnel/profil` | Professionnel | Profil |

---

## Spécificités La Réunion 🇷🇪

- **24 communes** gérées pour la géolocalisation
- **5 zones géographiques** : Nord, Sud, Est, Ouest, Hauts
- **Aliments locaux** dans les programmes diététiques : rougail, brèdes, chouchou, etc.
- **Aides locales** documentées : CAF, Sécurité Sociale
- **Numéros d'urgence** : 3114 (prévention suicide), REPERE 0262 40 50 60

---

## Charte graphique

| Élément | Couleur |
|---------|---------|
| Fond | `#FDFBEA` |
| Couleur principale | `#FF535A` |
| Texte | `#303030` |
| Accent secondaire | `#FFAF34` |
| Fond clair | `#DBE5E7` |
| Accent tertiaire | `#FFA292` |
| Accent quaternaire | `#C4C45C` |

---

## Installation & Lancement

```bash
npm install
npm start
```

L'application est accessible sur `http://localhost:3000`.
