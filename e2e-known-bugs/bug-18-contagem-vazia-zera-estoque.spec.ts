import { test, expect } from '../e2e/fixtures';

const PRODUTOS = [
  'Beer',
  'Coca-Cola',
  'Vodka',
  'Water',
  'Wine',
  'Tequila',
  'Energy Drink',
  'Tea',
  'Coffee',
  'Gin',
];

test(
  'BUG-18: contagem vazia deve ser recusada e preservar o estoque',
  {
    annotation: {
      type: 'bug',
      description:
        'BUG-18 (major/P1) — Esperado: salvar a contagem sem nenhum valor informado é recusado e o estoque anterior continua igual. Atual: os 10 produtos vão para 0 e aparece "Stock count saved successfully".',
    },
  },
  async ({ page }, testInfo) => {
    await page.goto('/Stock_system/index.html');

    // Pré-condição: estoque de 10 unidades por produto (total 100).
    await page.getByRole('button', { name: 'Stock Count' }).click();
    for (const produto of PRODUTOS) {
      await page.locator(`.stock-input[data-product="${produto}"]`).fill('10');
    }
    await page.getByRole('button', { name: 'Save Stock Count' }).click();
    await expect(page.getByText('Stock count saved successfully')).toBeVisible();

    await page.getByRole('button', { name: 'History' }).click();
    const beer = page.locator('.stock-card').filter({ hasText: 'Beer' }).locator('strong');
    await expect(beer).toHaveText('10');
    await page.screenshot({ path: testInfo.outputPath('antes.png'), fullPage: true });

    // Ação do defeito: salvar a contagem sem preencher nenhum campo.
    await page.getByRole('button', { name: 'Stock Count' }).click();
    for (const produto of PRODUTOS) {
      await page.locator(`.stock-input[data-product="${produto}"]`).fill('');
    }
    await page.getByRole('button', { name: 'Save Stock Count' }).click();

    // Comportamento correto: Beer continua com 10. Com o defeito, vira 0.
    await page.getByRole('button', { name: 'History' }).click();
    await expect(
      beer,
      'BUG-18: a contagem vazia deveria ser recusada e o estoque anterior deveria continuar em 10; o app zerou o estoque'
    ).toHaveText('10');
  }
);
