import { defineConfig, devices } from '@playwright/test';

// Roda com `playwright test --project=known-bugs`? Então o relatório HTML vai
// para uma pasta própria, sem sobrescrever o relatório da suíte principal.
const isKnownBugsRun = process.argv.some(arg => arg.includes('--project=known-bugs'));

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: isKnownBugsRun ? 'known-bugs-report' : 'playwright-report' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:5500',
    // Regra da equipe: sempre headless, sempre Chromium do Playwright.
    // Proibido channel 'chrome', executablePath do Chrome do sistema ou --headed.
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // Suíte que valida o comportamento funcional do app. É a que o CI roda.
    {
      name: 'chromium',
      testDir: './e2e',
      use: { ...devices['Desktop Chrome'] },
    },
    // Defeitos já reproduzidos manualmente. Cada teste afirma o comportamento
    // correto, então falhar é o resultado esperado e a mensagem aponta o defeito.
    {
      name: 'known-bugs',
      testDir: './e2e-known-bugs',
      outputDir: 'test-results-known-bugs',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
