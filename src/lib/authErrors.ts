export function getAuthErrorMessage(err: unknown): string {
  if (!err) return "An unexpected error occurred. Please try again.";

  // Firebase error code extraction
  const code =
    (err as { code?: string })?.code ||
    (typeof (err as { message?: string })?.message === "string" &&
      (err as { message: string }).message.match(/\((auth\/[^)]+)\)/)?.[1]) ||
    "";

  switch (code) {
    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase Console. Please add your domain (Vercel URL and custom domain) in Firebase Console > Authentication > Settings > Authorized domains.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
      return "Invalid email or password. Please check your credentials.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please sign in instead.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This user account has been disabled. Please contact support.";
    case "auth/operation-not-allowed":
      return "Email/Password sign-in is not enabled in Firebase Console. Please enable it under Authentication > Sign-in method.";
    case "auth/too-many-requests":
      return "Access temporarily blocked due to many failed attempts. Please reset your password or try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completing.";
    case "auth/popup-blocked":
      return "Popup was blocked by your browser. Please allow popups for this site.";
    default: {
      if (err instanceof Error) {
        const clean = err.message
          .replace(/^Firebase:\s*/i, "")
          .replace(/\s*\([^)]*\)\.?$/, "");
        return clean || "Authentication failed. Please try again.";
      }
      return "Authentication failed. Please try again.";
    }
  }
}
