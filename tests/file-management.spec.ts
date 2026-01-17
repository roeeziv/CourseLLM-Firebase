import { test, expect } from '@playwright/test';
// CHANGE THIS IMPORT: Point to the new file, NOT ./setup


test.describe('File Management Page', () => {
test('teacher can access and view file management', async ({ page, request }) => {
const res = await request.get('http://localhost:9002/api/test-token?uid=teacher-1&role=teacher&createProfile=true');
expect(res.ok()).toBeTruthy();
const { token } = await res.json();
await page.goto(
    `http://localhost:9002/test/signin?token=${token}`
  );
await page.waitForURL('**/teacher', { timeout: 10000 });
await page.goto('http://localhost:9002/teacher/file-management');

// Use a slightly more resilient selector for the heading
await expect(page.getByRole('heading', { name: /file management/i }).first()).toBeVisible();
// Check for upload button presence
await expect(page.getByRole('button', { name: /upload file/i })).toBeVisible();});

test('student cannot access file management', async ({ page,request }) => {
const res = await request.get('http://localhost:9002/api/test-token?uid=student-1&role=student&createProfile=true');
expect(res.ok()).toBeTruthy();
const { token } = await res.json();
await page.goto(
    `http://localhost:9002/test/signin?token=${token}`
  );
await page.waitForURL('**/student', { timeout: 10000 });
await page.goto('/teacher/file-management');


// Verify redirection occurs
await expect(page).not.toHaveURL('http://localhost:9002/teacher/file-management');

// Ensure the protected content is hidden
await expect(page.getByRole('heading', { name: /file management/i })).not.toBeVisible();
});
});