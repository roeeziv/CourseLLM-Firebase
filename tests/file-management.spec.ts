import { test, expect } from '@playwright/test';
// CHANGE THIS IMPORT: Point to the new file, NOT ./setup
import { signInAs } from './e2e-utils'; 

test.describe('File Management Page', () => {
  test('teacher can access and view file management', async ({ page }) => {
    await signInAs(page, 'teacher');

    await page.goto('/teacher/file-management');

    // Use a slightly more resilient selector for the heading
    await expect(page.getByRole('heading', { name: /file management/i })).toBeVisible();
    
    // Check for upload button presence
    await expect(page.getByRole('button', { name: /upload file/i })).toBeVisible();
  });

  test('student cannot access file management', async ({ page }) => {
    await signInAs(page, 'student');

    await page.goto('/teacher/file-management');

    // Verify redirection occurs
    await expect(page).not.toHaveURL('/teacher/file-management');
    
    // Ensure the protected content is hidden
    await expect(page.getByRole('heading', { name: /file management/i })).not.toBeVisible();
  });
});