# TaskBoard Postman Collection

This directory contains Postman collection and environment files for testing the TaskBoard API.

## Files

| File                                       | Description                                 |
| ------------------------------------------ | ------------------------------------------- |
| `TaskBoard.postman_collection.json`        | Complete API collection with all endpoints  |
| `TaskBoard-Local.postman_environment.json` | Environment variables for local development |

## Quick Start

### 1. Import into Postman

1. Open Postman
2. Click **Import** button
3. Drag both files or select them
4. Collection and environment will be imported

### 2. Select Environment

1. In the top-right corner, click the environment dropdown
2. Select **TaskBoard - Local**

### 3. Authenticate

1. Run **Auth > Register** or **Auth > Login**
2. Check console for OTP (or run **Auth > [Dev] Get OTP**)
3. Run **Auth > Verify OTP** with the code
4. Cookies are automatically saved!

### 4. Start Testing

Now you can test any authenticated endpoint. Update environment variables as needed:

- `projectId` - Set after creating a project
- `taskId` - Set after creating a task

## API Overview

| Module   | Endpoints | Description                        |
| -------- | --------- | ---------------------------------- |
| Auth     | 9         | Registration, login, OTP, sessions |
| Users    | 3         | Profile, daily summary             |
| Stats    | 1         | User statistics                    |
| Projects | 7         | CRUD, members, logs                |
| Tasks    | 5         | CRUD with filters                  |
| Comments | 2         | List and create                    |

## Authentication

The API uses **cookie-based authentication**:

- `accessToken` - Valid for 15 minutes
- `refreshToken` - Valid for 7 days

Postman automatically manages cookies after login.

## Status & Priority Values

### Task Status

| Value        | Description       |
| ------------ | ----------------- |
| `Todo`       | Not started       |
| `InProgress` | Currently working |
| `Done`       | Completed         |

### Task Priority

| Value    | Description               |
| -------- | ------------------------- |
| `Low`    | Low priority              |
| `Medium` | Medium priority (default) |
| `High`   | High priority             |
