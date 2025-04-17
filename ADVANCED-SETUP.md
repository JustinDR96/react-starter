# 🚀 Fonctionnalités avancées pour ton projet React

Voici un ensemble d’outils, bonnes pratiques et composants avancés que tu peux ajouter à ton projet **à la demande**, quand tu en as besoin. Rien n’est installé automatiquement dans le script de setup, mais tout est prêt à être copié-collé.

---

## 🧠 1. Authentification globale avec Zustand + Persist

Créer un fichier `src/stores/authStore.js` :

```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      login: (data) => set({ user: data }),
      logout: () => set({ user: null }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true)
      },
    }
  )
)
```

---

## ⚙️ 2. API + axios

Créer un fichier `src/api/axios.js` :

```js
import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default instance
```

Créer un dossier `services/` avec `postService.js` :

```js
import axios from '../api/axios'

export const fetchPosts = async (page = 1, limit = 10) => {
  const res = await axios.get('/posts', {
    params: { _page: page, _limit: limit },
  })
  return res.data
}
```

---

## 🔐 3. Protection de route avec RequireAuth

Créer `src/routes/RequireAuth.jsx` :

```js
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function RequireAuth({ children, role }) {
  const user = useAuthStore((s) => s.user)
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const location = useLocation()

  if (!hasHydrated) return null
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (role && user.role !== role) return <Navigate to="/unauthorized" replace />
  return children
}
```

---

## 🔁 4. React Query (data fetching + mutation)

### Installer

```bash
npm install @tanstack/react-query
```

Créer un provider : `src/providers/QueryProvider.jsx`

```js
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()

export default function QueryProvider({ children }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

Et l’utiliser dans `App.jsx` :

```js
import QueryProvider from './providers/QueryProvider'

function App() {
  return (
    <QueryProvider>
      <AppRoutes />
    </QueryProvider>
  )
}
```

---

## 💡 5. Optimistic Update (React Query)

Dans `useMutation` :

```js
onMutate: async (newItem) => {
  await queryClient.cancelQueries(['posts'])
  const previous = queryClient.getQueryData(['posts'])
  queryClient.setQueryData(['posts'], (old) => [...(old || []), newItem])
  return { previous }
},
onError: (err, newItem, context) => {
  queryClient.setQueryData(['posts'], context.previous)
},
onSuccess: () => {
  queryClient.invalidateQueries(['posts'])
}
```

---

## 📄 6. Documentation automatique avec JSDoc

### Installer

```bash
npm install --save-dev jsdoc
```

Créer un fichier `jsdoc.json` :

```json
{
  "source": {
    "include": ["src"],
    "includePattern": ".jsx?$"
  },
  "opts": {
    "destination": "./docs",
    "recurse": true
  }
}
```

Ajouter un script dans `package.json` :

```json
"scripts": {
  "doc": "jsdoc -c jsdoc.json"
}
```

Lancer la génération :

```bash
npm run doc
```

---

## 🧩 7. Exemple de JSDoc dans un composant React

```js
/**
 * Bouton stylé personnalisé
 * @param {Object} props
 * @param {string} props.label - Le texte à afficher
 * @param {() => void} props.onClick - Fonction appelée au clic
 */
function MyButton({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>
}
```

---

Tu peux copier-coller chaque partie dans ton projet selon ce que tu veux activer ✅