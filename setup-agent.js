#!/usr/bin/env node

const fs = require("fs-extra");
const readline = require("readline");
const { execSync } = require("child_process");
const path = require("path");
const { cwd } = require("process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function createProjectStructure(basePath) {
  const folders = {
    components: `# 🧩 Components

Ce dossier contient tous les composants réutilisables de l’application.

👉 Exemple : Header, Button, Card, etc.`,
    hooks: `# 🪝 Hooks

Ce dossier contient vos hooks personnalisés React.

👉 Exemple : useDarkMode, useFetch, etc.`,
    assets: `# 🎨 Assets

Ici, vous pouvez stocker :
- Vos images
- Vos polices
- Vos icônes SVG ou autres`,
  };

  for (const [folder, readme] of Object.entries(folders)) {
    const fullPath = path.join(basePath, folder);
    await fs.ensureDir(fullPath);
    await fs.writeFile(path.join(fullPath, "README.md"), readme);
  }
}

async function createConstantsAndUtils(basePath) {
  const base = path.join(basePath, "src");

  // constants/
  const constantsPath = path.join(base, "constants");
  await fs.ensureDir(constantsPath);
  await fs.writeFile(
    path.join(constantsPath, "README.md"),
    `# 🧭 Constants

Ce dossier centralise toutes les constantes utilisées dans l'application :  
- Routes
- Messages
- Clés de config
- Autres données statiques`
  );

  // utils/
  const utilsPath = path.join(base, "utils");
  await fs.ensureDir(utilsPath);
  await fs.writeFile(
    path.join(utilsPath, "README.md"),
    `# 🧠 Utils

Ce dossier contient les fonctions utilitaires partagées dans l'application.  
👉 Exemples : formatDate, isValidEmail, etc.`
  );

  const routesJs = `export const ROUTES = {
    HOME: "/",
    NOT_FOUND: "*",
  }
  `;
  await fs.writeFile(path.join(constantsPath, "routes.js"), routesJs);
}

async function createStylesFolder(basePath) {
  const stylesPath = path.join(basePath, "src", "styles");
  await fs.ensureDir(stylesPath);

  // Sous-dossiers
  const folders = ["base", "mixins", "variables"];
  for (const folder of folders) {
    await fs.ensureDir(path.join(stylesPath, folder));
  }

  // _reset.scss
  await fs.writeFile(
    path.join(stylesPath, "base", "_reset.scss"),
    `/* Reset de base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
h1 {
  margin: 0;
  padding: 0;
}
/* Correction des tailles de police */
html {
  font-size: 16px;
  scroll-behavior: smooth;
}

/* Suppression du style des listes */
ul,
ol {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Suppression des styles par défaut des boutons et liens */
button,
input,
textarea {
  font-family: inherit;
  border: none;
  outline: none;
}

/* Suppression du soulignement des liens */
a {
  text-decoration: none;
  color: inherit;
}

/* Correction des images */
img {
  max-width: 100%;
  height: auto;
  display: block;
}`
  );

  // _colors.scss
  await fs.writeFile(
    path.join(stylesPath, "variables", "_colors.scss"),
    `// 🎨 Couleurs globales

$primary-color: #007bff;
$secondary-color: #6c757d;
$text-color: #333;
$bg-color: #f5f5f5;`
  );

  // _media.scss
  await fs.writeFile(
    path.join(stylesPath, "mixins", "_media.scss"),
    `// 📱 Mixin media query

@mixin respond-to($breakpoint) {
  @if $breakpoint == small {
    @media (max-width: 576px) { @content; }
  } @else if $breakpoint == medium {
    @media (max-width: 768px) { @content; }
  } @else if $breakpoint == large {
    @media (max-width: 992px) { @content; }
  }
}`
  );

  // index.scss (import central)
  const globalScss = `@use "./variables/colors";
@use "./mixins/media";
@use "./base/reset";

/* Ajoutez ici vos styles globaux */
body {
  
}
`;
  await fs.writeFile(path.join(stylesPath, "global.scss"), globalScss);

  // _theme.scss
  await fs.writeFile(
    path.join(stylesPath, "variables", "_theme.scss"),
    `// 🎨 Thème (ex : dark / light)

$light-theme: (
  background: #ffffff,
  text: #000000
);

$dark-theme: (
  background: #121212,
  text: #f5f5f5
);

// Mixin pour appliquer un thème
@mixin theme($theme) {
  background-color: map-get($theme, background);
  color: map-get($theme, text);
}
`
  );
}

async function createLayout(basePath, typescript) {
  const ext = typescript ? "tsx" : "jsx";
  const layoutDir = path.join(basePath, "src", "layouts");
  await fs.ensureDir(layoutDir);

  // README
  await fs.writeFile(
    path.join(layoutDir, "README.md"),
    `# 🖼️ Layouts

Ce dossier contient les layouts globaux (Header/Footer persistants, wrappers, etc.).

👉 Exemple : DefaultLayout.jsx`
  );

  // DefaultLayout
  const layoutCode = `import Navbar from "../components/Navbar/Navbar"

const DefaultLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}


export default DefaultLayout;
`;
  await fs.writeFile(path.join(layoutDir, `DefaultLayout.${ext}`), layoutCode);
}

