# 🧑‍💻 Agent de Setup React

## 🚀 Introduction

Cet agent est un outil automatisé qui permet de générer rapidement un projet React avec toutes les meilleures pratiques de développement, notamment :

Structure modulaire

SCSS propre et scalable

Setup de React Router, ESLint, Prettier, et plus

Il permet d’accélérer la création de nouveaux projets React et de commencer rapidement avec des configurations de développement modernes.

---

## 📦 Fonctionnalités

- Création de structure de projet : Organise ton code avec des dossiers comme components, pages, hooks, styles, etc.

<!-- - Installation de Tailwind CSS : Ajoute Tailwind en quelques secondes si tu le choisis. -->

- Installation de SCSS : Ajoute une architecture SCSS avec variables, mixins, et reset.

- Setup de React Router : Configure automatiquement le routage avec react-router-dom.

- Support TypeScript : Tu peux choisir de commencer avec TypeScript ou JavaScript pur.

- Configuration d'ESLint + Prettier : Applique des règles de style et de qualité de code dès le départ.

- Page 404 et redirection de / vers /home : Gère les routes inconnues avec une page NotFound

---

## 💻 Installation

Prérequis

- Node.js (version 14 ou plus récente)
- npm ou yarn

### Installation globale de l'agent

Tu peux installer l’agent globalement avec npm :

```bash
npm install -g agent-react-setup
```

---

## ⚙️ Utilisation

### 1. Lancer l’agent

Dans ton terminal, exécute la commande suivante :

```bash
create-react-ai
```

L'agent te guidera à travers plusieurs questions pour configurer ton projet :

- Nom du projet

- Utiliser TypeScript ?

Il générera ensuite ton projet avec la configuration choisie.

### 2. Lancer le projet

Une fois que ton projet est créé, rends-toi dans ton dossier de projet :

```bash
cd mon-nouveau-projet
npm run dev
```

Cela lancera le serveur de développement et tu pourras voir ton projet à l'adresse http://localhost:5173

---

## 🧑‍💻 Structure du Projet Généré

Voici la structure de dossiers de ton projet généré :

```
src/
├── assets/ → Images, SVG, polices
├── components/ → Composants réutilisables
├── constants/ → Constantes globales (ex: routes)
├── hooks/ → Custom Hooks
├── layouts/ → Layouts globaux avec Header/Footer
├── pages/ → Pages principales (home, notfound…)
├── routes/ → Système de navigation
├── styles/ → SCSS avec variables, reset, mixins
├── utils/ → Fonctions utilitaires
```

---

## 📝 Personnalisation

### 1. Ajouter de nouvelles pages

Ajoute facilement de nouvelles pages dans le dossier pages/ et mets-les à jour dans routes/index.jsx.

### 2. Ajouter de nouveaux composants

Les composants réutilisables vont dans components/. Ajoute-les à ton layout global ou sur les pages.

### 3. Ajouter ou supprimer des dépendances

Si tu veux ajouter d'autres outils ou librairies à ton projet, modifie le fichier package.json et exécute :

```
npm install <package-name>
```

---

## 🐞 Dépannage

- Si tu veux réinitialiser ton projet, supprime le dossier du projet et recommence.
