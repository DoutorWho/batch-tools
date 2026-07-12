const vscode = require('vscode');


const commandDecoration =
    vscode.window.createTextEditorDecorationType({
        fontWeight: 'bold'
    });



function updateCommandDecorations(editor, commandMap) {

    if (!editor) return;


    const decorations = [];

    const document =
        editor.document;


    for(let i = 0; i < document.lineCount; i++) {


        const line =
            document.lineAt(i).text;


        const match =
            line.match(/^\s*(@?\w+)/);


        if(!match)
            continue;



        const command =
            match[1].toLowerCase();



        if(commandMap[command]) {


            decorations.push({

                range:
                    new vscode.Range(
                        new vscode.Position(i, match.index),
                        new vscode.Position(
                            i,
                            match.index + match[1].length
                        )
                    )

            });

        }

    }



    editor.setDecorations(
        commandDecoration,
        decorations
    );

}


module.exports = {
    updateCommandDecorations
};