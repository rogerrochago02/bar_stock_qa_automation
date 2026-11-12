# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-known-bugs\bug-19-contagem-aceita-negativo.spec.ts >> BUG-19: contagem deve recusar quantidade negativa
- Location: e2e-known-bugs\bug-19-contagem-aceita-negativo.spec.ts:3:5

# Error details

```
Error: BUG-19: -5 no campo Beer deveria ser recusado (o campo declara min="0") e o estoque deveria continuar em 10; o app salvou o valor negativo

expect(locator).toHaveText(expected) failed

Locator:  locator('.stock-card').filter({ hasText: 'Beer' }).locator('strong')
Expected: "10"
Received: "-5"
Timeout:  5000ms

Call log:
  - BUG-19: -5 no campo Beer deveria ser recusado (o campo declara min="0") e o estoque deveria continuar em 10; o app salvou o valor negativo locator('.stock-card').filter({ hasText: 'Beer' }).locator('strong') with timeout 5000ms
  - waiting for locator('.stock-card').filter({ hasText: 'Beer' }).locator('strong')
    13 × locator resolved to <strong>-5</strong>
       - unexpected value "-5"

```

```yaml
- strong: "-5"
```

# Test source

```ts
  1  | import { test, expect } from '../e2e/fixtures';
  2  | 
  3  | test(
  4  |   'BUG-19: contagem deve recusar quantidade negativa',
  5  |   {
  6  |     annotation: {
  7  |       type: 'bug',
  8  |       description:
  9  |         'BUG-19 (major/P2) — Esperado: valor negativo é recusado, porque o campo declara min="0", e o estoque fica inalterado. Atual: aceita -5, salva e o cartão do produto mostra -5.',
  10 |     },
  11 |   },
  12 |   async ({ page }, testInfo) => {
  13 |     await page.goto('/Stock_system/index.html');
  14 | 
  15 |     // Pré-condição: Beer com 10 unidades.
  16 |     await page.getByRole('button', { name: 'Stock Count' }).click();
  17 |     await page.locator('.stock-input[data-product="Beer"]').fill('10');
  18 |     await page.getByRole('button', { name: 'Save Stock Count' }).click();
  19 |     await expect(page.getByText('Stock count saved successfully')).toBeVisible();
  20 | 
  21 |     await page.getByRole('button', { name: 'History' }).click();
  22 |     const beer = page.locator('.stock-card').filter({ hasText: 'Beer' }).locator('strong');
  23 |     await expect(beer).toHaveText('10');
  24 |     await page.screenshot({ path: testInfo.outputPath('antes.png'), fullPage: true });
  25 | 
  26 |     // Ação do defeito: tentar salvar -5 no campo Beer.
  27 |     await page.getByRole('button', { name: 'Stock Count' }).click();
  28 |     await page.locator('.stock-input[data-product="Beer"]').fill('-5');
  29 |     await page.getByRole('button', { name: 'Save Stock Count' }).click();
  30 | 
  31 |     // Comportamento correto: o valor negativo é recusado e Beer continua 10.
  32 |     await page.getByRole('button', { name: 'History' }).click();
  33 |     await expect(
  34 |       beer,
  35 |       'BUG-19: -5 no campo Beer deveria ser recusado (o campo declara min="0") e o estoque deveria continuar em 10; o app salvou o valor negativo'
> 36 |     ).toHaveText('10');
     |       ^ Error: BUG-19: -5 no campo Beer deveria ser recusado (o campo declara min="0") e o estoque deveria continuar em 10; o app salvou o valor negativo
  37 |   }
  38 | );
  39 | 
```