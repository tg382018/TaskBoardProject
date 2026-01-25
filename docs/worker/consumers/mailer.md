# 📧 Mailer Consumer

The Mailer consumer is responsible for all external email communications. By decoupling this from the API, we ensure that slow external SMTP or API calls never block the user's interface.

---

## 🛠️ Functional Logic

### 🔹 OTP Delivery

When a user requests a login, the API emits `otp.requested`. The Mailer consumer:

1. Receives the destination email.
2. Triggers the **Auth Provider Service**.
3. Generates a secure 6-digit code and stores it in **Redis**.
4. (Simulated) Dispatches the email to the user.

> [!NOTE]
> In the current version, the system uses a **StubAuthProvider** to simulate delivery, but it is architected to transition to SendGrid, Mailgun, or AWS SES with a single service change.

---

## 🔐 Reliability

> [!IMPORTANT]
> **External Failures:** Since email APIs can be flaky, this handler is designed to be idempotent. If a mail fails to send, the message can be requeued without causing duplicate OTP codes to crash the Redis session.
