export const docsContent = [
    {
        id: "overview",
        title: "Backend Overview",
        category: "Backend",
        content: `# 🏗️ Master Backend Architecture & System Design

Welcome to the **TaskBoard Technical Architecture Hub**. This document provides an in-depth exploration of the core systems that power our real-time collaboration engine.

---

## 🏛️ 1. Architecture Philosophy: The Modular Monolith
TaskBoard is architected as a **Modular Monolith** managed via **Turborepo**.

> [!NOTE]
> **Why this choice?** It allows for extreme developer velocity while ensuring that individual modules are "Detachable"—ready to be spun into dedicated microservices.

### 🔹 The Business Domain Layer
- 🔐 **Auth Module:** Handling secure onboarding and session integrity.
- 📁 **Projects & Tasks:** The high-concurrency core workflow engine.
- 💬 **Comments & Stats:** Real-time engagement and data-aggregation.

---

## 🔐 2. The Shared Logic Kernel
| Utility | Responsibility | Technology |
| :--- | :--- | :--- |
| **Security** | Salting, Hashing & JWT Rotation | \`Bcrypt\`, \`JWT\` |
| **Messaging** | AMQP Logic & Payload Marshalling | \`RabbitMQ\` |
| **Real-time** | Event Routing & Room Management | \`Socket.io\` |

---

## 📡 3. Asynchronous Backbone: RabbitMQ & Worker
To maintain a **<100ms API response time**, we offload complexity:
1. **Event Dispatch:** API broadcasts events to **RabbitMQ**.
2. **Background Execution:** The **Worker Service** picks up heavy tasks:
    - 📧 **Communications:** OTPs and Emails.
    - 📊 **Analytics:** Performance updates.

---

## ⚡ 4. Real-Time Propagation via Socket Bridge
Real-time sync is governed by a **Bridge Pattern** that translates internal changes into live updates. 
*Targeted broadcasting ensures that data only reaches authorized Project Rooms.*

---

## 💾 5. The Dual-Storage Foundation
- 🍃 **MongoDB:** Source of Truth for persistent entities.
- ⚡ **Redis:** Performance Layer for **OTP**, **Rate Limiting**, and **Session Caching**.

---

## 📊 Master System Architecture Map
![Master Backend Architecture](/docs/images/backend.png)

---

> [!IMPORTANT]
> This design ensures high scalability and low latency by offloading complexity to background workers.`,
    },
    {
        id: "auth",
        title: "Authentication Module",
        category: "Modules",
        content: `# 🔐 Authentication Module

The Authentication module is the **security gateway** of TaskBoard. It implements a secure, asynchronous, and robust multi-step verification process to ensure user data integrity.

---

## 🛠️ Core Capabilities

### 🔹 1. Robust User Onboarding
The system handles user registration with secure password hashing. Every new registration triggers a background event for post-registration tasks.

> [!NOTE]
> All passwords are hashed using **bcrypt** with a salt factor of 10.

### 🔹 2. Secure Two-Step Login (OTP)
TaskBoard uses a sophisticated **One-Time Password (OTP)** system:
- **Phase 1:** Initial credential validation.
- **Phase 2 (Background):** Worker generates a secure 6-digit OTP, stores it in **Redis** (3m TTL), and dispatches an email.
- **Phase 3:** Instant verification and token issuance.

### 🔹 3. Session & Token Management
- **Access Token:** Short-lived (15m) for active requests.
- **Refresh Token:** Long-lived (7d) stored securely in MongoDB.
- **Rotation:** Tokens are rotated on *every* refresh request to mitigate replay attacks.

---

## 📊 Flow Diagrams

### Authentication Lifecycle
This diagram visualizes the end-to-end journey from registration to secure logout.

![Sequence Diagram: Login & OTP Lifecycle](/docs/images/auth1.png)

### Logical Endpoint Flow
A detailed view of the backend decision-making process for each request.

![Flowchart: Controller Logic Path](/docs/images/auth2.png)`,
    },
    {
        id: "projects",
        title: "Projects Module",
        category: "Modules",
        content: `# 📁 Projects & Workspaces Module

The Projects module serves as the primary organizational unit of TaskBoard, orchestrating how teams collaborate and manage resources across isolated workspaces.

---

## 🛠️ Core Capabilities

### 🔹 1. Workspace Isolation
Each project functions as a secure container. Tasks, members, and activity logs are strictly scoped to their respective project IDs.

> [!TIP]
> **Performance:** We use MongoDB indexing on \`projectId\` fields across all collections for O(1) retrieval performance in list views.

### 🔹 2. Dynamic Membership Management
- **Role-Based Access:** Specialized permissions for Owners and Members.
- **Sync:** Member additions are immediately propagated via the Socket Bridge.

### 🔹 3. Event-Driven Propagation
- **RabbitMQ:** Project deletions trigger an asynchronous "cascade delete" in the Background Worker.
- **Socket IO:** Changes are pushed instantly to all workspace participants.

---

## 📊 Flow Diagrams

### Project Operations Lifecycle
![Flowchart: Project CRUD Operations](/docs/images/projects1.png)

### Team & Membership Management
![Sequence Diagram: Membership & Deletion Flow](/docs/images/projects2.png)

---

> [!NOTE]
> All project routes are protected by the \`authMiddleware\`, requiring a valid JWT session for any workspace interaction.`,
    },
    {
        id: "tasks",
        title: "Tasks Module",
        category: "Modules",
        content: `# ✅ Tasks & Life Cycle Module

The Tasks module is the fundamental unit of work within TaskBoard, providing a robust engine for managing and tracking individual activities.

---

## 🛠️ Core Capabilities

### 🔹 1. Precision Task CRUD
Management of task data is handled with strict schema validation and atomic updates to ensure data integrity during concurrent edits.

### 🔹 2. Real-time Synchronization
Every task update (status change, assignment, etc.) is broadcasted instantly via the **Socket Bridge**, ensuring all project members see changes as they happen.

> [!TIP]
> **Live Updates:** The system uses specific event deltas rather than full page reloads for a seamless, desktop-like experience.

### 🔹 3. Access Control
- **Authorization:** Only project members can interact with tasks.
- **Validation:** Strict Joi/Zod enforcement on all incoming payloads.

---

## 📊 Flow Diagram

### Task Operations Lifecycle
![Flowchart: Task Lifecycle & CRUD](/docs/images/tasks.png)

---

> [!NOTE]
> All Task interactions are subject to project-level isolation, ensuring that data never "leaks" between workspaces.`,
    },
    {
        id: "users",
        title: "Users Module",
        category: "Modules",
        content: `# 👤 Users & Profiles Module

The Users module is the central identity and personalization layer of TaskBoard, managing user metadata and productivity statistics.

---

## 🛠️ Core Capabilities

### 🔹 1. Profile Management
Management of digital identity, including profile updates and avatar orchestration, with a focus on privacy and data safety.

### 🔹 2. Productivity Analytics
Tracks high-level activity metrics like task completion rates and project engagement, utilizing **Redis caching** for high-performance retrieval.

### 🔹 3. Identity Integrity
Integrates with the security kernel to manage verification statuses and account lifecycle events.

> [!TIP]
> **Live Sync:** Profile changes (like avatar or display name updates) are propagated to active project members via the Socket Bridge.

---

## 📊 Flow Diagram

### User Profile & Stats Flow
![Sequence Diagram: Profile & Stats Lifecycle](/docs/images/user.png)

---

> [!NOTE]
> User endpoints implement strict **Ownership Validation**, ensuring that users can only access or modify their own private data.`,
    },
    {
        id: "comments",
        title: "Comments Module",
        category: "Modules",
        content: `# 💬 Real-time Comments & Feedback Module

The Comments module provides a structured, high-concurrency engine for threaded discussions and feedback loops, powered by instant synchronization.

---

## 🛠️ Core Capabilities

### 🔹 1. Instant Feedback
Provides zero-latency communication through optimistic UI updates and backend timestamp synchronization.

### 🔹 2. Project-Scoped Security
Comments are strictly scoped to their parent \`projectId\` and \`taskId\`, ensuring that sensitive project discussions remain private.

### 🔹 3. The Real-time Pulse
Utilizes the **Socket Bridge Pattern** to broadcast updates to specific project rooms, enabling all members to see changes instantly.

> [!TIP]
> **Clean Deletion:** Cascading background logic automatically purges comments when their parent task is removed.

---

## 📊 Flow Diagram

### Comment & Feedback Lifecycle
![Sequence Diagram: Real-time Comment Propagation](/docs/images/comment.png)

---

> [!NOTE]
> Comments are linked to the verified \`authorId\` from the JWT session, ensuring accountability and preventing identity spoofing.`,
    },
    {
        id: "stats",
        title: "Statistics Module",
        category: "Modules",
        content: `# 📊 Statistics & Data Insights Module

The Statistics module provides high-performance data aggregation and visualization capabilities, powered by a specialized dual-storage caching engine.

---

## 🛠️ Core Capabilities

### 🔹 1. High-Performance Aggregation
Utilizes specialized **MongoDB Aggregation Pipelines** to compute complex metrics without impacting system throughput.

### 🔹 2. Read-Aside Caching
Metrics are computed once and stored in **Redis** with specific TTLs, ensuring <10ms response times for analytics dashboards.

### 🔹 3. Event-Driven Refresh
Specific system events trigger cache invalidation flags, ensuring that data remains accurate and fresh.

> [!TIP]
> **Scalability:** By offloading heavy computations to the background, the UI remains responsive even when handling large project datasets.

---

## 📊 Flow Diagram

### Statistics Computation Lifecycle
![Sequence Diagram: Stats Aggregation & Cache Flow](/docs/images/stats.png)

---

> [!NOTE]
> Statistics are strictly scoped and project-isolated, ensuring data privacy across different workspaces.`,
    },
    {
        id: "events",
        title: "Event System",
        category: "Infrastructure",
        content: `# 📡 Distributed Event System

The Event System is the asynchronous backbone of TaskBoard, enabling a decoupled architecture where heavy processing is offloaded to background workers.

---

## 🛠️ Core Mechanism: RabbitMQ

TaskBoard utilizes **RabbitMQ** to achieve reliable delivery and complex routing of system events via the AMQP protocol.

### 🔹 1. Producer Pattern
The API dispatches payloads to specific **Exchanges** with unique routing keys, ensuring the main request loop remains fast and non-blocking.

### 🔹 2. Consumer Pattern
The **Background Worker** listens on persistent queues, ensuring that tasks like email delivery or report generation are executed even under high load.

### 🔹 3. Reliability
- **Acknowledgments:** Messages are only cleared after successful processing.
- **Dead Lettering:** Failed messages are routed to recovery queues for inspection.

> [!IMPORTANT]
> **Performance:** Offloading tasks to the Event System ensures an average API response time of **<100ms** for complex operations.

---

## 📊 Event Flow Architecture

### Distributed Event Lifecycle
![Sequence Diagram: Distributed Event Lifecycle](/docs/images/events.png)

---

> [!TIP]
> Exponential backoff strategies are implemented to handle transient failures in external integrations automatically.`,
    },
    {
        id: "sockets",
        title: "Real-time Sockets",
        category: "Infrastructure",
        content: `# ⚡ Real-time Synchronization Engine

Powered by **Socket.io**, this engine provides the low-latency communication layer that makes TaskBoard feel like a native application.

---

## 🛠️ Core Architecture: The Bridge Pattern

### 🔹 1. Room-Based Isolation
Data is broadcasted only to specific **Project Rooms**, ensuring strict data privacy and reducing unnecessary network traffic for non-participants.

### 🔹 2. Decoupled Relays
The **Socket Bridge** abstracts the WebSocket implementation away from business modules, allowing the API and Worker to trigger updates via a standardized relay interface.

### 🔹 3. Secure Handshake
Every socket connection undergoes a JWT-based handshake. Unauthorized or expired sessions are instantly rejected.

> [!TIP]
> **Delta Updates:** We transmit only the changed data (deltas) rather than full objects, significantly reducing client-side parse times and bandwidth usage.

---

## 📊 Socket Flow Architecture

### Real-time Synchronization Lifecycle
![Sequence Diagram: Real-time Socket Synchronization](/docs/images/sockets.png)

---

> [!IMPORTANT]
> Token rotation also applies to socket sessions—when a user refreshes their JWT, the socket connection is seamlessly re-authenticated.`,
    },
    {
        id: "startup",
        title: "Server Startup",
        category: "Infrastructure",
        content: `# 🚀 System Bootstrap & Initialization

Ensures all dependencies are healthy and the environment is secure before accepting connections.

---

## 🛠️ The Bootstrap Lifecycle

### 🔹 1. Verification
Loads and validates environment variables. Missing critical keys trigger a safety exit.

### 🔹 2. Infrastructure Link
Establishes connections to **MongoDB**, **Redis**, and **RabbitMQ** with built-in retry logic.

### 🔹 3. Application Mounting
Configures security middlewares (Helmet, CORS) and dynamically mounts business modules.

### 🔹 4. Protocol Binding
Starts the HTTP server and attaches the WebSocket handlers after all health checks pass.

> [!IMPORTANT]
> **Dependency-First:** The system follows a strict order of initialization to prevent runtime crashes.

---

## 📊 Startup Flow Architecture

### System Bootstrap Lifecycle
![Sequence Diagram: System Bootstrap & Initialization](/docs/images/startserver.png)

---

> [!NOTE]
> The server is only "Ready" once the health-check endpoint returns a 200 OK across all integrated services.`,
    },
    {
        id: "worker-overview",
        title: "Worker Overview",
        category: "Worker System",
        content: `# 🏗️ Worker System Architecture

The **Worker Service** is the high-performance, asynchronous engine that powers background operations, scheduled tasks (Cron), and event-driven data processing for TaskBoard.

---

## 🏛️ 1. Architecture Logic: The Decoupled Engine
TaskBoard's Worker is designed as a standalone microservice that communicates with the main system via **RabbitMQ**. This separation ensures that heavy tasks do not impact the core API's responsiveness.

> [!TIP]
> **Performance Scaling:** The Worker service can be horizontally scaled independently to handle millions of background jobs without affecting user latency on the frontend.

### 🔹 Strategic Responsibilities
- ⚡ **Latency Offloading:** Handling I/O intensive tasks like Email sending or API notifications.
- 💾 **Data Aggregation:** Updating denormalized stats and analytics logs in real-time.
- ⏱️ **Scheduled Maintenance:** Executing time-based management jobs (Daily Summaries).

---

## 📡 2. Infrastructure Integrations
| Component | Role | Logic |
| :--- | :--- | :--- |
| **RabbitMQ** | Message Broker | Topic Exchange for flexible event routing. |
| **MongoDB** | Primary Store | Persistent storage for Audit Logs and Summaries. |
| **Redis** | Speed Layer | Temporary storage for OTPs and high-speed caching. |

---

## 📊 Worker System Blueprint
This diagram visualizes the internal structure of the Worker and its interaction with infrastructure layers.

![Worker System Architecture Map](/docs/images/worker/worker-overview.png)

---

> [!IMPORTANT]
> The Worker service implements an **Idempotent processing strategy**, ensuring that retried tasks do not cause duplicate data side effects.`,
    },
    {
        id: "consumer-taskboard",
        title: "Taskboard Consumer",
        category: "Worker Consumers",
        content: `# 🎧 Taskboard Master Consumer & Event Relay

The **Taskboard Master Consumer** is the "Central Nervous System" of the worker service. It manages complex event subscription patterns and orchestrates the parallel execution of specialized handlers.

---

## ⚡ 1. The Real-time Pulse: Event Distribution
The master consumer binds to the **taskboard.events** exchange, listening for specific patterns across our business modules.

### 🔹 Binding Patterns
- \`task.#\` (CRUD operations on items)
- \`otp.#\` (Security & Authentication events)
- \`comment.#\` (Engagement & Discussion spikes)
- \`project.#\` (Workspace management changes)

> [!NOTE]
> We use **Topic Exchanges** allowing specific listeners to "opt-in" to only the relevant streams of data, optimizing resource consumption.

---

## 📊 Event Processing Flow
This sequence diagram tracks exactly how a raw byte stream from RabbitMQ is transformed into system-wide updates.

![Taskboard Consumer Processing Flow](/docs/images/worker/taskboard-consumer.png)

---

## 🛠️ 2. Parallel Handler Orchestration
Instead of linear execution, the TaskBoard consumer utilizes a **Broadcast-Notify Pattern**:
1. **Validation:** Checks event schema integrity.
2. **Parallel Dispatch:** Executes Mail, Notify, Analytics, and Stats handlers simultaneously using \`Promise.all\` logic.
3. **Reliable ACK:** An acknowledgment is only sent to RabbitMQ when all internal operations achieve a "Success" state.

> [!TIP]
> **Fault Tolerance:** If any single handler fails, the entire message is safely rejected and can be rerouted to a Dead Letter Queue (DLQ).`,
    },
    {
        id: "job-daily-summary",
        title: "Daily Summary Job",
        category: "Worker Jobs",
        content: `# ⏱️ Daily Summary Engine (Cron)

The Summary Engine is a robust data-processing pipeline that transforms thousands of raw activity logs into insightful, human-readable productivity reports.

---

## 🚀 1. The Execution Lifecycle
Every day at **00:00 (TR Time)**, the cron mechanism triggers a specialized aggregation pipeline.

### 🔹 Step-by-Step Logic
- 🔍 **Scan:** Queries the **EventLog** for all activities within the last 24-hour window.
- 🧩 **Group:** Dynamically clusters activities based on unique user identities.
- ✍️ **Humanize:** Converts technical event codes into narrative messages (e.g., \`task.created\` -> *"Created Task X"*).
- 💾 **Commit:** Updates the \`UserDailySummary\` collection with a unique Date+User constraint.

---

## 📊 Data Aggregation Flow
This flowchart describes the extraction-transformation-loading (ETL) process of the daily job.

![Daily Summary Job Logic Map](/docs/images/worker/daily-summary.png)

---

## 📈 2. Denormalized Insights
Beyond just messages, the job computes a set of high-level statistics:
| Metric | Description |
| :--- | :--- |
| **Velocity** | Ratio of Tasks Created vs. Updated. |
| **Engagement** | Frequency of comments and project participation. |
| **Growth** | New projects initialized or joined. |

> [!NOTE]
> Summaries are stored in a **ready-to-serve** format, allowing the frontend to display rich activity feeds without complex server-side joins.`,
    },
    // ==================== FRONTEND DOCS ====================
    {
        id: "frontend-overview",
        title: "Frontend Overview",
        category: "Frontend Core",
        content: `# 🏗️ Frontend Architecture Overview

The TaskBoard frontend is a modern **React 19** application built with **Vite**, featuring real-time updates, optimistic UI patterns, and a component-driven architecture designed for maximum developer productivity and user experience.

---

## 🎯 Design Philosophy

TaskBoard's frontend follows these core principles:

1. **Feature-First Organization** - Code is organized by business domain, not by technical role
2. **Colocation** - Related files (components, hooks, tests) live together
3. **Shared Core** - Common utilities extracted to \`@packages/ui\` and \`@packages/common\`
4. **Real-time First** - Socket.io integration baked into the architecture from day one

---

## ⚡ Tech Stack

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | 19.x | UI Framework with concurrent rendering |
| **Vite** | 6.x | Lightning-fast HMR and optimized builds |
| **React Router** | 7.x | Declarative client-side routing |
| **TanStack Query** | 5.x | Async state management with caching |
| **Zustand** | 5.x | Lightweight global state |
| **Socket.io Client** | 4.x | WebSocket abstraction for real-time |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **Formik + Yup** | - | Form management and validation |
| **Lucide React** | - | Icon library |
| **date-fns** | - | Date manipulation |

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
- \`--primary\` - Brand color (indigo)
- \`--secondary\` - Supporting color
- \`--destructive\` - Error/delete actions
- \`--muted\` - Subtle backgrounds

### Dark Mode
Managed by \`ThemeProvider\` with localStorage persistence:
\`\`\`jsx
<ThemeProvider defaultTheme="dark" storageKey="taskboard-theme">
\`\`\`

---

## 🔗 Package Imports

| Source | Usage |
| :--- | :--- |
| \`@packages/ui\` | Button, Card, Dialog, Input, Table, etc. |
| \`@packages/common/constants\` | TaskStatus, TaskPriority enums |
| \`@packages/common/schemas\` | Validation schemas (shared with backend) |
| \`@/app/components/ui\` | App-specific: AlertDialog, Select, Toast |
| \`@/app/hooks\` | useAuth, useSocket, useToast |

> [!TIP]
> The \`@\` alias is configured in \`vite.config.js\` to point to \`src/app/\`.

---

## 🚀 Development Commands

| Command | Description |
| :--- | :--- |
| \`pnpm dev\` | Start dev server (HMR enabled) |
| \`pnpm build\` | Production build |
| \`pnpm preview\` | Preview production build |
| \`pnpm test\` | Run tests with Vitest |
| \`pnpm lint\` | ESLint check |

---

## 📈 Performance Optimizations

1. **Code Splitting** - Routes are lazily loaded
2. **Query Caching** - TanStack Query caches API responses
3. **Optimistic Updates** - UI updates before server confirms
4. **Delta Updates** - Socket sends only changed data
5. **Debounced Search** - Prevents excessive API calls

> [!NOTE]
> The production bundle is ~930KB gzipped to ~288KB, with opportunities for further splitting.`,
    },
    {
        id: "frontend-routing",
        title: "Routing & Navigation",
        category: "Frontend Core",
        content: `# 🧭 Routing & Navigation

TaskBoard uses **React Router v7** with protected routes and layout-based organization.

---

## 📍 Route Table

| Path | Component | Auth Required |
| :--- | :--- | :--- |
| \`/login\` | Login | ❌ |
| \`/register\` | Register | ❌ |
| \`/dashboard\` | Dashboard | ✅ |
| \`/projects\` | ProjectsList | ✅ |
| \`/projects/:id\` | ProjectDetail | ✅ |
| \`/tasks/:id\` | TaskDetail | ✅ |
| \`/profile\` | Profile | ✅ |
| \`/docs\` | Documentation | ❌ |

---

## 🛡️ Protected Routes

Routes requiring authentication are wrapped with a guard that:
1. Checks for valid session cookies
2. Redirects to \`/login\` if unauthorized
3. Preserves the intended destination for post-login redirect

> [!NOTE]
> Authentication state is managed by Zustand store and synced with cookie-based sessions.`,
    },
    {
        id: "frontend-state",
        title: "State Management",
        category: "Frontend Core",
        content: `# 📊 State Management

TaskBoard uses a **hybrid state strategy** combining Zustand for client state and TanStack Query for server state.

---

## 🔄 TanStack Query Patterns

- **Automatic caching** with configurable stale times
- **Background refetching** for fresh data
- **Optimistic updates** for instant UI feedback
- **Query invalidation** on mutations

> [!TIP]
> Socket events trigger \`queryClient.invalidateQueries()\` for real-time sync without polling.`,
    },
    {
        id: "frontend-auth",
        title: "Authentication Flow",
        category: "Frontend Features",
        content: `# 🔐 Authentication Flow

The frontend implements a secure **cookie-based authentication** flow with OTP verification.

---

## 🔄 Login Steps

1. User submits email/password
2. API validates and sends OTP via email
3. User enters OTP code
4. API sets httpOnly cookies (accessToken, refreshToken)
5. User redirected to dashboard

---

## 🍪 Cookie-Based Security

| Cookie | Purpose | Flags |
| :--- | :--- | :--- |
| \`accessToken\` | API authorization | httpOnly, secure, sameSite |
| \`refreshToken\` | Token refresh | httpOnly, secure, sameSite |

> [!IMPORTANT]
> Tokens are **never** stored in localStorage, preventing XSS attacks from stealing credentials.`,
    },
    {
        id: "frontend-realtime",
        title: "Real-time Updates",
        category: "Frontend Features",
        content: `# ⚡ Real-time Updates

TaskBoard uses **Socket.io** for instant data synchronization across all connected clients.

---

## 🔌 Socket Provider

The \`SocketProvider\` establishes and manages the WebSocket connection:
- Authenticates via cookie on connect
- Manages reconnection logic
- Provides socket instance via context

---

## 📡 Socket Events

| Event | Trigger | UI Effect |
| :--- | :--- | :--- |
| \`task.created\` | New task added | Refresh task list |
| \`task.updated\` | Task modified | Update task in place |
| \`comment.added\` | New comment | Append to comments |
| \`project.member.added\` | Member invited | Refresh member list |

> [!TIP]
> Joining a project room (\`socket.emit("project:join", id)\`) subscribes to all its events.`,
    },
    {
        id: "frontend-components",
        title: "UI Components",
        category: "Frontend UI",
        content: `# 🎨 UI Components

TaskBoard uses a layered component architecture with shared and app-specific components.

---

## 📦 Shared Components (@packages/ui)

Reusable across the entire monorepo:

| Component | Description |
| :--- | :--- |
| \`Button\` | Primary, secondary, ghost variants |
| \`Card\` | Container with header/content/footer |
| \`Dialog\` | Modal dialogs |
| \`Input\` / \`Label\` | Form inputs |
| \`Table\` | Data tables |
| \`Badge\` | Status indicators |
| \`Skeleton\` | Loading placeholders |

---

## 🎯 App-Specific Components

Located in \`apps/web/src/app/components/ui/\`:

| Component | Description |
| :--- | :--- |
| \`AlertDialog\` | Confirmation dialogs |
| \`DropdownMenu\` | Context menus |
| \`Select\` | Dropdown selects |
| \`Toast\` | Notifications |

---

## 📊 Widgets

Dashboard widgets in \`components/widgets/\`:
- **UserStatsWidget** - User productivity stats
- **DailySummaryWidget** - Daily activity feed

> [!NOTE]
> Shared components are imported from \`@packages/ui\`, app-specific from \`@/app/components/ui\`.`,
    },
    // ==================== PACKAGES DOCS ====================
    {
        id: "packages-overview",
        title: "Packages Overview",
        category: "Packages",
        content: `# 📦 Shared Packages Architecture

TaskBoard uses a **monorepo** structure with shared packages to ensure consistency across applications.

---

## 📊 Package Overview

![Packages Overview](/docs/images/frontend/packages-overview.png)

---

## 🔗 Import Paths

| Package | Import Path |
| :--- | :--- |
| UI Components | \`@packages/ui\` |
| Schemas | \`@packages/common/schemas\` |
| Constants | \`@packages/common/constants\` |

> [!TIP]
> Shared validation schemas ensure frontend and backend enforce identical rules.`,
    },
    {
        id: "packages-ui",
        title: "@packages/ui",
        category: "Packages",
        content: `# 🎨 @packages/ui - Component Library

A collection of **shadcn/ui** based components shared across the frontend.

---

## 📦 Available Components (10)

| Component | File | Description |
| :--- | :--- | :--- |
| **Button** | \`button.jsx\` | Multiple variants & sizes |
| **Badge** | \`badge.jsx\` | Status indicators |
| **Card** | \`card.jsx\` | Container with sections |
| **Dialog** | \`dialog.jsx\` | Modal windows |
| **Input** | \`input.jsx\` | Text input |
| **Label** | \`label.jsx\` | Form labels |
| **ScrollArea** | \`scroll-area.jsx\` | Custom scrollbar |
| **Sheet** | \`sheet.jsx\` | Side panels |
| **Skeleton** | \`skeleton.jsx\` | Loading state |
| **Table** | \`table.jsx\` | Data tables |

---

## 🛠️ Utilities

### cn() - Class Name Merger
\`\`\`javascript
import { cn } from "@packages/ui";

cn("base-class", condition && "conditional-class")
\`\`\`

> [!NOTE]
> Components are built on **Radix UI** primitives with **Tailwind CSS** styling.`,
    },
    {
        id: "packages-common",
        title: "@packages/common",
        category: "Packages",
        content: `# 🔗 @packages/common - Shared Logic

Validation schemas and constants shared between frontend and backend.

---

## 📋 Validation Schemas

| Schema | File | Used In |
| :--- | :--- | :--- |
| \`authSchema\` | \`auth.schema.js\` | Login, Register, OTP |
| \`taskSchema\` | \`task.schema.js\` | Task CRUD |
| \`projectSchema\` | \`project.schema.js\` | Project CRUD |
| \`commentSchema\` | \`comment.schema.js\` | Comments |
| \`userSchema\` | \`user.schema.js\` | Profile updates |

---

## 🎯 Constants

\`\`\`javascript
// constants.js
export const TaskStatus = {
  TODO: "Todo",
  IN_PROGRESS: "InProgress",
  DONE: "Done"
};

export const TaskPriority = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High"
};
\`\`\`

> [!IMPORTANT]
> Using shared constants prevents frontend/backend enum mismatches.`,
    },
];
