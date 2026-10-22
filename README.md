# bar_stock_qa_automation

[![Playwright Tests](https://github.com/rogerrochago02/bar_stock_qa_automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/rogerrochago02/bar_stock_qa_automation/actions/workflows/playwright.yml)

Testes E2E com Playwright para o sistema de controle de estoque de bar (Stock System).

A aplicação testada faz parte do projeto [ofe-lipe/Stock_system](https://github.com/ofe-lipe/Stock_system). Este repositório concentra a camada de QA Automation, incluindo os testes, a configuração de execução e as evidências em vídeo.

## Sobre o projeto testado

O sistema simula o controle de estoque de bebidas em um bar, permitindo:

- registrar a contagem inicial de estoque;
- registrar retiradas e devoluções de produtos;
- consultar o histórico de movimentações;
- bloquear retiradas quando não há estoque disponível.

Minha atuação envolveu testes manuais, validação de regras de negócio, identificação de inconsistências, documentação e automação dos principais fluxos com Playwright.

## Cenários automatizados

| Arquivo | Cenário validado |
|---|---|
| `e2e/stock_count.spec.ts` | Contagem inicial de estoque, mensagem de sucesso e registro no histórico |
| `e2e/record_stock.spec.ts` | Retirada e devolução de produtos, mensagens de confirmação e histórico |
| `e2e/remove_products.spec.ts` | Retirada de produtos até o estoque zerar e bloqueio de nova retirada sem estoque |

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
│       └── playwright.yml
├── e2e/
│   ├── fixtures.ts
│   ├── stock_count.spec.ts
│   ├── record_stock.spec.ts
│   └── remove_products.spec.ts
├── evidence/
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
| `npm test` | Executa todos os testes em modo headless |
| `npm run test:headed` | Executa os testes com o navegador visível |
| `npm run test:ui` | Abre o modo interativo do Playwright |
| `npm run report` | Abre o último relatório HTML gerado |

## Evidências

Os vídeos das execuções estão na pasta `evidence/`:

- `stock_count.mp4`
- `record_stock.mp4`
- `remove_products.mp4`

## Integração contínua

O workflow `.github/workflows/playwright.yml` executa a suíte a cada push e pull request na branch `main`:

1. clona a aplicação testada;
2. instala as dependências e o Chromium do Playwright;
3. sobe a aplicação na porta 5500;
4. executa os testes e publica o relatório HTML como artefato.

O Firebase é substituído por um stub local em `e2e/fixtures.ts`, que usa `localStorage`. Isso mantém os testes rápidos, reproduzíveis e isolados de dados externos.

## Observações

- Os testes utilizam dados fixos de produtos e a funcionária `Maria Santos`.
- Cada teste roda em um contexto isolado, com dados próprios no `localStorage`.
- O teste de retirada até zero pode levar mais tempo por executar várias movimentações.

## Autor

Roger Rocha
