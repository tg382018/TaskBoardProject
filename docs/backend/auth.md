# Authentication Module

The Authentication module is the security gateway of TaskBoard. It implements a secure, asynchronous, and robust multi-step verification process to ensure user data integrity and prevent unauthorized access.

## 🔐 Core Capabilities

### 1. Robust User Onboarding

The system handles user registration with secure password hashing using **bcrypt**. Every new registration triggers a `user.registered` event via RabbitMQ, allowing the system to perform background tasks like sending welcome emails or initializing user stats without blocking the main API thread.

### 2. Secure Two-Step Login (OTP)

To enhance security, TaskBoard uses a **One-Time Password (OTP)** system for logins:

- **Step 1:** User submits credentials (email/password). The system validates the hash and publishes an `auth.login` event.
- **Background:** The Worker Service consumes the event, generates a 6-digit OTP, stores it in **Redis** with a 3-minute TTL, and sends it to the user's email.
- **Step 2:** The user submits the OTP. The API validates it against Redis. Upon success, the OTP is immediatey deleted (Burn-on-use).

### 3. Session & Token Management

The system uses a stateful JWT approach for maximum security:

- **Access Token:** Short-lived (15 minutes) token for API authorization.
- **Refresh Token:** Long-lived (7 days) token stored in a dedicated `Sessions` collection in MongoDB.
- **Token Rotation:** Every time a token is refreshed, the old session is invalidated and a new pair is issued, preventing replay attacks.

### 4. Security Middlewares

- **Rate Limiting:** Protects sensitive auth endpoints from brute-force and DDoS attacks using Redis-backed counters.
- **Validation:** Strict schema validation for all incoming requests using Joi/Zod to prevent injection and malformed data.

## 📊 Flow Diagrams

### Authentication Lifecycle

The following sequence diagram provides a deep dive into the interactions between the Client, API, MongoDB, Redis, and the Background Worker.

![Authentication Lifecycle Flow](/docs/images/auth1.png)

### Logical Endpoint Flow

A flowchart representation of the decision-making logic inside the Auth controllers (Validation, Database checks, and Event publishing).

![Logical Endpoint Flow](/docs/images/auth2.png)
