# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-known-bugs\bug-20-recontagem-desconta-movimentacao.spec.ts >> BUG-20: recontagem deve valer como estoque atual, sem descontar saída antiga
- Location: e2e-known-bugs\bug-20-recontagem-desconta-movimentacao.spec.ts:3:5

# Error details

```
Error: BUG-20: a recontagem de 200 é o estoque atual e deveria mostrar 200; o app descontou de novo a saída de 50 feita antes da recontagem

expect(locator).toHaveText(expected) failed

Locator:  locator('.stock-card').filter({ hasText: 'Beer' }).locator('strong')
Expected: "200"
Received: "150"
Timeout:  5000ms

Call log:
  - BUG-20: a recontagem de 200 é o estoque atual e deveria mostrar 200; o app descontou de novo a saída de 50 feita antes da recontagem locator('.stock-card').filter({ hasText: 'Beer' }).locator('strong') with timeout 5000ms
  - waiting for locator('.stock-card').filter({ hasText: 'Beer' }).locator('strong')
    14 × locator resolved to <strong>150</strong>
       - unexpected value "150"

```

```yaml
- strong: "150"
```

# Test source

```ts
  1  | import { test, expect } from '../e2e/fixtures';
  2  | 
  3  | test(
  4  |   'BUG-20: recontagem deve valer como estoque atual, sem descontar saída antiga',
  5  |   {
  6  |     annotation: {
  7  |       type: 'bug',
  8  |       description:
  9  |         'BUG-20 (major/P1) — Esperado: depois de contar 200, o estoque de Beer é 200; a saída de 50 aconteceu antes da recontagem. Atual: o cartão mostra 150, porque renderStock desconta de novo todas as movimentações antigas.',
  10 |     },
  11 |   },
  12 |   async ({ page }, testInfo) => {
  13 |     await page.goto('/Stock_system/index.html');
  14 | 
  15 |     // Pré-condição: Beer = 100.
  16 |     await page.getByRole('button', { name: 'Stock Count' }).click();
  17 |     await page.locator('.stock-input[data-product="Beer"]').fill('100');
  18 |     await page.getByRole('button', { name: 'Save Stock Count' }).click();
  19 |     await expect(page.getByText('Stock count saved successfully')).toBeVisible();
  20 | 
  21 |     // Saída de 50 antes da recontagem.
  22 |     await page.getByRole('button', { name: 'Record Stock' }).click();
  23 |     await page.getByRole('button', { name: 'Stock Out', exact: true }).click();
  24 |     await page.getByRole('button', { name: 'Beer', exact: true }).click();
  25 |     await page.locator('#quantity').fill('50');
  26 |     await page.getByRole('button', { name: 'Main Bar', exact: true }).click();
  27 |     await page.selectOption('#employee', 'Maria Santos');
  28 |     await page.getByRole('button', { name: 'Submit', exact: true }).click();
  29 |     await expect(page.getByText('Completed successfully')).toBeVisible();
  30 | 
  31 |     await page.getByRole('button', { name: 'History' }).click();
  32 |     const beer = page.locator('.stock-card').filter({ hasText: 'Beer' }).locator('strong');
  33 |     await expect(beer).toHaveText('50');
  34 |     await page.screenshot({ path: testInfo.outputPath('antes.png'), fullPage: true });
  35 | 
  36 |     // Recontagem: Beer = 200. A contagem é o estoque atual.
  37 |     await page.getByRole('button', { name: 'Stock Count' }).click();
  38 |     await page.locator('.stock-input[data-product="Beer"]').fill('200');
  39 |     await page.getByRole('button', { name: 'Save Stock Count' }).click();
  40 |     await expect(page.getByText('Stock count saved successfully')).toBeVisible();
  41 | 
  42 |     // Comportamento correto: 200. Com o defeito, a saída de 50 é descontada de novo.
  43 |     await page.getByRole('button', { name: 'History' }).click();
  44 |     await expect(
  45 |       beer,
  46 |       'BUG-20: a recontagem de 200 é o estoque atual e deveria mostrar 200; o app descontou de novo a saída de 50 feita antes da recontagem'
> 47 |     ).toHaveText('200');
     |       ^ Error: BUG-20: a recontagem de 200 é o estoque atual e deveria mostrar 200; o app descontou de novo a saída de 50 feita antes da recontagem
  48 |   }
  49 | );
  50 | 
```