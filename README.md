# Schedulab - Process & Disk Scheduling Visualizer

Interactive simulator for CPU and Disk scheduling algorithms with Firebase Authentication.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Fill `.env` with your Firebase Web App config.
4. Start dev server:
   ```bash
   npm run dev
   ```

## Firebase auth setup checklist

If Signup/Login fails, check these first:

1. Firebase Console -> Authentication -> Sign-in method -> enable `Email/Password`.
2. Firebase Console -> Authentication -> Settings -> Authorized domains:
   add `localhost` and `127.0.0.1`.
3. Ensure `.env` keys match the same Firebase project where auth is enabled.

## Build

```bash
npm run build
```
