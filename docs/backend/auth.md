# Authentication Module

The Authentication module is the security gateway of TaskBoard. It implements a secure, asynchronous, and robust multi-step verification process to ensure user data integrity and prevent unauthorized access.

## 🔐 Core Capabilities

### 1. Robust User Onboarding

The system handles user registration with secure password hashing using **bcrypt**. Every new registration triggers a `user.registered` event via RabbitMQ, allowing the system to perform background tasks like sending welcome emails or initializing user stats without blocking the main API thread.

### 2. Secure Two-Step Login (OTP)

To enhance security, TaskBoard uses a **One-Time Password (OTP)** system for logins:

- **Step 1:** User submits credentials (email/password). The system validates the hash and publishes an `auth.login` event.
- **Background:** The Worker Service consumes the event, generates a 6-digit OTP, stores it in **Redis** with a 3-minute TTL, and sends it to the user's email.
- **Step 2:** The user submits the OTP. The API validates it against Redis. Upon success, the OTP is immediately deleted (Burn-on-use).

### 3. Cookie-Based Token Management

> [!IMPORTANT]
> **Security Enhancement:** TaskBoard uses **httpOnly cookies** for token storage instead of localStorage, providing robust protection against XSS attacks.

The system uses a stateful JWT approach with secure cookie delivery:

| Token             | Lifetime   | Storage               | Flags                                    |
| ----------------- | ---------- | --------------------- | ---------------------------------------- |
| **Access Token**  | 15 minutes | `accessToken` cookie  | `httpOnly`, `secure`, `sameSite: strict` |
| **Refresh Token** | 7 days     | `refreshToken` cookie | `httpOnly`, `secure`, `sameSite: strict` |

**Key Security Features:**

- **No Client-Side Storage:** Tokens are never exposed to JavaScript, eliminating XSS token theft.
- **Automatic Transmission:** Cookies are automatically sent with every request by the browser.
- **Session Tracking:** Refresh tokens are stored in a dedicated `Sessions` collection in MongoDB for revocation support.
- **Token Rotation:** Every refresh operation invalidates the old session and issues a new pair, preventing replay attacks.

### 4. Multi-Device Session Management

Users can manage their active sessions across devices:

- `GET /auth/sessions` - List all active sessions
- `DELETE /auth/sessions/:id` - Revoke a specific session

### 5. Security Middlewares

- **Rate Limiting:** Protects sensitive auth endpoints (register, login, resend OTP) from brute-force attacks using Redis-backed counters. Limit: 5 requests per 5 minutes.
- **Validation:** Strict JSON Schema validation using **Ajv** for all incoming requests to prevent injection and malformed data.

## 📡 API Endpoints

| Endpoint               | Method | Description                    | Auth Required    |
| ---------------------- | ------ | ------------------------------ | ---------------- |
| `/auth/register`       | POST   | Register new user              | ❌               |
| `/auth/login`          | POST   | Login and request OTP          | ❌               |
| `/auth/resend`         | POST   | Resend OTP                     | ❌               |
| `/auth/verify`         | POST   | Verify OTP and get tokens      | ❌               |
| `/auth/refresh`        | POST   | Refresh access token           | ❌ (uses cookie) |
| `/auth/logout`         | POST   | Clear cookies and end session  | ❌               |
| `/auth/sessions`       | GET    | List active sessions           | ✅               |
| `/auth/sessions/:id`   | DELETE | Revoke a session               | ✅               |
| `/auth/dev/otp/:email` | GET    | [Dev only] Get OTP for testing | ❌               |

## 📊 Flow Diagrams

### Authentication Lifecycle

The following sequence diagram provides a deep dive into the interactions between the Client, API, MongoDB, Redis, and the Background Worker.

![Authentication Lifecycle Flow](/docs/images/auth1.png)

### Logical Endpoint Flow

A flowchart representation of the decision-making logic inside the Auth controllers (Validation, Database checks, and Event publishing).

![Logical Endpoint Flow](/docs/images/auth2.png)
