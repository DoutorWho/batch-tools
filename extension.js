// O primeiro
const vscode = require('vscode');

// 1. Importa os comandos de onde eles estiverem guardados

const {comandos_cmd, variaveis_de_sistemas} = require('./src/data/index.js');

// 2. Importa os inicializadores dos provedores (Providers) | Complement, hover e decoration

const { criarAutocompleteProvider, criarHoverProvider, criarDecorationsProvider } = require('./src/features/provider.js');


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
    criarDecorationsProvider(context, commandMap);

    // 4. Registra os provedores no ciclo de vida do VS Code
    context.subscriptions.push(hoverProvider, autocompleteProvider);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};