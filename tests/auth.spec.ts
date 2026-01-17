import { test, expect } from '@playwright/test';

const SHORT_TIMEOUT_CONSTANT=5000
const TIMEOUT_CONSTANT=10000
const LONG_TIMEOUT_CONSTANT=20000
test('1 - first login redirects to onboarding', async ({ page, request }) => {
  const res = await request.get('http://localhost:9002/api/test-token?uid=first-login-1&createProfile=false');
  expect(res.ok()).toBeTruthy();
  const data = await res.json();
  const token = data.token;

  await page.goto(
    `http://localhost:9002/test/signin?token=${token}`
  );
  await page.waitForURL('**/onboarding', { timeout: TIMEOUT_CONSTANT });
});

test('2 - teacher only access to /teacher pages', async ({ page, request }) => {
  const res = await request.get('http://localhost:9002/api/test-token?uid=teacher-1&role=teacher&createProfile=true');
  expect(res.ok()).toBeTruthy();
  const { token } = await res.json();

  await page.goto(
    `http://localhost:9002/test/signin?token=${token}`
  );
  await page.waitForURL('**/teacher', { timeout: LONG_TIMEOUT_CONSTANT });

  // Try to access student page — should be redirected back to teacher dashboard
  await page.goto('http://localhost:9002/student');
  await page.waitForURL('**/teacher', { timeout: SHORT_TIMEOUT_CONSTANT });
});

test('3 - student only access to /student pages', async ({ page, request }) => {
  const res = await request.get('http://localhost:9002/api/test-token?uid=student-1&role=student&createProfile=true');
  expect(res.ok()).toBeTruthy();
  const { token } = await res.json();

  await page.goto(
    `http://localhost:9002/test/signin?token=${encodeURIComponent(token)}`
  );
  await page.waitForURL('**/student', { timeout: TIMEOUT_CONSTANT });

  // Try to access teacher page — should be redirected back to student dashboard
  await page.goto('http://localhost:9002/teacher');
  await page.waitForURL('**/student', { timeout: SHORT_TIMEOUT_CONSTANT });
});
