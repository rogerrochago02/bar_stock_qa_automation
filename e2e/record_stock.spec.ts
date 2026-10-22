import { test, expect } from './fixtures';

test('records stock out and return to stock', async ({ page }) => {
  await page.goto('/Stock_system/index.html');

  await page.getByRole('button', { name: 'Stock Count' }).click();
  await page.locator('.stock-input[data-product="Beer"]').fill('100');
  await page.getByRole('button', { name: 'Save Stock Count' }).click();
  await expect(page.getByText('Stock count saved successfully')).toBeVisible();

  await page.getByRole('button', { name: 'Record Stock' }).click();
  await page.getByRole('button', { name: 'Stock Out', exact: true }).click();
  await page.getByRole('button', { name: 'Beer', exact: true }).click();
  await page.locator('#quantity').fill('50');
  await page.getByRole('button', { name: 'Main Bar', exact: true }).click();
  await page.selectOption('#employee', 'Maria Santos');
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(page.getByText('Completed successfully')).toBeVisible();

  await page.getByRole('button', { name: 'History' }).click();
  await expect(page.locator('#historyList')).toContainText('Beer (50)');
  await expect(page.locator('#historyList')).toContainText('STOCK OUT');

  await page.getByRole('button', { name: 'Record Stock' }).click();
  await page.getByRole('button', { name: 'Return to Stock', exact: true }).click();
  await page.getByRole('button', { name: 'Beer', exact: true }).click();
  await page.locator('#quantity').fill('20');
  await page.getByRole('button', { name: 'Main Bar', exact: true }).click();
  await page.selectOption('#employee', 'Maria Santos');
  await page.getByRole('button', { name: 'Submit', exact: true }).click();

  await page.getByRole('button', { name: 'History' }).click();
  await expect(page.locator('#historyList')).toContainText('Beer (20)');
  await expect(page.locator('#historyList')).toContainText('RETURN TO STOCK');
});
