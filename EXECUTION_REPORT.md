# EXECUTION REPORT — defeitos conhecidos do Stock System

- **Projeto:** Case Stock Bar (Stock System) — rodada B, automação dos defeitos já reproduzidos manualmente
- **Data:** 2026-11-11
- **App testado:** `ofe-lipe/Stock_system` commit `c70c2581c42e1a2a17c46de57285a413d0bb2377`
- **Repo de teste:** `rogerrochago02/bar_stock_qa_automation` commit `3e279f37360c722be19a3c7d8998fa3a621815f0` + arquivos desta rodada (sem commit, sem push)
- **URL:** `http://127.0.0.1:5500/Stock_system/index.html`
- **Ambiente:** Windows 11 Pro 10.0.26200 (64 bits), Node 25.9.0, npm 11.12.1, Playwright 1.64.1, Chromium 156.0.8078.4
- **Firebase:** stub em `localStorage` via `e2e/fixtures.ts`. Nenhum dado foi gravado no Firestore real.

## 1. Resultado

| Comando | Resultado | Status |
|---|---|---|
| `npx playwright test --project=chromium` | 3 passed, 0 failed | `passed` |
| `npm run test:known-bugs` | 0 passed, 4 failed — todos pelo motivo certo | `failed` (esperado) |

Os 3 specs existentes continuam intactos. O resultado `failed` do projeto `known-bugs` é a prova dos defeitos; não é regressão da suíte.

## 2. Defeitos provados

| ID | Teste | Esperado | Recebido | Veredito |
|---|---|---|---|---|
| BUG-18 | `bug-18-contagem-vazia-zera-estoque.spec.ts` | Beer continua 10 após contagem vazia | 0 | provado |
| BUG-19 | `bug-19-contagem-aceita-negativo.spec.ts` | -5 recusado, Beer continua 10 | -5 | provado |
| BUG-20 | `bug-20-recontagem-desconta-movimentacao.spec.ts` | Recontagem de 200 mostra 200 | 150 | provado |
| BUG-21 | `bug-21-referenceerror-no-carregamento.spec.ts` | Nenhuma exceção não tratada | `ReferenceError: record is not defined (script.js:336:42)` | provado |

Cada teste afirma o comportamento correto. A mensagem de falha nomeia o defeito e o que deveria acontecer, então o relatório HTML é legível sem abrir o código.

## 3. Como reproduzir

```bash
# 1. servir a aplicação a partir da pasta pai do repo Stock_system
npx --yes http-server .. -p 5500 --silent

# 2. suíte de regressão
npx playwright test --project=chromium

# 3. defeitos conhecidos (4 failed é o esperado)
npm run test:known-bugs
```

## 4. Evidências

Pasta `evidence/known-bugs/2026-11-11/`:

- `EXECUTION_LOG_20261111-1930.txt` — data, hora, máquina, versões, commits, comandos e saída bruta sem edição.
- `BUG-18_antes.png` / `BUG-18_depois.png` — estoque 100 antes, 0 depois da contagem vazia.
- `BUG-19_antes.png` / `BUG-19_depois.png` — Beer 10 antes, -5 depois do valor negativo.
- `BUG-20_antes.png` / `BUG-20_depois.png` — Beer 50 antes da recontagem, 150 depois (correto: 200).
- `BUG-21_antes.png` / `BUG-21_depois.png` — app carregado; o erro está no log e no `error-context.md`.
- `BUG-XX_video.webm` — vídeo da execução que falhou.
- `BUG-XX_error-context.md` — árvore de acessibilidade no momento da falha.
- Relatório HTML: `known-bugs-report/index.html`; artefatos: `test-results-known-bugs/`.

## 5. Decisões de implementação

- **Projeto separado, não `test.fail()`.** Com `test.fail()` o Playwright conta a falha esperada como sucesso e o relatório sai verde. O recrutador não veria prova. Separado, os 4 testes aparecem vermelhos com a mensagem do defeito, e o workflow principal roda só `--project=chromium`.
- **`npm test` passou a rodar `--project=chromium`.** Antes rodava todos os testes; com o projeto novo, o comando padrão ficaria vermelho por desenho. Para rodar tudo: `npm run test:all`.
- **Relatório próprio.** Quando a execução inclui `--project=known-bugs`, o HTML vai para `known-bugs-report/`; caso contrário, `playwright-report/`.
- **Sem `waitForTimeout`.** A espera é por texto/elemento com retry do Playwright. As asserções leem o cartão do produto (`.stock-card strong`), não o texto "Initial:", para não dar falso positivo.

## 6. Limites

- Só Chromium. Firefox e WebKit não foram executados.
- Firebase simulado em `localStorage`; persistência no Firestore real não foi validada.
- O servidor na porta 5500 já estava em execução e servia `script.js` com SHA256 idêntico ao clone (`E14DC737…B347`); não foi reiniciado.
- `trace` continua em `on-first-retry`. Como a execução local tem `retries: 0`, a prova em vídeo substitui o trace. Para gerar trace: `npx playwright test --project=known-bugs --trace on`.
- Nada foi commitado nem enviado ao GitHub.

## 7. Aprendizados

**Projeto separado x `test.fail()`.** `test.fail()` diz "eu espero que este teste falhe" e o Playwright pinta o resultado de verde. É útil para um bug já corrigido em outro branch, mas péssimo como prova: o relatório esconde o defeito. Um projeto separado mantém a suíte saudável isolada e deixa as falhas visíveis no relatório. O custo é rodar dois comandos e conferir dois relatórios; o ganho é que o vermelho significa exatamente uma coisa.
