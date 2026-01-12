import { test, expect } from '@playwright/test';
import { createAndLoginNewUser, deleteCurrentUser } from './e2e-utils';

test.describe('New Teacher Onboarding Flow', () => {
  
  test('fresh user is redirected to onboarding and can become a teacher', async ({ page }) => {
    // 1. Create a brand new user (Log in programmatically)
    // The app should detect the new user and redirect to /onboarding (or whatever your role select route is)
    await createAndLoginNewUser(page);

    // 2. Verify we are on the Onboarding / Role Selection Page
    // (Based on your screenshot image_d70a71.png)
    await expect(page).toHaveURL(/.*onboarding/); 
    await expect(page.getByText('Set up your profile')).toBeVisible();

    // 3. Select "Teacher" Role
    await page.getByRole('button', { name: 'Teacher' }).click();

    // 4. Fill in Department (if required)
    const deptInput = page.getByPlaceholder('e.g. Computer Science');
    if (await deptInput.isVisible()) {
        await deptInput.fill('Computer Science');
    }

    // 5. Submit the form
    await page.getByRole('button', { name: 'Save and Continue' }).click();

    // 6. Verify we are redirected to Teacher Dashboard
    // Wait for the URL to change to the teacher area
    await expect(page).toHaveURL(/\/teacher/);
    
    // 7. Now we can test the File Management access
    await page.goto('/teacher/file-management');
    await expect(page.getByRole('heading', { name: /file management/i })).toBeVisible();
    
    // 8. Cleanup: Delete the temporary user
    await deleteCurrentUser(page);
  });
});