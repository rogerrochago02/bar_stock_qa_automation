# bar_stock_qa_automation


Este repositório contém testes automatizados desenvolvidos com **Playwright** para validar os principais fluxos de um sistema web de controle de estoque para bar.

A aplicação testada faz parte do projeto **Sistema de Estoque**, desenvolvido em conjunto no repositório:  
[ofe-lipe/Sistema de estoque](https://github.com/ofe-lipe/Stock_system)

O foco deste repositório é documentar e apresentar a camada de **QA Automation**, incluindo os códigos dos testes, os cenários validados e as evidências em vídeo das execuções.

---

## Sobre o projeto testado

O sistema simula o controle de estoque de bebidas em um bar, permitindo registrar:

- contagem inicial de estoque;
- retirada de produtos;
- retorno de produtos ao estoque;
- histórico de movimentações;
- bloqueio de retirada quando não há estoque disponível.

O projeto foi desenvolvido em conjunto e com apoio de ferramentas de IA, a partir de um cenário inspirado em uma necessidade real de controle de estoque para um estabelecimento na Irlanda.

Minha atuação envolveu a construção da aplicação com apoio de ferramentas de IA e a prática de **QA**, incluindo testes manuais, validação de regras de negócio, identificação de inconsistências, melhorias no comportamento do sistema, documentação e criação de testes automatizados com Playwright.

---

## Objetivo das automações

As automações foram criadas para validar os principais fluxos da aplicação e garantir que regras importantes continuem funcionando após alterações no código.

Os testes cobrem cenários como:

- registro de contagem inicial de estoque;
- registro de movimentações de retirada e retorno;
- validação de mensagens de sucesso;
- validação de alertas do navegador;
- retirada de produtos até o estoque chegar a zero;
- bloqueio de novas retiradas quando não há estoque disponível.

---

## Tecnologias utilizadas

- Playwright
- JavaScript / TypeScript
- Node.js
- VS Code
- Git / GitHub

---

## Testes automatizados

### 1. Stock Count

Valida o fluxo de registro da contagem inicial de estoque.

**Cenário testado:**

1. Acessar a aplicação.
2. Abrir a aba `Stock Count`.
3. Preencher os campos de quantidade dos produtos.
4. Salvar o estoque.
5. Validar a mensagem de sucesso.
6. Conferir o registro no histórico.

**Evidência:** `evidence/stock_count.mp4`

---

### 2. Record Stock

Valida o fluxo de movimentação de estoque, incluindo retirada e retorno de produtos.

**Cenário testado:**

1. Acessar a área de registro de movimentação.
2. Selecionar o tipo de movimentação.
3. Selecionar produto, quantidade, destino/origem e funcionário responsável.
4. Enviar a movimentação.
5. Validar a conclusão do processo.

**Evidência:** `evidence/record_stock.mp4`

---

### 3. Remove Products Until Zero

Valida um cenário de limite, retirando os produtos do estoque até que cada um chegue a zero.

**Cenário testado:**

1. Registrar estoque inicial para todos os produtos.
2. Acessar a área de movimentação.
3. Para cada produto, realizar retiradas sucessivas até o estoque chegar a zero.
4. Após zerar o estoque do produto, tentar retirar mais 1 unidade.
5. Validar se o sistema bloqueia a retirada por falta de estoque.

**Evidência:** `evidence/remove_products.mp4`

---

## Evidências

Os vídeos das execuções estão disponíveis na pasta `tests-results/`.

Eles podem ser visualizados diretamente pelo GitHub ou baixados para análise local:

```text
evidence/
  stock_count.mp4
  record_stock.mp4
  remove_products.mp4
