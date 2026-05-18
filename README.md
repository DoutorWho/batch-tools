# 🚀 Batch Tools

<p align="center">
   <img src="https://raw.githubusercontent.com/DoutorWho/batch-tools/main/images/icon.png" width="250"/>
</p>

Extensão para **Visual Studio Code** que melhora o desenvolvimento em arquivos `.bat`, trazendo **autocomplete, hover contextual e detecção de variáveis**.

---

## ⚡ Funcionalidades

- 🔥 Autocomplete para comandos Batch
- 📚 Mais de 30 comandos nativos suportados
- 🧩 Mais de 50 parâmetros documentados
- ⚙️ Suporte a comandos como `set /p`, `set /a`, `mkdir`, `@echo`, `del`, `copy`, `xcopy`, `robocopy` e muitos outros
- 🪄 Hover explicativo para comandos e parâmetros
- 🧠 Detecção inteligente de variáveis:
  - Variáveis do sistema: `%USERNAME%`, `%PATH%`, `%DATE%`, etc
  - Variáveis criadas (de script) pelo usuário via `set`

---

## 🖼️ Demonstrações

### 🔹 Autocomplete inteligente

Ao digitar apenas uma letra, a extensão já sugere comandos relevantes com explicação no painel lateral.

<p align="center">
  <img src="https://raw.githubusercontent.com/DoutorWho/batch-tools/main/images/ex01.png" width="700"/>
</p>

---

### 🔹 Parâmetros inteligentes

A extensão reconhece comandos como `set /a`, `set /p`, `mkdir`, etc, exibindo explicações detalhadas dos parâmetros.

<p align="center">
  <<img src="https://raw.githubusercontent.com/DoutorWho/batch-tools/main/images/ex02.png" width="700"/>
</p>

---

### 🔹 Variáveis automáticas

Detecção automática de variáveis do sistema e do usuário, permitindo sugestões como:

- `%USERNAME%`
- `%PATH%`
- `%nome%` (variáveis criadas no script)

<p align="center">
  <img src="https://raw.githubusercontent.com/DoutorWho/batch-tools/main/images/ex03.png" width="700"/>
</p>


### 🔹 Declaração Ativa de Variáveis locais
Ao utilizar o comando `set` (seja em atribuições diretas de strings/números como `set n=a`, operações matemáticas com `set /a`, ou através de capturas de entrada do usuário com `set /p nome=`), o interpretador reconhece o identificador imediatamente e o registra como uma variável válida do script.

<p align="center">
  <img src="https://raw.githubusercontent.com/DoutorWho/batch-tools/main/images/ex04.png" width="700"/>
</p>

---

### 🔹 Inspeção de Escopo via Hover (`%` e `!`)
Ao posicionar o mouse sobre uma variável delimitada (como `%nome%` ou `!nome!`), a janela de informações de ferramentas (*Hover*) é acionada. O assistente analisa o contexto do arquivo e exibe explicitamente se aquele identificador corresponde a uma **Variável de Script** (escopo local criado por você) ou a uma **Variável de Sistema/Classe** (nativa do Windows).

<p align="center">
  <img src="https://raw.githubusercontent.com/DoutorWho/batch-tools/main/images/ex05.png" width="700"/>
</p>

---

### 🔹Mapeamento e Validação de Labels
O motor da extensão monitora as instruções de salto e desvio de fluxo. Ao interagir com comandos como `goto nome_do_label`, `call :nome_do_label` ou diretamente em cima da linha de definição (`:nome_do_label`), o sistema valida a estrutura e a categoriza estritamente como um **Label** (ponto de ancoragem de execução).

<p align="center">
  <img src="https://raw.githubusercontent.com/DoutorWho/batch-tools/main/images/ex06.png" width="700"/>
</p>
---

# 🚀 Notas de Atualização — Versão 1.0

## 🛠️ Novas Funcionalidades e Suporte à Sintaxe
* **Suporte ao `setlocal`:** Adicionado mapeamento completo para diretivas de escopo, incluindo a expansão atrasada do (`enabledelayedexpansion`).
* **Aprimoramento do Loop `FOR`:** Implementado suporte ao parâmetro `/F` e suas subdiretivas de formatação de texto, como o manipulador de delimitadores (`delims`).
* **Novos Comandos Mapeados:** Adicionado suporte e reconhecimento para os comandos `type`, `exit` (e seus argumentos de saída) e para a variável de sistema `%errorlevel%`.

## 💡 IntelliSense & Autocompletar (Labels e Variáveis)
* **Autocompletar Inteligente de Labels:** Ao digitar `:`, o sistema agora analisa o escopo do arquivo. Se um comando `call` correspondente já tiver sido declarado anteriormente, a label será sugerida de forma automática.
* **Gatilhos de Variáveis (`!` e `%`):** Configurado o disparo do autocompletar ao interagir com variáveis comuns (`%variavel%`) e variáveis de expansão atrasada (`!variavel!`).
  * *Nota: O sistema realiza a leitura dos gatilhos de forma independente, sem validar se o comando `setlocal` está explicitamente ativo no documento.*
* **Support a Hover (Dicas ao Passar o Mouse):** Adicionada a exibição de janelas de informações (*Hover*) detalhadas para variáveis, comando `set`, parâmetros, subdiretivas e labels.

## 🐛 Correções de Bugs (Bugfixes)
* **Tratamento do Caractere `%`:** Corrigido o comportamento inesperado onde o interpretador disparava rotinas incorretamente ao identificar a duplicidade do caractere (`%%`). Com esta revisão, o fluxo foi normalizado e o erro foi mitigado.

## 📝 Documentação e Experiência do Usuário (UX/UI)
* **Descrições Ricas:** As documentações de ajuda de todos os comandos foram reformuladas. Agora elas exibem exemplos práticos de execução e detalham minuciosamente a função de cada parâmetro (como as flags do comando `FOR`).
* **Design Renovado:** Interface visual e componentes de código de sugestão refinados, garantindo uma experiência de desenvolvimento muito mais limpa, moderna e agradável.

## 💻 Exemplo de uso

```bat
@echo off

set /p nome=Digite seu nome:
echo Olá %nome%

set /a idade=20+5
echo Idade: %idade%

echo Usuário: %USERNAME%

if "%nome%"=="DoutorWho" (
    echo Bem-vindo!
)