async function setupESLintPrettier(basePath) {
  console.log("\n🧠 Setup ESLint + Prettier...");

  // Dépendances
  execSync(
    "npm install -D eslint prettier eslint-config-prettier eslint-plugin-react",
    {
      cwd: basePath,
      stdio: "inherit",
      shell: true,
    }
  );

  // .eslintrc.cjs
  const eslintConfig = `module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {},
  settings: {
    react: {
      version: 'detect',
    },
  },
}
`;
  await fs.writeFile(path.join(basePath, ".eslintrc.cjs"), eslintConfig);

  // .prettierrc
  await fs.writeFile(
    path.join(basePath, ".prettierrc"),
    JSON.stringify(
      { semi: false, singleQuote: true, trailingComma: "es5" },
      null,
      2
    )
  );

  // .eslintignore + .prettierignore
  const ignoreContent = `node_modules
dist
build
`;
  await fs.writeFile(path.join(basePath, ".eslintignore"), ignoreContent);
  await fs.writeFile(path.join(basePath, ".prettierignore"), ignoreContent);

  // Ajout script "lint" au package.json
  const pkgPath = path.join(basePath, "package.json");
  const pkg = await fs.readJson(pkgPath);
  pkg.scripts = pkg.scripts || {};
  pkg.scripts.lint = "eslint .";
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
}

async function createRoutesFolder(basePath) {
  const routesPath = path.join(basePath, "src", "routes");
  await fs.ensureDir(routesPath);

  const readme = `# 🧭 Dossier routes

📌 **Description :**  
Centralise les routes de l’application.
`;
  await fs.writeFile(path.join(routesPath, "README.md"), readme);
}

async function cleanBoilerplateReact(basePath, typescript) {
  const filesToDelete = [
    "src/App.css",
    "src/assets/react.svg",
    "src/assets",
    "src/logo.svg",
    "src/index.css",
    "public/vite.svg",
  ];
  for (const file of filesToDelete) {
    try {
      await fs.remove(path.join(basePath, file));
    } catch (_) {}
  }

  // Recréer index.scss
  const scssPath = path.join(basePath, "src", "index.scss");
  await fs.writeFile(scssPath, `@use "./styles/global";`);

  // Remplacer import "./index.css" par "./index.scss"
  const ext = typescript ? "tsx" : "jsx";
  const mainPath = path.join(basePath, "src", `main.${ext}`);
  if (await fs.exists(mainPath)) {
    let mainCode = await fs.readFile(mainPath, "utf-8");
    mainCode = mainCode.replace(`./index.css`, `./index.scss`);
    await fs.writeFile(mainPath, mainCode);
  }
}

async function createPagesAndRouting(basePath, typescript, projectName) {
  const ext = typescript ? "tsx" : "jsx";
  const pagesPath = path.join(basePath, "src", "pages", "home");
  const routesPath = path.join(basePath, "src", "routes");

  await fs.ensureDir(pagesPath);
  await fs.ensureDir(routesPath);

  // 🏠 Page Home
  const homeComponent = `import styles from "./home.module.scss"

export default function Home() {
  return <h1 className={styles.title}>Homepage: Commencez "${projectName}"</h1>
}
`;
  const homeStyle = `.title {
  font-size: 2rem;
}`;

  await fs.writeFile(path.join(pagesPath, `Home.${ext}`), homeComponent);
  await fs.writeFile(path.join(pagesPath, `home.module.scss`), homeStyle);

  // 🛣️ Routing
  const routesContent = `import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
  import { ROUTES } from "../constants/routes"
import Home from "../pages/home/Home"
import DefaultLayout from "../layouts/DefaultLayout"
import NotFound from "../pages/notfound/NotFound"

const AppRoutes = () => (
  <Router>
    <Routes>

      {/* Routes */}
       <Route
        path={ROUTES.HOME}
        element={
          <DefaultLayout>
            <Home />
          </DefaultLayout>
        }
      />

      {/* 404 */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  </Router>
)

export default AppRoutes
`;
  await fs.writeFile(path.join(routesPath, `index.${ext}`), routesContent);
}

async function createNavbarComponent(basePath, typescript) {
  const ext = typescript ? "tsx" : "jsx";
  const componentsPath = path.join(basePath, "src", "components", "Navbar");

  await fs.ensureDir(componentsPath);

  const navbarCode = `import { Link } from "react-router-dom"
import styles from "./navbar.module.scss"

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li><Link to="/">Accueil</Link></li>
      </ul>
    </nav>
  )
}
`;

  const navbarStyle = `.navbar {
  padding: 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;

  ul {
    display: flex;
    gap: 1rem;
    list-style: none;
  }

  a {
    text-decoration: none;
    color: #333;
    font-weight: bold;

    &:hover {
      color: #007bff;
    }
  }
}
`;

  await fs.writeFile(path.join(componentsPath, `Navbar.${ext}`), navbarCode);
  await fs.writeFile(
    path.join(componentsPath, `navbar.module.scss`),
    navbarStyle
  );
}

