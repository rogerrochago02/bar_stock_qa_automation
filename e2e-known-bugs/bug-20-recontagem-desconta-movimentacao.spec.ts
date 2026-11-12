import { test, expect } from '../e2e/fixtures';

test(
  'BUG-20: recontagem deve valer como estoque atual, sem descontar saída antiga',
  {
    annotation: {
      type: 'bug',
      description:
        'BUG-20 (major/P1) — Esperado: depois de contar 200, o estoque de Beer é 200; a saída de 50 aconteceu antes da recontagem. Atual: o cartão mostra 150, porque renderStock desconta de novo todas as movimentações antigas.',
    },
  },
  async ({ page }, testInfo) => {
    await page.goto('/Stock_system/index.html');

    // Pré-condição: Beer = 100.
    await page.getByRole('button', { name: 'Stock Count' }).click();
    await page.locator('.stock-input[data-product="Beer"]').fill('100');
    await page.getByRole('button', { name: 'Save Stock Count' }).click();
    await expect(page.getByText('Stock count saved successfully')).toBeVisible();

    // Saída de 50 antes da recontagem.
    await page.getByRole('button', { name: 'Record Stock' }).click();
    await page.getByRole('button', { name: 'Stock Out', exact: true }).click();
    await page.getByRole('button', { name: 'Beer', exact: true }).click();
    await page.locator('#quantity').fill('50');
    await page.getByRole('button', { name: 'Main Bar', exact: true }).click();
    await page.selectOption('#employee', 'Maria Santos');
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.getByText('Completed successfully')).toBeVisible();

    await page.getByRole('button', { name: 'History' }).click();
    const beer = page.locator('.stock-card').filter({ hasText: 'Beer' }).locator('strong');
    await expect(beer).toHaveText('50');
    await page.screenshot({ path: testInfo.outputPath('antes.png'), fullPage: true });

    // Recontagem: Beer = 200. A contagem é o estoque atual.
    await page.getByRole('button', { name: 'Stock Count' }).click();
    await page.locator('.stock-input[data-product="Beer"]').fill('200');
    await page.getByRole('button', { name: 'Save Stock Count' }).click();
    await expect(page.getByText('Stock count saved successfully')).toBeVisible();

    // Comportamento correto: 200. Com o defeito, a saída de 50 é descontada de novo.
    await page.getByRole('button', { name: 'History' }).click();
    await expect(
      beer,
      'BUG-20: a recontagem de 200 é o estoque atual e deveria mostrar 200; o app descontou de novo a saída de 50 feita antes da recontagem'
    ).toHaveText('200');
  }
);
