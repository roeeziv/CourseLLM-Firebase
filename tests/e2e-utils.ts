import { Page, expect } from '@playwright/test';

/**
 * Creates a fresh random user, logs them in, and returns their email.
 * This simulates a "New User" flow to test Onboarding.
 */
export async function createAndLoginNewUser(page: Page) {
  // 1. Go to the login page so the app loads and Firebase SDK initializes
  await page.goto('/login');

  // 2. Wait for the Firebase Auth object to be exposed (from Step 2)
  await page.waitForFunction(() => (window as any)._firebaseAuth);

  // 3. Generate random credentials
  const uniqueId = Date.now();
  const email = `test.teacher.${uniqueId}@example.com`;
  const password = 'TestPassword123!';

  // 4. Create user programmatically (bypassing Google UI)
  // This automatically signs the user in!
  await page.evaluate(async ({ email, password }) => {
    const auth = (window as any)._firebaseAuth;
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    await createUserWithEmailAndPassword(auth, email, password);
  }, { email, password });

  return { email, password };
}

/**
 * Clean up: Deletes the currently logged-in user.
 */
export async function deleteCurrentUser(page: Page) {
  await page.evaluate(async () => {
    const auth = (window as any)._firebaseAuth;
    if (auth.currentUser) {
      await auth.currentUser.delete();
    }
  });
}