import { test, expect } from '../e2e/fixtures';

test(
  'BUG-19: contagem deve recusar quantidade negativa',
  {
    annotation: {
      type: 'bug',
      description:
        'BUG-19 (major/P2) — Esperado: valor negativo é recusado, porque o campo declara min="0", e o estoque fica inalterado. Atual: aceita -5, salva e o cartão do produto mostra -5.',
    },
  },
  async ({ page }, testInfo) => {
    await page.goto('/Stock_system/index.html');

    // Pré-condição: Beer com 10 unidades.
    await page.getByRole('button', { name: 'Stock Count' }).click();
    await page.locator('.stock-input[data-product="Beer"]').fill('10');
    await page.getByRole('button', { name: 'Save Stock Count' }).click();
    await expect(page.getByText('Stock count saved successfully')).toBeVisible();

    await page.getByRole('button', { name: 'History' }).click();
    const beer = page.locator('.stock-card').filter({ hasText: 'Beer' }).locator('strong');
    await expect(beer).toHaveText('10');
    await page.screenshot({ path: testInfo.outputPath('antes.png'), fullPage: true });

    // Ação do defeito: tentar salvar -5 no campo Beer.
    await page.getByRole('button', { name: 'Stock Count' }).click();
    await page.locator('.stock-input[data-product="Beer"]').fill('-5');
    await page.getByRole('button', { name: 'Save Stock Count' }).click();

    // Comportamento correto: o valor negativo é recusado e Beer continua 10.
    await page.getByRole('button', { name: 'History' }).click();
    await expect(
      beer,
      'BUG-19: -5 no campo Beer deveria ser recusado (o campo declara min="0") e o estoque deveria continuar em 10; o app salvou o valor negativo'
    ).toHaveText('10');
  }
);
