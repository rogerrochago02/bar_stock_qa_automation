import { test, expect } from '@playwright/test';

test('remove products until zero in stock', async ({ page }) => {
      test.setTimeout(120000);
  await page.goto('http://127.0.0.1:5500/Stock_system/index.html');

  const products = [
    { name: 'Beer', stock: 280 },
    { name: 'Coca-Cola', stock: 120 },
    { name: 'Vodka', stock: 150 },
    { name: 'Water', stock: 300 },
    { name: 'Wine', stock: 130 },
    { name: 'Tequila', stock: 120 },
    { name: 'Energy Drink', stock: 160 },
    { name: 'Tea', stock: 80 },
    { name: 'Coffee', stock: 100 },
    { name: 'Gin', stock: 180 }
  ];

  const withdrawalStep = 100;

  //registro do estoque inicial

  await page.getByRole('button', { name: 'Stock Count' }).click();

  for (const product of products) {
    await page.locator(`[data-product="${product.name}"]`).fill(String(product.stock));
  }

  await page.locator('#saveStockBtn').click();

  await expect(page.getByText("Stock count saved successfully")).toBeVisible();


  //inicio do loop de retirada dos produtos

  await page.getByRole('button', { name: 'Record Stock' }).click();

for (const product of products) {
 while (product.stock > 0) {
  const quantityToWithdraw = Math.min(withdrawalStep, product.stock);

  await page.getByRole('button', { name: 'Stock Out', exact: true }).click();

  await page.getByRole('button', { name: product.name, exact: true }).click();

  await page.locator('#quantity').fill(String(quantityToWithdraw));

  await page.getByRole('button', { name: 'Main Bar', exact: true }).click();

  await page.selectOption('#employee', { label: 'Maria Santos' });

  await page.getByRole('button', { name: 'Submit', exact: true }).click();

  await expect(page.locator('#employee')).toHaveValue('');

  product.stock = product.stock - quantityToWithdraw;
}

  // Depois que o produto chegou a 0, tenta retirar mais 1
  await page.getByRole('button', { name: 'Stock Out', exact: true }).click();

  await page.getByRole('button', { name: product.name, exact: true }).click();

  await page.locator('#quantity').fill('1');

  await page.getByRole('button', { name: 'Main Bar', exact: true }).click();

  await page.selectOption('#employee', { label: 'Maria Santos' });

    page.once('dialog', async dialog => {
    expect(dialog.message()).toMatch(/not enough stock/i);
    await dialog.accept();
    });

    await page.getByRole('button', { name: 'Submit', exact: true }).click();
}
    
})