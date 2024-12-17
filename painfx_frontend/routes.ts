/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const PUBLIC_ROUTES: string[] = [
  "/",
  "/about",
  "/password-reset/[uid]/[token]",
  "/activation/[uid]/[token]",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const AUTH_ROUTES: string[] = [
  "/sign-in",
  "/sign-up",
  "/password-reset",
  "/password-reset",
  "/activation",
  "/google"
];

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/X";