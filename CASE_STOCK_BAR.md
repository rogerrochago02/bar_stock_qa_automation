# Case Stock Bar

## Os 17 bugs do PDF antigo não fazem parte deste case

O PDF `relatorio-bugs-qa-project-template.pdf` lista 17 bugs de outro aplicativo, Android, chamado "Project Template". Não existe APK, repositório nem build público desse app. Nenhum dos 17 pode ser reproduzido por quem lê, então eles não são verificáveis e não entram como prova aqui. Este case usa só o que foi reproduzido no Stock Bar.

## O que este case prova

Prova que 3 cenários da suíte principal passaram e que 4 defeitos conhecidos têm teste automatizado que falha de propósito, em 2026-11-11.

| Campo | Valor |
|---|---|
| Projeto | Case Stock Bar |
| Autor | Roger Rocha |
| Data | 2026-11-11 |
| Repositório | https://github.com/rogerrochago02/bar_stock_qa_automation, commit `3e279f3` mais os arquivos desta rodada, sem commit |
| Alvo e URL | Stock System, commit `c70c258`, em http://127.0.0.1:5500/Stock_system/index.html |
| Como executar | dois terminais, comandos abaixo |

Terminal 1, aplicação:

```bash
git clone https://github.com/ofe-lipe/Stock_system.git
cd Stock_system
npx http-server .. -p 5500
```

Terminal 2, testes:

```bash
npm install
npx playwright install chromium
npm test
npm run test:known-bugs
```

`npm test` deve dar 3 passed. `npm run test:known-bugs` deve dar 4 failed, e essa falha é a prova dos defeitos.

## 1. Contexto e objetivo

Participei da construção do Stock System junto com Felipe (conta `ofe-lipe`). O projeto é dos dois e nasceu de uma situação real de bar na Irlanda. Eu mantenho este repositório, que é a camada de QA e automação: cenários, evidências e CI.

O case cobre dois lados. A suíte principal prova que três fluxos continuam funcionando. O projeto `known-bugs` prova quatro defeitos com testes que afirmam o comportamento correto e falham porque o app não o cumpre.

Quem lê pode rodar os dois comandos, abrir o relatório e ver os três verdes e os quatro vermelhos. O que este case não prova: persistência no Firebase real, fluxos fora dos três cenários, outros navegadores e dispositivos.

## 2. Escopo e riscos

**Dentro:**

- Contagem inicial de estoque e registro no histórico.
- Retirada e devolução, com os rótulos `STOCK OUT` e `RETURN TO STOCK`.
- Retirada até zerar e bloqueio da retirada seguinte com saldo 0.
- Quatro defeitos: contagem vazia, valor negativo, recontagem e erro de console.

**Fora:**

- Persistência e regras do Firebase real: a suíte usa stub em `localStorage`.
- Exportar CSV, limpar histórico, validação "Please fill all fields", devolução acima do pendente, outras combinações de destino ou funcionária.
- Mobile, responsivo, Firefox, Safari e Edge; carga, acessibilidade e teste de API.
- Corrigir a aplicação.

| Risco | Impacto | Probabilidade | Como foi testado |
|---|---|---|---|
| Contagem sem valor zera o estoque | Alto | Média | BUG-18 e spec |
| Valor negativo aceito no estoque | Alto | Média | BUG-19 e spec |
| Recontagem desconta movimentação anterior | Alto | Média | BUG-20 e spec |
| Erro de script a cada carregamento | Baixo | Alta | BUG-21 e spec |
| Stub de Firebase mascara falha de persistência | Alto | Média | limitação na seção 7 |

## 3. Estratégia e ambiente

- Abordagem: regressão dos três fluxos principais, mais prova executável dos quatro defeitos em um projeto separado. Não usei `test.fail()` porque ele pinta a falha esperada de verde e esconde o defeito do relatório.
- Ferramentas: Playwright 1.64.1, Chromium 156.0.8078.4, Node.js 25.9.0, npm 11.12.1, `http-server` na porta 5500.
- Ambiente: Windows 11 Pro 10.0.26200, aplicação no commit `c70c258`, repositório de teste no commit `3e279f3` mais os arquivos desta rodada.
- Dados: fictícios. Dez produtos (`Beer`, `Coca-Cola`, `Vodka`, `Water`, `Wine`, `Tequila`, `Energy Drink`, `Tea`, `Coffee`, `Gin`) e a funcionária `Maria Santos`.
- Isolamento: cada teste roda em contexto próprio, com `localStorage` separado. O Firebase é substituído por stub.
- Ordem: a suíte principal roda primeiro; o projeto `known-bugs` roda depois. Os quatro defeitos são independentes.
- Evidência: captura antes e depois, vídeo da execução que falhou, contexto de erro e log bruto.

