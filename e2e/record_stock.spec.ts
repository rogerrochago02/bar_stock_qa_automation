import { test, expect } from '@playwright/test';

test ('stock out', async ({ page }) => {

    await page.goto('127.0.0.1:5500/Stock_system/index.html');

    await page.getByRole('button', { name: 'Stock Out' }).click();

    await page.getByRole('button', { name: "Beer" }).click();

    await page.locator('#quantity').fill('50');
    await page.getByRole('button', { name: "Main Bar" }).click();

    await page.selectOption("#employee", "Maria Santos");
    await page.getByRole('button', { name: "Submit" }).click();
    await expect(page.getByText('Completed successfully')).toBeVisible();

    //history
    await page.getByRole('button', {name: "History"}).click();
    await expect(page.locator('#historyList')).toContainText('Beer (50) STOCK OUT');

    //Return to stock
    await page.getByRole('button', { name: 'Record Stock' }).click();

     await page.getByRole('button', { name: 'Return to Stock' }).click();

    await page.getByRole('button', { name: "Beer" }).click();

    await page.locator('#quantity').fill('20');
    await page.getByRole('button', { name: "Main Bar" }).click();

    await page.selectOption("#employee", "Maria Santos");
    await page.getByRole('button', { name: "Submit" }).click();
    await expect(page.getByText('Completed successfully')).toBeVisible();

    //history return to stock

    await page.getByRole('button', {name: "History"}).click();
    await expect(page.locator('#historyList')).toContainText('Beer (20) RETURN TO STOCK');

})