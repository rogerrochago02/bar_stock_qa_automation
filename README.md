# bar_stock_qa_automation

[![Playwright Tests](https://github.com/rogerrochago02/bar_stock_qa_automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/rogerrochago02/bar_stock_qa_automation/actions/workflows/playwright.yml)

Testes E2E com Playwright para o sistema de controle de estoque de bar (Stock System).

Participei da construção da aplicação junto com Felipe (conta `ofe-lipe`). O projeto é dos dois e nasceu de uma situação real de bar na Irlanda. Este repositório é a camada de QA e automação que eu mantenho: cenários, evidências e CI.

## Sobre o projeto testado

O sistema simula o controle de estoque de bebidas em um bar, permitindo:

- registrar a contagem inicial de estoque;
- registrar retiradas e devoluções de produtos;
- consultar o histórico de movimentações;
- bloquear retiradas quando não há estoque disponível.

No QA, atuei em testes manuais, validação de regras de negócio, identificação de inconsistências e documentação, além da automação dos principais fluxos com Playwright.

O case completo, com os quatro defeitos e as evidências, está em [`CASE_STOCK_BAR.md`](CASE_STOCK_BAR.md).

## Cenários automatizados

| Arquivo | Cenário validado |
|---|---|
| `e2e/stock_count.spec.ts` | Contagem inicial de estoque, mensagem de sucesso e registro no histórico |
| `e2e/record_stock.spec.ts` | Retirada e devolução de produtos, mensagens de confirmação e histórico |
| `e2e/remove_products.spec.ts` | Retirada de produtos até o estoque zerar e bloqueio de nova retirada sem estoque |

## Defeitos conhecidos (projeto `known-bugs`)

Além da suíte de regressão, o repositório tem o projeto `known-bugs`: quatro testes que afirmam o comportamento **correto** e falham porque o app tem defeito. Eles documentam os defeitos BUG-18 a BUG-21 encontrados no teste manual e servem de prova executável do relatório de bugs.

| Arquivo | Defeito | Esperado | Atual |
|---|---|---|---|
| `bug-18-contagem-vazia-zera-estoque.spec.ts` | Contagem sem nenhum valor salva 0 em tudo | Contagem recusada, estoque anterior preservado | 10 produtos zerados |
| `bug-19-contagem-aceita-negativo.spec.ts` | Contagem aceita valor negativo | Valor recusado (`min="0"`), estoque inalterado | Beer salvo como -5 |
| `bug-20-recontagem-desconta-movimentacao.spec.ts` | Recontagem desconta saídas antigas | Recontar 200 mostra 200 | Mostra 150 (desconta a saída de 50) |
| `bug-21-referenceerror-no-carregamento.spec.ts` | `ReferenceError: record is not defined` em `script.js:336` | Console sem exceção não tratada | Erro a cada carregamento |

Na execução local de 2026-11-11, `npm test` deu 3 passed em 12.4s e `npm run test:known-bugs` deu 4 failed, o esperado. O log está em `evidence/known-bugs/2026-11-11/EXECUTION_LOG_20261111-1930.txt`.

### Por que um projeto separado e não `test.fail()`

Com `test.fail()` o Playwright marca a falha esperada como sucesso: o relatório HTML sai **verde** e o defeito desaparece da tela. Aqui o defeito precisa aparecer. Como projeto separado, os quatro testes ficam **vermelhos** no relatório, cada um com a mensagem do comportamento correto que não foi cumprido, e o badge do CI continua verde porque o workflow principal roda só `--project=chromium`.

```bash
npm run test:known-bugs   # 4 failed é o resultado esperado
```

O relatório HTML dessa execução vai para `known-bugs-report/`, separado do `playwright-report/` da suíte principal.

## Tecnologias

- Playwright
- TypeScript
- Node.js
- Git, GitHub e GitHub Actions

## Estrutura do projeto

```text
bar_stock_qa_automation/
├── .github/
│   └── workflows/
│       ├── playwright.yml
│       └── known-bugs.yml
├── e2e/
│   ├── fixtures.ts
│   ├── stock_count.spec.ts
│   ├── record_stock.spec.ts
│   └── remove_products.spec.ts
├── e2e-known-bugs/
│   ├── bug-18-contagem-vazia-zera-estoque.spec.ts
│   ├── bug-19-contagem-aceita-negativo.spec.ts
│   ├── bug-20-recontagem-desconta-movimentacao.spec.ts
│   └── bug-21-referenceerror-no-carregamento.spec.ts
├── evidence/
│   ├── known-bugs/2026-11-11/
│   ├── stock_count.mp4
│   ├── record_stock.mp4
│   └── remove_products.mp4
├── playwright.config.ts
├── package.json
├── package-lock.json
└── README.md
```

## Como executar

### Pré-requisitos

- Node.js 18 ou superior
- Aplicação Stock System disponível em `http://127.0.0.1:5500/Stock_system/index.html`

### 1. Preparar a aplicação

Clone o repositório da aplicação e sirva a pasta pai na porta 5500:

```bash
git clone https://github.com/ofe-lipe/Stock_system.git
cd Stock_system
npx http-server .. -p 5500
```

Também é possível usar a extensão Live Server do VS Code apontando para a pasta que contém `Stock_system`.

Confirme que a aplicação abre em:

```text
http://127.0.0.1:5500/Stock_system/index.html
```

### 2. Executar os testes

Em outro terminal:

```bash
git clone https://github.com/rogerrochago02/bar_stock_qa_automation.git
cd bar_stock_qa_automation
npm install
npx playwright install chromium
npm test
```

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm test` | Executa a suíte de regressão (`--project=chromium`) em modo headless |
| `npm run test:known-bugs` | Executa os defeitos conhecidos (`--project=known-bugs`); 4 failed é o esperado |
| `npm run test:all` | Executa os dois projetos |
| `npm run test:headed` | Executa a suíte de regressão com o navegador visível |
| `npm run test:ui` | Abre o modo interativo do Playwright |
| `npm run report` | Abre o último relatório HTML gerado |

## Evidências

Os vídeos das execuções estão na pasta `evidence/`:

- `stock_count.mp4`
- `record_stock.mp4`
- `remove_products.mp4`

## Integração contínua

O workflow `.github/workflows/playwright.yml` executa a suíte de regressão a cada push e pull request na branch `main`:

1. clona a aplicação testada;
2. instala as dependências e o Chromium do Playwright;
3. sobe a aplicação na porta 5500;
4. executa `npx playwright test --project=chromium` e publica o relatório HTML como artefato.

O workflow `.github/workflows/known-bugs.yml` roda o projeto `known-bugs` no commit `c70c2581` do Stock System e publica `known-bugs-report/` e `test-results-known-bugs/` como artefato. Os 4 testes falham de propósito; o passo de teste tem `continue-on-error: true` para que o job e o badge principal continuem verdes, e o relatório guarda a prova.

O Firebase é substituído por um stub local em `e2e/fixtures.ts`, que usa `localStorage`. Isso mantém os testes rápidos e isolados, mas a suíte cobre a interface, não a persistência no Firestore real.

## Observações

- Os testes utilizam dados fixos de produtos e a funcionária `Maria Santos`.
- Cada teste roda em um contexto isolado, com dados próprios no `localStorage`.
- O teste de retirada até zero pode levar mais tempo por executar várias movimentações.

## Autor

Roger Rocha