## 4. Casos executados

| ID | Título | Tipo | Esperado | Obtido | Status | Data |
|---|---|---|---|---|---|---|
| E2E-01 | Contagem inicial de estoque | positivo | Salvar os dez saldos e registrar `Current Stock Updated` no histórico | Passou no Chromium headless em 2.7s | passed | 2026-11-11 |
| E2E-02 | Retirada e devolução | positivo | Registrar `STOCK OUT` e `RETURN TO STOCK` com produto, quantidade, destino e funcionária | Passou no Chromium headless em 3.8s | passed | 2026-11-11 |
| E2E-03 | Retirada até zerar | positivo e negativo | Bloquear a retirada seguinte quando o saldo chega a 0 | Passou no Chromium headless em 11.3s | passed | 2026-11-11 |

Os três cenários são `e2e/stock_count.spec.ts`, `e2e/record_stock.spec.ts` e `e2e/remove_products.spec.ts`. Os quatro testes de defeito conhecido também rodaram na mesma sessão, falharam de propósito e estão na seção 5.

## 5. Bugs

Cada teste afirma o comportamento correto. A falha é a prova de que o app não cumpre esse comportamento.

| ID | Título | Severidade | Prioridade | Teste automatizado | Passos | Esperado | Obtido | Impacto | Reproduções | Evidência |
|---|---|---|---|---|---|---|---|---|---|---|
| BUG-18 | Contagem vazia zera os 10 produtos e exibe sucesso | critical | P1 | [`bug-18-contagem-vazia-zera-estoque.spec.ts`](e2e-known-bugs/bug-18-contagem-vazia-zera-estoque.spec.ts) | 1. Abrir a URL. 2. Em **Stock Count**, preencher 10 em cada um dos 10 produtos e salvar. 3. Salvar de novo sem preencher nenhum campo. 4. Abrir **History**. | Recusar a contagem vazia e manter o estoque anterior em 10 | Os 10 produtos vão a 0, aparece "✓ Stock count saved successfully" e o total mostra "0 items" | Estoque inteiro zerado e contagem anterior sobrescrita | 2 de 2 manuais + spec | [antes](evidence/known-bugs/2026-11-11/BUG-18_antes.png) · [depois](evidence/known-bugs/2026-11-11/BUG-18_depois.png) · [vídeo](evidence/known-bugs/2026-11-11/BUG-18_video.webm) |
| BUG-19 | Contagem aceita valor negativo | major | P2 | [`bug-19-contagem-aceita-negativo.spec.ts`](e2e-known-bugs/bug-19-contagem-aceita-negativo.spec.ts) | 1. Abrir a URL. 2. Em **Stock Count**, preencher Beer = 10 e salvar. 3. Digitar `-5` em **Beer**. 4. Salvar e abrir **History**. | Recusar o valor negativo, porque o campo declara `min="0"`, e manter Beer em 10 | Beer salvo como `-5` e o cartão mostra o valor negativo | Valor negativo aceito | 2 de 2 manuais + spec | [antes](evidence/known-bugs/2026-11-11/BUG-19_antes.png) · [depois](evidence/known-bugs/2026-11-11/BUG-19_depois.png) · [vídeo](evidence/known-bugs/2026-11-11/BUG-19_video.webm) |
| BUG-20 | Recontagem continua descontando movimentações antigas | critical | P1 | [`bug-20-recontagem-desconta-movimentacao.spec.ts`](e2e-known-bugs/bug-20-recontagem-desconta-movimentacao.spec.ts) | 1. Contar Beer = 100. 2. Fazer Stock Out de 50. 3. Recontar Beer = 200. 4. Abrir **History**. | Beer = 200, porque a recontagem é o estoque atual | Beer = 150; a saída de 50 é descontada de novo | Cálculo errado na recontagem | 2 de 2 manuais + spec | [antes](evidence/known-bugs/2026-11-11/BUG-20_antes.png) · [depois](evidence/known-bugs/2026-11-11/BUG-20_depois.png) · [vídeo](evidence/known-bugs/2026-11-11/BUG-20_video.webm) |
| BUG-21 | `ReferenceError` a cada carregamento em `script.js:336` | trivial | P3 | [`bug-21-referenceerror-no-carregamento.spec.ts`](e2e-known-bugs/bug-21-referenceerror-no-carregamento.spec.ts) | 1. Abrir a URL com o console do DevTools. 2. Recarregar. | Console sem exceção não tratada | `ReferenceError: record is not defined` em `script.js:336:42`, uma vez por carga | Exceção sem efeito visível | 2 de 2 manuais + spec | [antes](evidence/known-bugs/2026-11-11/BUG-21_antes.png) · [depois](evidence/known-bugs/2026-11-11/BUG-21_depois.png) · [vídeo](evidence/known-bugs/2026-11-11/BUG-21_video.webm) |

