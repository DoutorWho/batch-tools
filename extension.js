// O primeiro
const vscode = require('vscode');

// 1. Importa os comandos de onde eles estiverem guardados
const { comandos_cmd } = require('./src/data/comandos_batch.js');
const { variaveis_de_sistemas } = require('./src/data/variaveis_sistemas.js');

// 2. Importa os inicializadores dos provedores (Providers)
const { criarHoverProvider } = require('./src/providers/hover.js');
const { criarAutocompleteProvider } = require('./src/providers/autocomplete.js');
const { inicializarDecorations } = require('./src/providers/decorations.js');

function activate(context) {
    vscode.window.showInformationMessage('Batch Tools ativado');

    // =====================================
    // BASE DE COMANDOS (EXPANDIDA)
    // =====================================
    const commandMap = comandos_cmd;
    const systemVars = variaveis_de_sistemas;

    // Inicializa o Hover Provedor
    const hoverProvider = criarHoverProvider(commandMap, systemVars);

    // Inicializa o Autocomplete Provedor
    const autocompleteProvider = criarAutocompleteProvider(commandMap, systemVars);

    // Inicializa e ativa os Listeners de Decoração Visuais (Cores das variáveis e flags)
    inicializarDecorations(context, commandMap);

    // 4. Registra os provedores no ciclo de vida do VS Code
    context.subscriptions.push(hoverProvider, autocompleteProvider);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};