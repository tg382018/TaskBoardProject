# 📚 Frontend & Packages Dokümantasyon Planı (Final)

Bu döküman, TaskBoard frontend ve shared packages dokümantasyonunun **final yapısını** tanımlar.

---

## 🗂️ Dosya Yapısı

```
docs/
├── frontend/
│   ├── overview.md          # Master Architecture
│   ├── routing.md           # Sayfa Navigasyonu
│   ├── state-management.md  # Zustand & TanStack Query
│   ├── auth.md              # Authentication Flow
│   ├── projects.md          # Proje Yönetimi UI
│   ├── tasks.md             # Task CRUD & Kanban
│   ├── realtime.md          # Socket.io Entegrasyonu
│   └── components.md        # UI Bileşen Kütüphanesi
│
└── packages/
    ├── overview.md          # Monorepo & Package Yapısı
    ├── ui.md                # @packages/ui - Shared Components
    ├── common.md            # @packages/common - Shared Schemas
    └── config.md            # @packages/config - ESLint & Prettier
```

**Toplam: 12 Sayfa** (8 Frontend + 4 Packages)

---

## 📦 PACKAGES DÖKÜMANTASYONU

---

### 1. `packages/overview.md` - Monorepo & Package Yapısı

**Amaç:** Paylaşılan paketlerin neden ve nasıl kullanıldığını açıklamak

**İçerik:**

- [ ] Monorepo yaklaşımı (pnpm workspaces)
- [ ] Package bağımlılık grafiği
- [ ] Her paketin sorumluluğu
- [ ] Import yolları (`@packages/ui`, `@packages/common`)

