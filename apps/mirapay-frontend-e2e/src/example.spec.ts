import { test, expect } from '@playwright/test';

test('has dashboard title', async ({ page }) => {
  await page.goto('/');

  // Expect h1 to contain the dashboard title.
  await expect(page.locator('h1')).toContainText(
    'Bienvenue sur votre tableau de bord',
  );
});

test('shows transaction table', async ({ page }) => {
  await page.goto('/');
  const table = page.locator('.transaction-table');
  await expect(table).toBeVisible();

  const rows = table.locator('tbody tr');
  await expect(rows).toHaveCount(3);
});
