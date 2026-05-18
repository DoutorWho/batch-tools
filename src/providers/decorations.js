const vscode = require('vscode');

// =====================================
// DECORAÇÃO (/p /a SOMNETE CONTEXTO)
// =====================================

const optionDecoration =
    vscode.window.createTextEditorDecorationType({
        color: '#FF69C0'
    });

const variableDecoration =
    vscode.window.createTextEditorDecorationType({
        color: '#E6A15C',
        fontStyle: 'italic'
    });

// Injetamos o commandMap por parâmetro para manter o arquivo isolado e modular
function inicializarDecorations(context, commandMap) {

    function updateDecorations(editor) {

        if (!editor) return;

        const document =
            editor.document;

        const commandDecorations = [];
        const variableDecorations = [];


        const lineCount =
            document.lineCount;

        for (let i = 0; i < lineCount; i++) {

            const line =
                document.lineAt(i).text;

            // =====================================
            // VARIÁVEIS (SEGURAS)
            // =====================================

            if (typeof extractVariables === 'function') {

                const vars =
                    extractVariables(line);

                for (const v of vars) {
                    
                    variableDecorations.push({
                        range: new vscode.Range(
                            new vscode.Position(i, v.start),
                            new vscode.Position(i, v.end)
                        )
                    });
                }
            }
        }

        for (let i = 0; i < lineCount; i++) {

            const line =
                document.lineAt(i).text;

            const base =
                line.trim().split(/\s+/)[0]?.toLowerCase();

            const cmdData =
                commandMap[base] ||
                commandMap[`@${base}`];

            if (!cmdData?.dependencies) {
                continue;
            }

            // =====================================
            // pega só deps válidas (/p /a -h)
            // =====================================

            for (const dep of Object.keys(cmdData.dependencies)) {

                if (
                    !/^\/[a-z0-9]+$/i.test(dep) &&
                    !/^-[a-z0-9]+$/i.test(dep)
                ) {
                    continue;
                }

                const escaped =
                    dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                const regex =
                    new RegExp(
                        `(^|\\s)(${escaped})(?=\\s|$|=)`,
                        'gi'
                    );

                let match;

                while ((match = regex.exec(line))) {

                    const start =
                        new vscode.Position(i, match.index + match[1].length);

                    const end =
                        new vscode.Position(i, match.index + match[1].length + dep.length);

                    commandDecorations.push({
                        range: new vscode.Range(start, end)
                    });
                }
            }
        }

        editor.setDecorations(optionDecoration, commandDecorations);
        editor.setDecorations(variableDecoration, variableDecorations);
    }

    // =====================================

    if (vscode.window.activeTextEditor) {
        updateDecorations(vscode.window.activeTextEditor);
    }

    // Registramos os listeners dentro das assinaturas (subscriptions) do contexto para evitar vazamento de memória
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(updateDecorations),

        vscode.workspace.onDidChangeTextDocument(event => {
            const editor =
                vscode.window.activeTextEditor;

            if (editor && event.document === editor.document) {
                updateDecorations(editor);
            }
        })
    );
}

// para as cores do %%

function extractVariables(line) {

const results = [];

let i = 0;

while (i < line.length) {

    const char = line[i];

    // =====================================
    // %% LOOP (APENAS 1 LETRA)
    // =====================================

    if (line.startsWith('%%', i)) {

        const start = i;
        i += 2;

        const letter = line[i];

        if (letter && /[a-z]/i.test(letter)) {

            i++;

            results.push({
                start,
                end: i,
                valid: true
            });

        } else {
            i++;
        }

        continue;
    }

    // =====================================
    // %VAR% OU !VAR!
    // MESMA REGRA PARA AMBOS
    // =====================================

    if (char === '%' || char === '!') {

        const delimiter = char;
        const start = i;

        i++;

        const next = line[i];

        // precisa começar com letra
        if (!next || !/[a-z]/i.test(next)) {
            continue;
        }

        const openIndex = i;

        i++;

        while (i < line.length) {

            const c = line[i];

            // fecha se encontrar mesmo símbolo
            if (c === delimiter) {
                i++;
                break;
            }

            // espaço quebra regra (ignora resto)
            if (c === ' ') {
                break;
            }

            i++;
        }

        results.push({
            start,
            end: i,
            valid: true
        });

        continue;
    }

    i++;
}

return results;
}

// =====================================
// EXPORTAÇÕES (COMMONJS)
// =====================================
module.exports = {
    inicializarDecorations,
    extractVariables
};