const vscode = require('vscode');
const { getCommandSegments } = require('../shared/parser.js');


const optionDecoration =
    vscode.window.createTextEditorDecorationType({
        color: '#FF69C0'
    });



function updateOptionDecorations(editor, commandMap) {

    if (!editor)
        return;


    const decorations = [];

    const document =
        editor.document;



    for (let i = 0; i < document.lineCount; i++) {


        const line =
            document.lineAt(i).text;



        const segments =
            getCommandSegments(line);



        let offset = 0;



        for (const segment of segments) {


            const segmentStart =
                line.indexOf(
                    segment,
                    offset
                );


            offset =
                segmentStart +
                segment.length;



            const base =
                segment
                    .trim()
                    .split(/\s+/)[0]
                    ?.toLowerCase();



            const cmd =
                commandMap[base] ||
                commandMap[`@${base}`];



            if (!cmd?.dependencies)
                continue;



            for (const dep of Object.keys(cmd.dependencies)) {


                if (
                    !/^\/[a-z0-9]+$/i.test(dep) &&
                    !/^-[a-z0-9]+$/i.test(dep)
                ) {
                    continue;
                }



                const regex =
                    new RegExp(
                        `(^|\\s)${dep}(?=\\s|$|=)`,
                        'gi'
                    );



                let match;



                while (
                    (match = regex.exec(segment))
                ) {


                    const start =
                        segmentStart +
                        match.index +
                        match[1].length;



                    decorations.push({

                        range:
                            new vscode.Range(
                                new vscode.Position(
                                    i,
                                    start
                                ),

                                new vscode.Position(
                                    i,
                                    start + dep.length
                                )
                            )

                    });

                }

            }

        }

    }


    editor.setDecorations(
        optionDecoration,
        decorations
    );

}



module.exports = {
    updateOptionDecorations
};