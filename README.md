# CourseLLM

This repository contains the `file-managment-ui-crud-llmexp` branch featuring the updated UI, Firebase integration, and course management tools.

## 📋 Prerequisites

* Node.js 18+
* npm (pnpm/yarn/nx are **not** required)

## 🚀 Getting Started

### 1. Installation
```bash
npm install


2. Environment Configuration
⚠️ Important: The sensitive configuration keys are not included in the repository.

Check your email for the full .env.local content.

Create a file named .env.local in the root directory and paste the contents provided in the email. It should look like this:
# Firebase Configuration (Production)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ... other keys ...

# Feature Flags
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false

🏃‍♂️ How to Run
You can run the application in two modes: Live (Connected to Cloud) or Local (Emulators).

# Option A: Live Firebase 
This connects your local localhost to the real production database and authentication.
create .env.local with the firebase credentials I sent you.

```bash
npm run dev


URL: http://localhost:9002

# Option B: Local Emulators:
put in .env.local:

NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true

* Terminal 1 (Start Emulators):
```bash
npm run emulator:start

Wait for "All emulators ready".

* Terminal 2 (Start App):
```bash
npm run dev:emulator

* URL: http://localhost:9002

* Emulator UI: http://localhost:4000 (View Firestore/Auth data here)

# Login & Roles
The application supports Student and Teacher roles.

Sign Up: Any new Google Sign-In defaults to the Student role.

Teacher Access:

I have sent my personal Google credentials via email.

Please use these credentials to log in if you need to verify Teacher permissions.

# Testing
We use Jest for unit tests and Playwright for E2E testing.

* Unit Tests:
```bash
npm run test
* End-to-End (E2E) Tests:
```bash
npm run test:e2e

* Type Check:

npm run typecheck

* lint check:

```bash
npm run lint

# monitoring:
I added page in sidebar named monitoring that conatains all the data.