async function writeSimpleAppFile(basePath, typescript) {
  const ext = typescript ? "tsx" : "jsx";
  const appPath = path.join(basePath, "src", `App.${ext}`);

  const content = `import AppRoutes from "./routes"

function App() {
  return <AppRoutes />
}

export default App
`;
  await fs.writeFile(appPath, content);
}

async function createNotFoundPage(basePath, typescript) {
  const ext = typescript ? "tsx" : "jsx";
  const pagePath = path.join(basePath, "src", "pages", "notfound");
  await fs.ensureDir(pagePath);

  const notFoundComponent = `import styles from "./notfound.module.scss"

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <h1>404</h1>
      <p>Cette page n'existe pas.</p>
    </div>
  )
}
`;

  const notFoundStyle = `.wrapper {
  text-align: center;
  padding: 5rem;
  color: #999;

  h1 {
    font-size: 6rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.25rem;
  }
}
`;

  await fs.writeFile(path.join(pagePath, `NotFound.${ext}`), notFoundComponent);
  await fs.writeFile(
    path.join(pagePath, `notfound.module.scss`),
    notFoundStyle
  );
}

async function generateReadme(basePath, projectName, typescript) {
  const readme = `# 🚀 ${projectName}

Projet généré automatiquement avec ton agent IA 💻

## 📦 Stack utilisée

- React ${typescript ? "+ TypeScript" : ""}
- Vite
- SCSS (architecture modulaire)
- React Router DOM
- ESLint + Prettier

---

## ▶️ Lancer le projet

\`\`\`bash
npm install
npm run dev
\`\`\`

---

## 📁 Structure du projet

\`\`\`
src/
├── assets/          → Images, SVG, polices
├── components/      → Composants réutilisables
├── constants/       → Constantes globales (ex: routes)
├── hooks/           → Custom Hooks
├── layouts/         → Layouts globaux avec Header/Footer
├── pages/           → Pages principales (home, notfound…)
├── routes/          → Système de navigation
├── styles/          → SCSS avec variables, reset, mixins
├── utils/           → Fonctions utilitaires
\`\`\`

---

## 🧹 Scripts disponibles

| Script          | Description                    |
|----------------|--------------------------------|
| \`npm run dev\`   | Lance le serveur Vite            |
| \`npm run lint\`  | Lint le projet avec ESLint       |

---

## 📄 Créé par ton starter IA ✨
`;

  await fs.writeFile(path.join(basePath, "README.md"), readme);
}

// fonction run principale
async function run() {
  const projectName = await ask("Nom du projet : ");
  const typescript =
    (await ask("Utiliser TypeScript ? (o/n) : ")).toLowerCase() === "o";

  const withTailwind =
    (await ask("Installer Tailwind CSS ? (o/n) : ")).toLowerCase() === "o";

  const projectPath = path.resolve(projectName);

  const createCmd = `npm create vite@latest ${projectName} -- --template react${
    typescript ? "-ts" : ""
  }`;
  console.log(`\n🚀 Création du projet avec : ${createCmd}`);
  execSync(createCmd, { stdio: "inherit" });

  console.log("\n📦 Installation des dépendances...");
  execSync("npm install", { cwd: projectPath, stdio: "inherit" });

  console.log("\n🎨 Installation de SCSS...");
  execSync("npm install sass", { cwd: projectPath, stdio: "inherit" });

  console.log("\n📦 Installation de React Router...");
  execSync("npm install react-router-dom", {
    cwd: projectPath,
    stdio: "inherit",
  });

  console.log("\n🧼 Nettoyage du boilerplate...");
  await cleanBoilerplateReact(projectPath, typescript);

  console.log("\n📁 Création des dossiers avec README...");
  await createProjectStructure(path.join(projectPath, "src"));
  await createRoutesFolder(projectPath);
  await createConstantsAndUtils(projectPath);
  await createLayout(projectPath, typescript);
  await createStylesFolder(projectPath);
  await setupESLintPrettier(projectPath);
  await createPagesAndRouting(projectPath, typescript, projectName);
  await createNavbarComponent(projectPath, typescript);
  await createNotFoundPage(projectPath, typescript);

  console.log("\n📄 Création d’un App minimal...");
  await writeSimpleAppFile(projectPath, typescript, projectName);

  console.log("\n📄 Génération du README...");
  await generateReadme(projectPath, projectName, typescript);

  console.log("\n✅ Projet React prêt !");
  rl.close();
}

run();
