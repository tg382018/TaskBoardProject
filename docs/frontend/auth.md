# 🔐 Authentication Flow

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

| Cookie         | Purpose           | Flags                      |
| :------------- | :---------------- | :------------------------- |
| `accessToken`  | API authorization | httpOnly, secure, sameSite |
| `refreshToken` | Token refresh     | httpOnly, secure, sameSite |

> [!IMPORTANT]
> Tokens are **never** stored in localStorage, preventing XSS attacks from stealing credentials.
