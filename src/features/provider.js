const vscode = require('vscode');

// exportação do auto complement
const { handleVariables } = require('./autocomplete/variables.js');
const { handleLabels } = require('./autocomplete/labels.js');
const { handleDependencies } = require('./autocomplete/dependencies.js');
const { handleGlobalCommands } = require('./autocomplete/commands.js');

// exportação do hover
const { handleVariablesHover } = require('./hover/variables.js');
const { handleLabelsHover } = require('./hover/labels.js');
const { handleDependenciesHover } = require('./hover/dependencies.js');
const { handleCommandsHover } = require('./hover/commands.js');



// exportação de cores
// exportação de cores
const { updateVariableDecorations } = require('./decorations/variables.js');
const { updateOptionDecorations } = require('./decorations/dependencies.js');
const { updateCommandDecorations } = require('./decorations/commands.js');

// logs de configuração
const { isComment, getCurrentSegment, getCommandAtPosition } = require('./shared/parser.js');


// =====================================
// PROVIDER DE AUTOCOMPLETE
// =====================================
function criarAutocompleteProvider(commandMap, systemVars) {

    return vscode.languages.registerCompletionItemProvider(
        'bat',

        {
            provideCompletionItems(document, position) {

                const line =
                    document
                        .lineAt(position.line)
                        .text;

                if (isComment(line)) {
                    return null;
                }

                const before =
                    getCurrentSegment(
                        line,
                        position.character
                    );




                // =====================================
                // VARIÁVEIS
                // %VAR%
                // !VAR!
                // =====================================

                const varItems =
                    handleVariables(
                        before,
                        position,
                        systemVars,
                        document
                    );


                if (
                    varItems &&
                    varItems.length > 0
                ) {

                    return varItems;
                }



                // =====================================
                // LABELS
                // :
                // goto
                // call
                // =====================================

                const labelItems =
                    handleLabels(
                        before,
                        position,
                        document
                    );


                if (
                    labelItems &&
                    labelItems.length > 0
                ) {

                    return labelItems;
                }


                // =====================================
                // DEPENDÊNCIAS
                //
                // cd /d
                // mkdir /p
                // set /a
                //
                // FICA DEPOIS DOS CAMINHOS
                // =====================================

                const depItems =
                    handleDependencies(
                        before,
                        position,
                        commandMap,
                        document
                    );


                if (
                    depItems &&
                    depItems.length > 0
                ) {

                    return depItems;
                }

                // =====================================
                // COMANDOS GLOBAIS
                // Somente quando estiver iniciando um comando
                // =====================================

                const isCommandStart =
                    /^[\s@a-zA-Z]*$/.test(before) &&
                    !/\s+\S+$/.test(before);


                if (isCommandStart) {

                    return handleGlobalCommands(
                        commandMap
                    );

                }


                return null;
                

            }

        },


        // =====================================
        // GATILHOS
        // =====================================

        ' ',
        '/',
        '%',
        '\\',
        ':'

    );
}

function criarHoverProvider(commandMap, systemVars) {
    return vscode.languages.registerHoverProvider('bat', {

        provideHover(document, position) {

            try {

                const originalLine =
                    document.lineAt(position.line).text;

                if (!originalLine) return;


                const current =
                    getCommandAtPosition(
                        originalLine,
                        position.character
                    );


                const base =
                    current
                        .trim()
                        .split(/\s+/)[0]
                        ?.toLowerCase();


                const text =
                    document.getText();


                const range =
                    document.getWordRangeAtPosition(
                        position,
                        /[@!%:\/a-zA-Z0-9_.\-]+/i
                    );


                if (!range) return;


                const word =
                    document
                        .getText(range)
                        .toLowerCase();


                const cmdData =
                    commandMap[base] ||
                    commandMap[`@${base}`];


                const cmdHover =
                    handleCommandsHover(
                        word,
                        base,
                        cmdData
                    );

                if (cmdHover)
                    return cmdHover;



                const depHover =
                    handleDependenciesHover(
                        word,
                        cmdData
                    );

                if (depHover)
                    return depHover;



                const varHover =
                    handleVariablesHover(
                        word,
                        originalLine,
                        text,
                        systemVars
                    );

                if (varHover)
                    return varHover;



                const labelHover =
                    handleLabelsHover(
                        word,
                        originalLine,
                        text
                    );

                if (labelHover)
                    return labelHover;


            }
            catch(err) {

                console.log(
                    "Hover error:",
                    err
                );

            }
        }
    });
}


function criarDecorationsProvider(context, commandMap) {

    function update(editor) {

        if (!editor) return;

        updateCommandDecorations(
            editor,
            commandMap
        );

        updateOptionDecorations(
            editor,
            commandMap
        );

        updateVariableDecorations(
            editor
        );
    }


    if (vscode.window.activeTextEditor) {
        update(vscode.window.activeTextEditor);
    }


    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(update),

        vscode.workspace.onDidChangeTextDocument(event => {

            const editor =
                vscode.window.activeTextEditor;

            if (
                editor &&
                editor.document === event.document
            ) {
                update(editor);
            }

        })
    );
}




module.exports = {
    criarAutocompleteProvider,
    criarHoverProvider,
    criarDecorationsProvider,
};