# 🏗️ Frontend Architecture Overview

The TaskBoard frontend is a modern **React 19** application built with **Vite**, featuring real-time updates, optimistic UI patterns, and a component-driven architecture designed for maximum developer productivity and user experience.

---

## 🎯 Design Philosophy

TaskBoard's frontend follows these core principles:

1. **Feature-First Organization** - Code is organized by business domain, not by technical role
2. **Colocation** - Related files (components, hooks, tests) live together
3. **Shared Core** - Common utilities extracted to `@packages/ui` and `@packages/common`
4. **Real-time First** - Socket.io integration baked into the architecture from day one

---

## ⚡ Tech Stack

| Technology           | Version | Purpose                                 |
| :------------------- | :------ | :-------------------------------------- |
| **React**            | 19.x    | UI Framework with concurrent rendering  |
| **Vite**             | 6.x     | Lightning-fast HMR and optimized builds |
| **React Router**     | 7.x     | Declarative client-side routing         |
| **TanStack Query**   | 5.x     | Async state management with caching     |
| **Zustand**          | 5.x     | Lightweight global state                |
| **Socket.io Client** | 4.x     | WebSocket abstraction for real-time     |
| **Tailwind CSS**     | 4.x     | Utility-first styling                   |
| **Formik + Yup**     | -       | Form management and validation          |
| **Lucide React**     | -       | Icon library                            |
| **date-fns**         | -       | Date manipulation                       |

---

## 📊 Data Flow Architecture

![Frontend Data Flow](/docs/images/frontend/frontend-data.png)

---

## 🔄 Provider Hierarchy

![Provider Hierarchy](/docs/images/frontend/provider-hierarchy.png)

> [!IMPORTANT]
> **Order matters!** QueryClientProvider must wrap SocketProvider so socket events can trigger query invalidations.

---

## 🎨 Styling Approach

TaskBoard uses **Tailwind CSS 4** with a custom design system:

### Color Tokens

- `--primary` - Brand color (indigo)
- `--secondary` - Supporting color
- `--destructive` - Error/delete actions
- `--muted` - Subtle backgrounds

### Dark Mode

Managed by `ThemeProvider` with localStorage persistence:

```jsx
<ThemeProvider defaultTheme="dark" storageKey="taskboard-theme">
```

---

## 🔗 Package Imports

| Source                       | Usage                                    |
| :--------------------------- | :--------------------------------------- |
| `@packages/ui`               | Button, Card, Dialog, Input, Table, etc. |
| `@packages/common/constants` | TaskStatus, TaskPriority enums           |
| `@packages/common/schemas`   | Validation schemas (shared with backend) |
| `@/app/components/ui`        | App-specific: AlertDialog, Select, Toast |
| `@/app/hooks`                | useAuth, useSocket, useToast             |

> [!TIP]
> The `@` alias is configured in `vite.config.js` to point to `src/app/`.

---

## 🚀 Development Commands

| Command        | Description                    |
| :------------- | :----------------------------- |
| `pnpm dev`     | Start dev server (HMR enabled) |
| `pnpm build`   | Production build               |
| `pnpm preview` | Preview production build       |
| `pnpm test`    | Run tests with Vitest          |
| `pnpm lint`    | ESLint check                   |

---

## 📈 Performance Optimizations

1. **Code Splitting** - Routes are lazily loaded
2. **Query Caching** - TanStack Query caches API responses
3. **Optimistic Updates** - UI updates before server confirms
4. **Delta Updates** - Socket sends only changed data
5. **Debounced Search** - Prevents excessive API calls

> [!NOTE]
> The production bundle is ~930KB gzipped to ~288KB, with opportunities for further splitting.
