const vscode = require('vscode');
const { isComment } = require('../shared/parser.js');

const variableDecoration =
    vscode.window.createTextEditorDecorationType({
        color: '#E6A15C',
        fontStyle: 'italic'
    });


function extractVariables(line) {

    if (isComment(line)) {
        return [];
    }

    const results = [];

    let i = 0;


    while (i < line.length) {

        const char = line[i];


        // %%a (variável FOR)
        if (line.startsWith('%%', i)) {

            const start = i;

            i += 2;


            if (/[a-z0-9_]/i.test(line[i])) {

                i++;

                results.push({
                    start,
                    end: i
                });

            }

            continue;
        }



        // %VAR% ou !VAR!
        if (char === '%' || char === '!') {


            const delimiter = char;

            const start = i;


            i++;


            // aceita:
            // letras
            // números
            // _
            if (!/[a-z0-9_]/i.test(line[i])) {

                continue;

            }


            i++;



            while (
                i < line.length &&
                line[i] !== delimiter
            ) {

                // impede pegar espaços
                if (/\s/.test(line[i])) {
                    break;
                }

                i++;

            }



            if (line[i] === delimiter) {

                i++;

                results.push({
                    start,
                    end: i
                });

            }


            continue;
        }


        i++;

    }


    return results;
}


function updateVariableDecorations(editor) {

    if (!editor) return;


    const decorations = [];

    const document =
        editor.document;


    for (let i = 0; i < document.lineCount; i++) {


        const line =
            document.lineAt(i).text;


        for (const variable of extractVariables(line)) {

            decorations.push({

                range:
                    new vscode.Range(
                        new vscode.Position(i, variable.start),
                        new vscode.Position(i, variable.end)
                    )

            });

        }

    }


    editor.setDecorations(
        variableDecoration,
        decorations
    );
}


module.exports = {
    updateVariableDecorations,
    extractVariables
};