const AUTH_ERROR_MESSAGES = {
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/invalid-email": "Invalid email address.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password is too weak. Use at least 6 characters.",
  "auth/operation-not-allowed":
    "Email/password sign-in is disabled in Firebase Auth.",
  "auth/configuration-not-found":
    "Firebase Auth is not configured for this project.",
  "auth/network-request-failed":
    "Network issue detected. Check internet and retry.",
  "auth/unauthorized-domain":
    "This domain is not authorized in Firebase Authentication settings.",
  "auth/invalid-api-key":
    "Firebase API key is invalid. Check your Firebase config.",
  "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
    "Firebase API key is invalid. Check your Firebase config.",
};

export function getAuthErrorMessage(error, fallback = "Authentication failed.") {
  if (!error) {
    return fallback;
  }
  return AUTH_ERROR_MESSAGES[error.code] || `${fallback} (${error.code || "unknown_error"})`;
}