As duas reproduções manuais de cada bug estão no relatório de bugs do portfólio, fora deste repositório. Dentro do repositório, a prova executável é o spec que falha.

Critério de severidade usado:

| Severidade | Critério |
|---|---|
| `blocker` | impede usar o fluxo principal ou perde dado sem recuperação |
| `critical` | fluxo principal funciona errado: cálculo, saldo, estoque, permissão |
| `major` | função importante falha com contorno disponível |
| `minor` | função secundária falha ou mensagem enganosa sem perda |
| `trivial` | texto, alinhamento ou detalhe sem impacto no uso |

Prioridade é escala separada: `P0` agora, `P1` nesta rodada, `P2` na próxima, `P3` algum dia.

## 6. Evidência

Suíte principal, em 2026-11-11 às 19:30 (-03:00):

```text
Running 3 tests using 3 workers
ok 1 [chromium] stock count (2.7s)
ok 3 [chromium] records stock out and return to stock (3.8s)
ok 2 [chromium] remove products until zero in stock (11.3s)
3 passed (12.4s)
```

Defeitos conhecidos, na mesma sessão:

```text
Running 4 tests using 4 workers
x BUG-21: carregamento deve terminar sem exceção não tratada (3.0s)
x BUG-19: contagem deve recusar quantidade negativa (8.3s)
x BUG-20: recontagem deve valer como estoque atual, sem descontar saída antiga (9.2s)
x BUG-18: contagem vazia deve ser recusada e preservar o estoque (9.2s)
4 failed
```

O que cada falha prova:

- BUG-18: esperado Beer em `10`, recebido `0`.
- BUG-19: esperado Beer em `10`, recebido `-5`.
- BUG-20: esperado Beer em `200`, recebido `150`.
- BUG-21: esperado console sem exceção, recebido `ReferenceError: record is not defined (script.js:336:42)`.

O log bruto, com data, hora, máquina, versões e commits, está em [`evidence/known-bugs/2026-11-11/EXECUTION_LOG_20261111-1930.txt`](evidence/known-bugs/2026-11-11/EXECUTION_LOG_20261111-1930.txt). O relatório HTML está em [`known-bugs-report/index.html`](known-bugs-report/index.html). Os prints e vídeos seguem o padrão `BUG-XX_antes.png`, `BUG-XX_depois.png` e `BUG-XX_video.webm` em `evidence/known-bugs/2026-11-11/`.

O workflow `known-bugs.yml` está configurado para rodar o mesmo projeto e publicar o relatório. O workflow principal roda só `--project=chromium`, por isso o badge continua verde.

## 7. Limitações

- **A suíte substitui o Firebase por um stub.** `e2e/fixtures.ts` intercepta `firebase-app.js` e `firebase-firestore.js` e troca o Firestore por `localStorage` (chaves `fake_stock` e `fake_movements`). A suíte cobre a interface e as regras no navegador; não cobre persistência no backend, regras de segurança, latência nem concorrência entre usuários.
- Só Chromium. Firefox e WebKit não foram executados.
- Aplicação estática, sem build ou versão: não há como diferenciar duas versões do app pelo artefato.
- Sem teste de API, carga, acessibilidade ou regressão visual.
- Os quatro defeitos são os que foram reproduzidos e automatizados nesta rodada. O case não afirma que sejam os únicos do app.
- A execução é local e única; o resultado pode variar se a aplicação mudar de commit.

## 8. O que eu faria diferente

- Teria rodado a exploração dirigida antes de fechar os três cenários. Os quatro defeitos passam pela suíte verde; contagem vazia e valor negativo deveriam estar no plano desde o início.
- Teria isolado o Firebase em um projeto de teste antes da primeira execução, em vez de usar stub, para não deixar a persistência sem prova.
- Teria automatizado os quatro defeitos assim que os reproduzi, em vez de esperar a rodada de automação. O vermelho no relatório vale mais cedo.
- Teria fixado a massa de cada caso em um estado inicial explícito. A recontagem do BUG-20 depende do histórico anterior e fica ambígua sem isso.
- Teria capturado o console em toda execução, não só ao investigar o BUG-21. Erro de script não aparece no relatório do Playwright por padrão.
