import { test, expect } from '../e2e/fixtures';

test(
  'BUG-21: carregamento deve terminar sem exceção não tratada',
  {
    annotation: {
      type: 'bug',
      description:
        'BUG-21 (trivial/P3) — Esperado: console sem exceção não tratada. Atual: a cada carregamento, "ReferenceError: record is not defined" em script.js:336, bloco duplicado que ficou fora de initialiseFormSubmission().',
    },
  },
  async ({ page }, testInfo) => {
    const erros: string[] = [];

    page.on('pageerror', erro => {
      const origem = erro.stack?.split('\n')[1]?.trim() ?? 'origem não informada';
      erros.push(`${erro.name}: ${erro.message} (${origem})`);
    });

    await page.goto('/Stock_system/index.html');

    // Prova de que o app abriu: se falhar aqui, o defeito não é o erro de console.
    await expect(page.getByRole('button', { name: 'Stock Count' })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('antes.png'), fullPage: true });

    expect(
      erros,
      'BUG-21: o carregamento deveria terminar sem exceção não tratada no console (trecho duplicado em script.js:336-345)'
    ).toEqual([]);
  }
);
