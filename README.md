# 🚀 Batch Tools

<p align="center">
   <img src="https://raw.githubusercontent.com/DoutorWho/batch-tools/main/images/icon.png" width="250"/>
</p>

<p align="center">
  <b>A extensão definitiva para Visual Studio Code que transforma o desenvolvimento de scripts <code>.bat</code> e <code>.cmd</code> através de Inteligência de Código Avançada.</b>
</p>

---

## ⚡ Funcionalidades Principais

- 🧠 **IntelliSense Contextual:** Autocompletar inteligente para comandos Batch nativos.
- 📚 **Enciclopédia Nativa:** Mais de 150 comandos cobertos com documentação interna completa.
- 🧩 **Precisão de Parâmetros:** Mapeamento minucioso de mais de 50 flags, chaves e subdiretivas.
- 🪄 **Rich Hover (Dicas Dinâmicas):** Passe o mouse sobre comandos, operadores ou variáveis para ver sintaxes, exemplos e escopos imediatamente.
- ⚙️ **Suporte Avançado:** Tratamento inteligente de estruturas complexas como `set /p`, `set /a`, `mkdir`, `FOR /F`, operadores encadeados e fluxos condicionais.

---

## 🖼️ Demonstrações Visuais

### 🔹 1. [NOVO] Autocompletar Inteligente de Comandos
Ao digitar as primeiras letras, a extensão isola o contexto e sugere comandos relevantes com painéis explicativos laterais.
<p align="center">
  <img src="https://raw.githubusercontent.com/DoutorWho/batch-tools/main/images/ex01.png" width="700"/>
</p>

### 🔹 2. Parâmetros e Modificadores
Reconhecimento cirúrgico de subcomandos e flags de sistema (como o `choice`).
<p align="center">
  <img src="https://raw.githubusercontent.com/DoutorWho/batch-tools/main/images/ex02.png" width="700"/>
</p>

### 🔹 3. Rastreamento Dinâmico de Variáveis
Sugestões automáticas que diferenciam variáveis globais do sistema (`%PATH%`, `%USERNAME%`) de variáveis locais declaradas dinamicamente no script.
<p align="center">
  <img src="https://raw.githubusercontent.com/DoutorWho/batch-tools/main/images/ex03.png" width="700"/>
</p>

### 🔹 4. [NOVO] Declaração Ativa de Escopo Local
Identificação instantânea de variáveis criadas via atribuição direta, aritmética (`set /a`) ou capturas de prompt de usuário (`set /p`).
<p align="center">
  <img src="https://raw.githubusercontent.com/DoutorWho/batch-tools/main/images/ex04.png" width="700"/>
</p>


### 🔹 5. [NOVO] Autocompletar de Encadeamento e Pipes (`|`, `||`, `&`)
O IntelliSense agora acompanha o fluxo sequencial. Após operadores de pipe ou execução lógica, o assistente prevê e sugere o comando seguinte de forma contínua.
<p align="center">
  <img src="https://raw.githubusercontent.com/DoutorWho/batch-tools/main/images/ex05.png" width="700"/>
</p>

### 🔹 6. [NOVO] IntelliSense de Caminhos e Arquivos do Diretório
Comandos baseados em I/O (como `cd` e `del`) listam dinamicamente as pastas e arquivos do seu workspace atual para evitar erros de digitação.
<p align="center">
  <img src="https://raw.githubusercontent.com/DoutorWho/batch-tools/main/images/ex06.png" width="700"/>
  <img src="https://raw.githubusercontent.com/DoutorWho/batch-tools/main/images/ex07.png" width="700"/>
</p>

---

# 🚀 Notas de Atualização — Versão 2.0 (Major Release)

Esta nova versão marca uma reestruturação profunda no núcleo da extensão, focando em **arquitetura limpa**, **estabilidade de compilação** e **cobertura contra falsos-positivos**.

## 🛠️ Novas Funcionalidades e Operadores Avançados
* **IntelliSense Pós-Operadores (`|`, `||`, `&`, `&&`):** Agora, ao utilizar comandos encadeados ou saídas redirecionadas (ex: `tasklist | `, `dir && `), o motor reavalia o cursor e sugere novos comandos imediatamente.
* **Autocompletar de Sistema de Arquivos Local:** Comandos de navegação e manipulação de arquivos (como `cd`, `del`, `rd`) agora varrem o diretório em tempo real para sugerir subpastas e arquivos válidos.
* **Novos Comandos e Dependências:** Adicionado mapeamento nativo para o gerenciador de páginas de código `chcp`, além de novas tabelas de dependências internas associadas.

## 💡 Aprimoramentos no IntelliSense e Hover
* **Sugestões Seguras de Labels:** Correção do algoritmo de gatilho para a sintaxe `:`. Agora, ao acionar `call :` e invocar o autocompletar, as âncoras (`goto`) mapeadas aparecem perfeitamente de forma contextualizada.
* **Ajuste de Contexto Inteligente:** Bloqueio do IntelliSense intrusivo dentro de escopos de comentários (`::` e `rem`). O motor ignora essas linhas para evitar poluição visual enquanto você digita notas textuais.

## 🐛 Principais Correções de Bugs (Mais de 20 Bugfixes)
* **Prevenção de Vazamento de Cores em Comentários:** Corrigido o bug crítico onde delimitadores de variáveis (`%variavel%` ou `!variavel!`) quebrassem a tokenização de realce de sintaxe ao serem digitados dentro de blocos `::` ou `rem`.
* **Correção do Gatilho Especial `:`:** Eliminada a intermitência que impedia o disparo correto do painel de sugestões após chamadas do comando `call`.
* **Estabilidade do Motor Hover:** Tratadas múltiplas exceções nulas geradas ao posicionar o mouse sobre caracteres de escape ou variáveis duplicadas (`%%`).

## 💻 Arquitetura do Projeto
Para garantir um desenvolvimento escalável, o projeto abandonou o formato de arquivo único e foi modularizado:
* `data/commands/`: Concentra os esquemas, metadados e documentações ricas de cada comando Batch individualmente.
* `features/`: Repositório isolado contendo as regras de negócios específicas para funcionalidades de *Autocomplete*, *Hover* e *Tokenização*.

> 📅 **Nota de Futuro:** Esta nova segmentação prepara o ecossistema para a implementação de novas ferramentas avançadas de análise estática de código que chegarão em atualizações futuras.

---

## 💻 Exemplo de Uso Avançado (v2.0)

```bat
@echo off
:: Ativação de variáveis locais com expansão atrasada
setlocal enabledelayedexpansion

chcp 65001 >nul

set /p nome=Digite seu nome:
echo Olá !nome!

:: O IntelliSense resolverá as sugestões de arquivos para este bloco
cd /d "%~dp0"

:: Filtragem encadeada monitorada pelo novo motor pós-pipe
tasklist | findstr /i "cmd.exe"

set /a idade=20+5
echo Idade: %idade%

if "!nome!"=="DoutorWho" (
    call :boasVindas
)
exit /b 0

:boasVindas
echo Bem-vindo ao Batch Tools v2.0!
goto :eof