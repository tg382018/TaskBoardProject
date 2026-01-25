# 🚀 System Bootstrap & Initialization

The Server Startup process is the critical orchestration layer of TaskBoard. It ensures that the environment is secure, dependencies are healthy, and all communication channels are primed before the first user request is accepted.

---

## 🛠️ The Bootstrap Lifecycle

Our initialization sequence follows a strict **Dependency-First** order to prevent system crashes due to unavailable resources.

### 🔹 1. Environment & Configuration

The system begins by loading and validating environment variables via `dotenv`. We use strict schema validation to ensure that critical keys (like `MONGO_URI` or `JWT_SECRET`) are present before proceeding.

> [!CAUTION]
> **Validation Failure:** If a required environment variable is missing, the system will intentionally trigger a `SIGTERM` and exit to prevent running in an unstable or insecure state.

### 🔹 2. Connectivity Loader (Infrastructure)

The heart of the bootstrap process is the **Infrastructure Loader**:

- **MongoDB:** Establishing the primary data connection.
- **Redis:** Initializing the caching client for session and rate-limit tracking.
- **RabbitMQ:** Connecting to the message broker and asserting the exchange/queue topology.

### 🔹 3. Security & Middleware Mounting

Once infrastructure is ready, we configure the **Express.js** engine:

- **Security Headers:** Implementing `Helmet.js` and CORS policies.
- **Rate Limiting:** Attaching Redis-backed limiters to protect endpoints.
- **Parsers:** Configuring specialized JSON and URL-encoded body parsers.

### 🔹 4. Domain Module Discovery

The system dynamically mounts the business modules from `src/modules`. This modular approach ensures that adding a new feature (like "Invoices") doesn't require complex changes to the server's core startup logic.

---

## 🔐 Initialization Matrix

| Phase         | Technology       | Criticality |
| :------------ | :--------------- | :---------- |
| **Config**    | `Dotenv` / `Joi` | 🔴 Blocked  |
| **Storage**   | `Mongoose`       | 🔴 Blocked  |
| **Cache**     | `IORedis`        | 🟡 Warning  |
| **Messaging** | `Amqplib`        | 🔴 Blocked  |
| **Real-time** | `Socket.io`      | 🟡 Warning  |

> [!NOTE]
> We implement **Retry Logic** for infrastructure connections. If RabbitMQ is temporarily unreachable during startup (e.g., during container orchestration), the system will attempt to reconnect before timing out.

---

## 📊 Startup Flow Architecture

The following diagram illustrates the sequential execution of loaders and the decision-making logic used during the system's "Cold Start."

![Sequence Diagram: System Bootstrap & Initialization](/docs/images/startserver.png)

---

> [!IMPORTANT]
> **Healthy State:** The server only emits the `Server Listening` console log once the `app.get('/health')` endpoint returns a `200 OK` status across all dependency health checks.
