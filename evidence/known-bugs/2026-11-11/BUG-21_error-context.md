# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-known-bugs\bug-21-referenceerror-no-carregamento.spec.ts >> BUG-21: carregamento deve terminar sem exceção não tratada
- Location: e2e-known-bugs\bug-21-referenceerror-no-carregamento.spec.ts:3:5

# Error details

```
Error: BUG-21: o carregamento deveria terminar sem exceção não tratada no console (trecho duplicado em script.js:336-345)

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "ReferenceError: record is not defined (at http://127.0.0.1:5500/Stock_system/script.js:336:42)",
+ ]
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - heading "📊 Stock Control" [level=1] [ref=e4]
    - generic [ref=e5]:
      - button "Stock Count" [ref=e6] [cursor=pointer]
      - button "Record Stock" [ref=e7] [cursor=pointer]
      - button "History" [ref=e8] [cursor=pointer]
  - generic [ref=e11]:
    - generic [ref=e12]:
      - generic [ref=e13]: "Type:"
      - generic [ref=e14]:
        - button "Return to Stock" [ref=e15] [cursor=pointer]
        - button "Stock Out" [ref=e16] [cursor=pointer]
    - generic [ref=e17]:
      - generic [ref=e18]: "Product:"
      - generic [ref=e19]:
        - button "Beer" [ref=e20] [cursor=pointer]
        - button "Coca-Cola" [ref=e21] [cursor=pointer]
        - button "Vodka" [ref=e22] [cursor=pointer]
        - button "Water" [ref=e23] [cursor=pointer]
        - button "Wine" [ref=e24] [cursor=pointer]
        - button "Tequila" [ref=e25] [cursor=pointer]
        - button "Energy Drink" [ref=e26] [cursor=pointer]
        - button "Tea" [ref=e27] [cursor=pointer]
        - button "Coffee" [ref=e28] [cursor=pointer]
        - button "Gin" [ref=e29] [cursor=pointer]
    - generic [ref=e30]:
      - generic [ref=e31]: "Quantity:"
      - spinbutton [ref=e33]: "1"
    - generic [ref=e34]:
      - generic [ref=e35]: "Destination:"
      - generic [ref=e36]:
        - button "Main Bar" [ref=e37] [cursor=pointer]
        - button "Craft Bar" [ref=e38] [cursor=pointer]
        - button "Back Bar" [ref=e39] [cursor=pointer]
    - generic [ref=e40]:
      - generic [ref=e41]: "Staff Member:"
      - combobox [ref=e42]:
        - option "-- Select --" [selected]
        - option "João Silva"
        - option "Maria Santos"
        - option "Pedro Oliveira"
        - option "Ana Costa"
        - option "Carlos Ferreira"
    - button "Submit" [ref=e43] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '../e2e/fixtures';
  2  | 
  3  | test(
  4  |   'BUG-21: carregamento deve terminar sem exceção não tratada',
  5  |   {
  6  |     annotation: {
  7  |       type: 'bug',
  8  |       description:
  9  |         'BUG-21 (trivial/P3) — Esperado: console sem exceção não tratada. Atual: a cada carregamento, "ReferenceError: record is not defined" em script.js:336, bloco duplicado que ficou fora de initialiseFormSubmission().',
  10 |     },
  11 |   },
  12 |   async ({ page }, testInfo) => {
  13 |     const erros: string[] = [];
  14 | 
  15 |     page.on('pageerror', erro => {
  16 |       const origem = erro.stack?.split('\n')[1]?.trim() ?? 'origem não informada';
  17 |       erros.push(`${erro.name}: ${erro.message} (${origem})`);
  18 |     });
  19 | 
  20 |     await page.goto('/Stock_system/index.html');
  21 | 
  22 |     // Prova de que o app abriu: se falhar aqui, o defeito não é o erro de console.
  23 |     await expect(page.getByRole('button', { name: 'Stock Count' })).toBeVisible();
  24 |     await page.screenshot({ path: testInfo.outputPath('antes.png'), fullPage: true });
  25 | 
  26 |     expect(
  27 |       erros,
  28 |       'BUG-21: o carregamento deveria terminar sem exceção não tratada no console (trecho duplicado em script.js:336-345)'
> 29 |     ).toEqual([]);
     |       ^ Error: BUG-21: o carregamento deveria terminar sem exceção não tratada no console (trecho duplicado em script.js:336-345)
  30 |   }
  31 | );
  32 | 
```