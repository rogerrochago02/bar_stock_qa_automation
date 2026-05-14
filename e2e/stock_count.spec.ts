import { test, expect } from '@playwright/test';

test('stock count', async ({ page }) => {

    await page.goto('127.0.0.1:5500/Stock_system/index.html');

    await page.getByRole('button', { name: 'Stock Count' }).click();
    await expect(page.getByRole('heading', { name: 'Stock Count' })).toBeVisible();

    //preencher os campos de quantidade para cada produto
    await page.locator('[data-product="Beer"]').fill('200');
    await page.locator('[data-product="Coca-Cola"]').fill('120');
    await page.locator('[data-product="Vodka"]').fill('150');
    await page.locator('[data-product="Water"]').fill('300');
    await page.locator('[data-product="Wine"]').fill('130');
    await page.locator('[data-product="Tequila"]').fill('120');
    await page.locator('[data-product="Energy Drink"]').fill('160');
    await page.locator('[data-product="Tea"]').fill('80');
    await page.locator('[data-product="Coffee"]').fill('100');
    await page.locator('[data-product="Gin"]').fill('180');
    
    //enviar o formulário de contagem de estoque
    await page.locator("#saveStockBtn").click();
    await expect(page.getByText('Stock count saved successfully')).toBeVisible();

    await page.getByRole('button', {name: "History"}).click();

    await expect(page.locator('#historyList')).toContainText('Current Stock Updated');
});