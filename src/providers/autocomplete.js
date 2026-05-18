const vscode = require('vscode');

// =====================================
// IMPORTAÇÕES DE DEPENDÊNCIAS INTERNAS
// =====================================
// Puxa as funções necessárias do arquivo vizinho sem duplicar código
const { getScriptTargets, escapeRegex } = require('./hover.js');

// =====================================
// AUTOCOMPLETE
// =====================================

function criarAutocompleteProvider(commandMap, systemVars) {
    return vscode.languages.registerCompletionItemProvider(

    'bat',

    {
        provideCompletionItems(document, position) {

            const items = [];

            const line =
                document.lineAt(position).text;

            const before =
                line.substring(0, position.character);

            // =====================================
            // 0. DETECTA VARIÁVEL PRIMEIRO (PRIORIDADE MÁXIMA)
            // =====================================

            //const varMatch = before.match(/(?<!%)(%)([a-zA-Z0-9_]*)$/);
            const varMatch = before.match(/(?<![!%])([!%])([a-zA-Z0-9_]*)$/);

            if (varMatch) {

                const textoDigitado = varMatch[2];
                const gatilho = varMatch[1]

                const start =
                    new vscode.Position(
                        position.line,
                        position.character - textoDigitado.length
                    );

                const range =
                    new vscode.Range(start, position);

                // =========================
                // sistema
                // =========================

                Object.entries(systemVars).forEach(([v, descricao]) => {

                    const nomeVariavel = v.toLowerCase();

                    if (textoDigitado === "" || v.startsWith(textoDigitado)) {

                        const item = new vscode.CompletionItem(
                            `%${v}%`,
                            vscode.CompletionItemKind.Variable
                        );

                        // 3. REFORÇO: O filterText ajuda o VS Code a não se perder
                        item.filterText = v;

                        item.range = range;
                        item.insertText = `${v}${gatilho}`;

                        // Agora o detail usa a descrição específica do objeto
                        item.detail = descricao;

                        // Dica extra: você pode colocar um rótulo no lado direito (label details)
                        item.label = {
                            label: `${gatilho}${v}${gatilho}`,
                            description: 'Sistema'
                        };

                        item.range = range;

                        items.push(item);
                    }
                });

                // =========================
                // script para os básicos
                // =========================

                const text = document.getText();

                const regex =
                    /^set\s+(?:\/[pa]\s+)?([a-zA-Z0-9_]+)=/gim;

                let match;

                // para caso ele tenha digitado %
                while ((match = regex.exec(text))) {

                    const item =
                        new vscode.CompletionItem(
                            `%${match[1]}%`,
                            vscode.CompletionItemKind.Variable
                        );

                    item.filterText = match[1]

                    item.insertText = `${match[1]}${gatilho}`

                    item.detail = 'Variável do script';

                    // retulo na parte esquerda
                    item.label = {
                        label: `${gatilho}${match[1]}${gatilho}`,
                        description: 'Script'
                    };

                    item.range = range;

                    items.push(item);
                }

                return items;
            }

            // =========================
            // LABELS + CALLS DO SCRIPT
            // =========================

            const text =
                document.getText();

            // =====================================
            // CONTEXTOS:
            //
            // :
            // goto
            // call
            // =====================================

            const isLabelContext =
                /:\w*$/i.test(before)
                ||
                /\b(goto|call)\s+[a-zA-Z0-9_\-.:]*$/i
                    .test(before);

            if (isLabelContext) {

                // =====================================
                // TEXTO PARCIAL
                // =====================================

                const currentMatch =
                    before.match(/[:a-zA-Z0-9_\-.]+$/);

                const currentText =
                    currentMatch
                        ? currentMatch[0]
                        : '';

                // =====================================
                // RANGE
                // =====================================

                const start =
                    new vscode.Position(
                        position.line,
                        position.character - currentText.length
                    );

                const range =
                    new vscode.Range(start, position);

                // =====================================
                // TARGETS
                // =====================================

                const targets =
                    getScriptTargets(text);

                for (const target of targets) {

                    const item =
                        new vscode.CompletionItem(
                            `:${target.name}`,
                            vscode.CompletionItemKind.Reference
                        );

                    // =====================================
                    // MATCH
                    // =====================================

                    item.filterText =
                        `${target.name} :${target.name}`;

                    // =====================================
                    // INSERT
                    // =====================================

                    // digitando :
                    if (/:\w*$/i.test(before)) {

                        item.insertText =
                            `:${target.name}`;

                    } else {

                        // goto/call
                        item.insertText =
                            target.name;
                    }

                    item.detail =
                        target.description;

                    item.documentation =
                        new vscode.MarkdownString(
                            `${target.description}\n\n\`${target.name}\``
                        );

                    item.label = {
                        label: `:${target.name}`,
                        description: target.type
                    };

                    item.range = range;

                    items.push(item);
                }
            }

            // =====================================
            // 1. DEPENDÊNCIAS (set, mkdir, @echo)
            // =====================================

            let activeCommand = null;

            for (const key in commandMap) {

                const regex =
                    new RegExp(`^\\s*${escapeRegex(key)}\\b`, 'i');

                if (regex.test(before)) {

                    activeCommand = key;
                    break;
                }
            }

            if (activeCommand && commandMap[activeCommand]) {

                const cmd = commandMap[activeCommand];

                // =====================================
                // DEPENDÊNCIAS DINÂMICAS
                // =====================================

                let dynamicDependencies =
                    {
                        ...(cmd.dependencies || {})
                    };

                // =====================================
                // GOTO / CALL → LABELS
                // =====================================

                if (
                    activeCommand.toLowerCase() === 'goto'
                    ||
                    activeCommand.toLowerCase() === 'call'
                ) {

                    const targets =
                        getScriptTargets(text);

                    for (const target of targets) {

                        dynamicDependencies[target.name] = {
                            type: target.type,
                            description: target.description
                        };
                    }
                }

                const hasSpaceAfter =
                    new RegExp(`^\\s*${escapeRegex(activeCommand)}\\s+`, 'i')
                        .test(before);

                if (hasSpaceAfter) {

                    if (!dynamicDependencies) {
                        return [];
                    }

                    // =====================================
                    // DESCOBRE SE ESTÁ DENTRO DE UMA FLAG
                    // EX: for /f ...
                    // =====================================

                    let nestedDependencies = null;

                    for (const [depName, depValue] of Object.entries(dynamicDependencies)) {

                        if (
                            typeof depValue === 'object' &&
                            before.toLowerCase().includes(depName.toLowerCase())
                        ) {

                            nestedDependencies = depValue;
                        }
                    }

                    // =====================================
                    // PARTE ONDE ELE SUBSTITUI CORRETAMENTE
                    // =====================================

                    const depMatch =
                        before.match(/[\/!a-zA-Z0-9:=._()-]+$/);

                    const start =
                        new vscode.Position(
                            position.line,
                            position.character - (depMatch ? depMatch[0].length : 0)
                        );

                    const range =
                        new vscode.Range(start, position);

                    // =====================================
                    // DEPENDÊNCIAS INTERNAS
                    // =====================================

                    if (nestedDependencies) {

                        return Object.entries(nestedDependencies)
                            .filter(([key]) => key !== 'description')
                            .map(([dep, desc]) => {

                                const item =
                                    new vscode.CompletionItem(
                                        dep,
                                        vscode.CompletionItemKind.Field
                                    );

                                item.documentation =
                                    new vscode.MarkdownString(String(desc));

                                item.range = range;

                                return item;
                            });
                    }

                    // =====================================
                    // DEPENDÊNCIAS NORMAIS
                    // =====================================

                    return Object.entries(dynamicDependencies).map(([dep, desc]) => {

                    let kind =
                        vscode.CompletionItemKind.Keyword;

                    // =====================================
                    // LABELS / TARGETS
                    // =====================================

                    if (
                        typeof desc === 'object'
                        &&
                        (
                            desc.type === 'Label'
                            ||
                            desc.type === 'Sub-rotina'
                            ||
                            desc.type === 'Destino GOTO'
                        )
                    ) {

                        kind =
                            vscode.CompletionItemKind.Reference;
                    }

                    const item =
                        new vscode.CompletionItem(
                            dep,
                            kind
                        );

                        // =====================================
                        // DESCRIÇÃO
                        // =====================================

                        if (typeof desc === 'object') {

                            let markdown =
                                `${desc.description || ''}`;

                            const nested =
                                Object.keys(desc)
                                    .filter(k => k !== 'description');

                            if (nested.length > 0) {

                                markdown += `\n\n---\n\n`;

                                for (const nestedKey of nested) {

                                    markdown +=
                                        `- \`${nestedKey}\` → ${desc[nestedKey]}\n`;
                                }
                            }

                            item.documentation =
                                new vscode.MarkdownString(markdown);

                        } else {

                            item.documentation =
                                new vscode.MarkdownString(String(desc));
                        }

                        item.range = range;

                        return item;
                    });
                }

                return [];
            }

            // =====================================
            // 2. COMANDOS GLOBAIS
            // =====================================

            for (const [name, data] of Object.entries(commandMap)) {

                const item = new vscode.CompletionItem(
                    name,
                    vscode.CompletionItemKind.Keyword
                );

                item.detail = data.description;

                // =====================================
                // DOCUMENTAÇÃO DOS PARÂMETROS
                // =====================================

                if (data.dependencies) {

                    let markdown =
                        `### Parâmetros comuns\n\n`;

                    for (const [dep, desc] of Object.entries(data.dependencies)) {

                        if (typeof desc === 'object') {

                            markdown +=
                                `- \`${dep}\` → ${desc.description || 'Subcomandos'}\n`;

                        } else {

                            markdown +=
                                `- \`${dep}\` → ${desc}\n`;
                        }
                    }

                    item.documentation =
                        new vscode.MarkdownString(markdown);
                }

                items.push(item);
            }

            return items;
        }
    },

    ' ', '/', '%'
);
}

// =====================================
// EXPORTAÇÕES (COMMONJS)
// =====================================
module.exports = {
    criarAutocompleteProvider
};