**Diagram:**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   apps/web  │────▶│ packages/ui │     │ packages/   │
├─────────────┤     └─────────────┘     │   common    │
│   apps/api  │─────────────────────────▶─────────────┤
├─────────────┤                         │   schemas   │
│ apps/worker │─────────────────────────▶─────────────┘
└─────────────┘
```

---

### 2. `packages/ui.md` - @packages/ui Bileşen Kütüphanesi

**Amaç:** shadcn/ui tabanlı paylaşılan UI bileşenleri

**İçerik:**

- [ ] Neden ayrı package? (reusability, consistency)
- [ ] shadcn/ui entegrasyonu
- [ ] Tailwind CSS ve cn() utility
- [ ] Bileşen kataloğu

**Mevcut Bileşenler (10 adet):**

| Bileşen      | Dosya             | Açıklama                                        |
| ------------ | ----------------- | ----------------------------------------------- |
| `Button`     | `button.jsx`      | Primary/Secondary/Ghost variants                |
| `Badge`      | `badge.jsx`       | Status/tag badge                                |
| `Card`       | `card.jsx`        | Container card (Header, Title, Content, Footer) |
| `Dialog`     | `dialog.jsx`      | Modal dialog                                    |
| `Input`      | `input.jsx`       | Form input                                      |
| `Label`      | `label.jsx`       | Form label                                      |
| `ScrollArea` | `scroll-area.jsx` | Custom scrollbar                                |
| `Sheet`      | `sheet.jsx`       | Side panel                                      |
| `Skeleton`   | `skeleton.jsx`    | Loading placeholder                             |
| `Table`      | `table.jsx`       | Data table                                      |

**Kullanım:**

```jsx
import { Button, Input, Dialog, Card } from "@packages/ui";
```

> **Not:** AlertDialog, DropdownMenu, Select ve Toast bileşenleri `apps/web/src/app/components/ui/` altında local olarak tutulmaktadır (app-specific customizations).

---

### 3. `packages/common.md` - @packages/common Shared Logic

**Amaç:** Backend ve frontend arasında paylaşılan mantık

**İçerik:**

- [ ] Validation schemas (JSON Schema)
- [ ] Constants ve enums

**Schema Tablosu:**

| Schema          | Dosya               | Kullanıldığı Yerler   |
| --------------- | ------------------- | --------------------- |
| `authSchema`    | `auth.schema.js`    | Login, Register, OTP  |
| `taskSchema`    | `task.schema.js`    | Task create/update    |
| `projectSchema` | `project.schema.js` | Project create/update |
| `commentSchema` | `comment.schema.js` | Comment validation    |
| `userSchema`    | `user.schema.js`    | Profile update        |

**Constants:**

```javascript
// constants.js
export const TaskStatus = { TODO: "Todo", IN_PROGRESS: "InProgress", DONE: "Done" };
export const TaskPriority = { LOW: "Low", MEDIUM: "Medium", HIGH: "High" };
```

---

### 4. `packages/config.md` - @packages/config Tooling

**Amaç:** Paylaşılan ESLint ve Prettier konfigürasyonları

**İçerik:**

- [ ] ESLint kuralları
- [ ] Prettier formatting rules
- [ ] Nasıl extend edilir

---

## 🖥️ FRONTEND DÖKÜMANTASYONU

---

### 5. `frontend/overview.md` - Master Frontend Architecture

**Amaç:** Tüm frontend sisteminin kuş bakışı görünümü

**İçerik:**

- [ ] Tech Stack Tablosu
- [ ] Klasör yapısı
- [ ] Provider hiyerarşisi (main.jsx)
- [ ] Veri akış diyagramı

**Tech Stack:**

| Teknoloji          | Kullanım                |
| ------------------ | ----------------------- |
| React 19           | UI Framework            |
| Vite 6             | Build Tool              |
| React Router 7     | Routing                 |
| TanStack Query 5   | Data Fetching & Caching |
| Zustand 5          | Global State            |
| Socket.io Client 4 | Real-time               |
| Tailwind CSS 4     | Styling                 |
| Formik + Yup       | Form Management         |

**Klasör Yapısı:**

```
apps/web/src/app/
├── api/           # API client functions
├── components/
│   ├── common/    # EmptyState, DataTable
│   ├── ui/        # App-specific UI (AlertDialog, Select, Toast)
│   └── widgets/   # Dashboard widgets
├── features/      # Feature modules (auth, projects, tasks, profile)
├── hooks/         # Custom hooks (useAuth, useSocket, useToast)
├── layouts/       # AppLayout, AuthLayout
├── lib/           # Utilities (cn, axios)
├── providers/     # Context providers
├── routes/        # Route definitions
├── store/         # Zustand stores
└── styles/        # Global CSS
```

---

### 6. `frontend/routing.md` - Sayfa Navigasyonu

**İçerik:**

- [ ] Route tablosu
- [ ] Protected Routes
- [ ] Layout sistemi

**Route Tablosu:**

| Path            | Component     | Layout     | Auth |
| --------------- | ------------- | ---------- | ---- |
| `/login`        | Login         | AuthLayout | ❌   |
| `/register`     | Register      | AuthLayout | ❌   |
| `/dashboard`    | Dashboard     | AppLayout  | ✅   |
| `/projects`     | ProjectsList  | AppLayout  | ✅   |
| `/projects/:id` | ProjectDetail | AppLayout  | ✅   |
| `/tasks/:id`    | TaskDetail    | AppLayout  | ✅   |
| `/profile`      | Profile       | AppLayout  | ✅   |
| `/docs`         | Docs          | -          | ❌   |

---

### 7. `frontend/state-management.md` - State & Data Fetching

**İçerik:**

- [ ] Zustand Store yapısı (`auth.store.js`)
- [ ] TanStack Query patterns
- [ ] Cache invalidation
- [ ] Optimistic updates

**Zustand Store:**

```javascript
// auth.store.js
export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));
```

---

### 8. `frontend/auth.md` - Authentication UI Flow

**İçerik:**

- [ ] Login → OTP → Dashboard akışı
- [ ] Form validation (Formik + Yup)
- [ ] Cookie-based auth
- [ ] Axios interceptors

**Flow:**

```
[Login Form] → [API /auth/login] → [OTP Form] → [API /auth/verify] → [Cookies Set] → [Dashboard]
```

---

### 9. `frontend/projects.md` - Proje Yönetimi UI

**İçerik:**

- [ ] Proje listesi görünümü
- [ ] Proje oluşturma modal
- [ ] Proje detay sayfası
- [ ] Üye yönetimi
- [ ] Real-time updates

---

### 10. `frontend/tasks.md` - Task Management

**İçerik:**

- [ ] TaskTable component
- [ ] Task filtreleme & sıralama
- [ ] Inline edit
- [ ] Task detay sayfası
- [ ] Comment sistemi

---

### 11. `frontend/realtime.md` - Socket.io Entegrasyonu

**İçerik:**

- [ ] SocketProvider yapısı
- [ ] useSocket hook
- [ ] useSocketEvent hook
- [ ] Room join/leave
- [ ] Event tablosu

**Socket Events:**

| Event                  | Tetikleyen | UI Etkisi              |
| ---------------------- | ---------- | ---------------------- |
| `task.created`         | API        | TaskTable refresh      |
| `task.updated`         | API        | Task data invalidate   |
| `task.deleted`         | API        | Task removed from list |
| `comment.added`        | API        | Comment list refresh   |
| `project.member.added` | API        | Member list refresh    |

---

### 12. `frontend/components.md` - UI Bileşen Kütüphanesi

**Amaç:** App-specific UI bileşenleri

**Local Components (`apps/web/src/app/components/ui/`):**

| Bileşen        | Dosya               | Açıklama               |
| -------------- | ------------------- | ---------------------- |
| `AlertDialog`  | `alert-dialog.jsx`  | Confirmation dialogs   |
| `DropdownMenu` | `dropdown-menu.jsx` | Context menus          |
| `Select`       | `select.jsx`        | Dropdown select        |
| `Toast`        | `toast.jsx`         | Notification toasts    |
| `Toaster`      | `toaster.jsx`       | Toast container        |
| `ThemeToggle`  | `theme-toggle.jsx`  | Dark/Light mode switch |

**Common Components (`apps/web/src/app/components/common/`):**

| Bileşen      | Dosya             | Açıklama               |
| ------------ | ----------------- | ---------------------- |
| `DataTable`  | `data-table.jsx`  | TanStack Table wrapper |
| `EmptyState` | `empty-state.jsx` | Empty list placeholder |

**Widget Components (`apps/web/src/app/components/widgets/`):**

| Bileşen              | Dosya                    | Açıklama               |
| -------------------- | ------------------------ | ---------------------- |
| `UserStatsWidget`    | `UserStatsWidget.jsx`    | Dashboard stats        |
| `DailySummaryWidget` | `DailySummaryWidget.jsx` | Daily activity summary |

---

## ✅ Yazım Öncelikleri

| Öncelik | Dosya                          | Sebep                   |
| ------- | ------------------------------ | ----------------------- |
| 🔴 1    | `packages/overview.md`         | Temel yapıyı açıklar    |
| 🔴 2    | `packages/ui.md`               | En çok kullanılan paket |
| 🔴 3    | `frontend/overview.md`         | Ana giriş noktası       |
| 🟡 4    | `packages/common.md`           | Validation paylaşımı    |
| 🟡 5    | `frontend/auth.md`             | Kritik akış             |
| 🟡 6    | `frontend/state-management.md` | Veri yönetimi           |
| � 7     | `frontend/realtime.md`         | Önemli özellik          |
| 🟢 8    | `frontend/components.md`       | Referans                |
| 🟢 9    | `packages/config.md`           | Tooling                 |
| 🟢 10   | `frontend/routing.md`          | Basit                   |
| 🟢 11   | `frontend/projects.md`         | Feature                 |
| 🟢 12   | `frontend/tasks.md`            | Feature                 |

---

## 🎯 Sonraki Adım

Planı onaylarsan, şu sırayla yazacağım:

1. `packages/overview.md` - Monorepo yapısı
2. `packages/ui.md` - UI bileşenleri (10 adet)
3. `frontend/overview.md` - Frontend mimarisi

**Onay bekleniyor...**
