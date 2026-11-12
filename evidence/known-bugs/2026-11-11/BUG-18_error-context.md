# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-known-bugs\bug-18-contagem-vazia-zera-estoque.spec.ts >> BUG-18: contagem vazia deve ser recusada e preservar o estoque
- Location: e2e-known-bugs\bug-18-contagem-vazia-zera-estoque.spec.ts:16:5

# Error details

```
Error: BUG-18: a contagem vazia deveria ser recusada e o estoque anterior deveria continuar em 10; o app zerou o estoque

expect(locator).toHaveText(expected) failed

Locator:  locator('.stock-card').filter({ hasText: 'Beer' }).locator('strong')
Expected: "10"
Received: "0"
Timeout:  5000ms

Call log:
  - BUG-18: a contagem vazia deveria ser recusada e o estoque anterior deveria continuar em 10; o app zerou o estoque locator('.stock-card').filter({ hasText: 'Beer' }).locator('strong') with timeout 5000ms
  - waiting for locator('.stock-card').filter({ hasText: 'Beer' }).locator('strong')
    14 × locator resolved to <strong>0</strong>
       - unexpected value "0"

```

```yaml
- strong: "0"
```

# Test source

```ts
  1  | import { test, expect } from '../e2e/fixtures';
  2  | 
  3  | const PRODUTOS = [
  4  |   'Beer',
  5  |   'Coca-Cola',
  6  |   'Vodka',
  7  |   'Water',
  8  |   'Wine',
  9  |   'Tequila',
  10 |   'Energy Drink',
  11 |   'Tea',
  12 |   'Coffee',
  13 |   'Gin',
  14 | ];
  15 | 
  16 | test(
  17 |   'BUG-18: contagem vazia deve ser recusada e preservar o estoque',
  18 |   {
  19 |     annotation: {
  20 |       type: 'bug',
  21 |       description:
  22 |         'BUG-18 (major/P1) — Esperado: salvar a contagem sem nenhum valor informado é recusado e o estoque anterior continua igual. Atual: os 10 produtos vão para 0 e aparece "Stock count saved successfully".',
  23 |     },
  24 |   },
  25 |   async ({ page }, testInfo) => {
  26 |     await page.goto('/Stock_system/index.html');
  27 | 
  28 |     // Pré-condição: estoque de 10 unidades por produto (total 100).
  29 |     await page.getByRole('button', { name: 'Stock Count' }).click();
  30 |     for (const produto of PRODUTOS) {
  31 |       await page.locator(`.stock-input[data-product="${produto}"]`).fill('10');
  32 |     }
  33 |     await page.getByRole('button', { name: 'Save Stock Count' }).click();
  34 |     await expect(page.getByText('Stock count saved successfully')).toBeVisible();
  35 | 
  36 |     await page.getByRole('button', { name: 'History' }).click();
  37 |     const beer = page.locator('.stock-card').filter({ hasText: 'Beer' }).locator('strong');
  38 |     await expect(beer).toHaveText('10');
  39 |     await page.screenshot({ path: testInfo.outputPath('antes.png'), fullPage: true });
  40 | 
  41 |     // Ação do defeito: salvar a contagem sem preencher nenhum campo.
  42 |     await page.getByRole('button', { name: 'Stock Count' }).click();
  43 |     for (const produto of PRODUTOS) {
  44 |       await page.locator(`.stock-input[data-product="${produto}"]`).fill('');
  45 |     }
  46 |     await page.getByRole('button', { name: 'Save Stock Count' }).click();
  47 | 
  48 |     // Comportamento correto: Beer continua com 10. Com o defeito, vira 0.
  49 |     await page.getByRole('button', { name: 'History' }).click();
  50 |     await expect(
  51 |       beer,
  52 |       'BUG-18: a contagem vazia deveria ser recusada e o estoque anterior deveria continuar em 10; o app zerou o estoque'
> 53 |     ).toHaveText('10');
     |       ^ Error: BUG-18: a contagem vazia deveria ser recusada e o estoque anterior deveria continuar em 10; o app zerou o estoque
  54 |   }
  55 | );
  56 | 
```