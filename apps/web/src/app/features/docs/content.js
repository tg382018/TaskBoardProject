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
];
