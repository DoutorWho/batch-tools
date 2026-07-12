const vscode = require('vscode');
const { escapeRegex, getScriptTargets } = require('../hover/utils.js');
const { handleFilesystemAutocomplete } = require('./filesystem.js');


function handleDependencies(
    before,
    position,
    commandMap,
    document
) {

    let activeCommand = null;


    // =====================================
    // DESCOBRE O COMANDO ATUAL
    // =====================================

    for (const key in commandMap) {

        const regex =
            new RegExp(
                `^\\s*${escapeRegex(key)}\\b`,
                'i'
            );


        if (regex.test(before)) {

            activeCommand = key;
            break;
        }
    }



    if (
        !activeCommand ||
        !commandMap[activeCommand]
    ) {
        return null;
    }



    const cmd =
        commandMap[activeCommand];



    let dynamicDependencies =
    {
        ...(cmd.dependencies || {})
    };



    // =====================================
    // LABELS DINÂMICAS
    // goto / call
    // =====================================

    if (
        activeCommand.toLowerCase() === 'goto' ||
        activeCommand.toLowerCase() === 'call'
    ) {

        const targets =
            getScriptTargets(
                document.getText()
            );


        for (const target of targets) {

            dynamicDependencies[target.name] =
            {
                type: target.type,
                description: target.description
            };
        }
    }



    const hasSpaceAfter =
        new RegExp(
            `^\\s*${escapeRegex(activeCommand)}\\s+`,
            'i'
        )
        .test(before);



    if (!hasSpaceAfter) {
        return null;
    }



    // =====================================
    // DETECTA O QUE ESTÁ SENDO DIGITADO
    // =====================================

    const lastToken =
        before
            .split(/\s+/)
            .pop();



    const typingOption =
        lastToken.startsWith('/');



    // =====================================
    // FILESYSTEM
    //
    // Só ativa quando não está digitando
    // uma opção como /d
    // =====================================

    if (!typingOption) {


        for (
            const [key,value]
            of Object.entries(dynamicDependencies)
        ) {


            if (
                key.startsWith('@') &&
                value.target
            ) {


                const pathItems =
                    handleFilesystemAutocomplete(
                        document,
                        position,
                        value.target
                    );


                if (
                    pathItems &&
                    pathItems.length > 0
                ) {

                    return pathItems;
                }

            }

        }

    }



    // =====================================
    // DEPENDÊNCIAS ANINHADAS
    //
    // exemplo:
    // set /p
    // for /f
    // =====================================

    let nestedDependencies = null;


    for (
        const [depName, depValue]
        of Object.entries(dynamicDependencies)
    ) {


        if (
            typeof depValue === 'object' &&
            before
                .toLowerCase()
                .includes(
                    depName.toLowerCase()
                )
        ) {

            nestedDependencies =
                depValue;
        }

    }



    const depMatch =
        before.match(
            /[\/!a-zA-Z0-9:=._()-]+$/
        );



    const start =
        new vscode.Position(
            position.line,
            position.character -
            (
                depMatch
                ?
                depMatch[0].length
                :
                0
            )
        );



    const range =
        new vscode.Range(
            start,
            position
        );



    // =====================================
    // RETORNA SUBDEPENDÊNCIAS
    // =====================================

    if (nestedDependencies) {


        return Object.entries(nestedDependencies)

            .filter(([key]) =>
                key !== 'description' &&
                key !== 'target'
            )


            .map(([dep,desc])=>{


                const item =
                    new vscode.CompletionItem(
                        dep,
                        vscode.CompletionItemKind.Field
                    );


                item.documentation =
                    new vscode.MarkdownString(
                        String(desc)
                    );


                item.range =
                    range;


                return item;

            });

    }



    // =====================================
    // DEPENDÊNCIAS NORMAIS
    //
    // /d
    // /p
    // /a
    // =====================================

    return Object.entries(dynamicDependencies)

        // remove regras internas
        .filter(([dep]) =>
            !dep.startsWith('@')
        )

        // remove opções já digitadas
        .filter(([dep]) => {

            const alreadyUsed =
                new RegExp(
                    `(^|\\s)${escapeRegex(dep)}(?=\\s|$)`,
                    'i'
                )
                .test(before);


            return !alreadyUsed;

        })

        .map(([dep,desc])=>{


            let kind =
                vscode.CompletionItemKind.Keyword;



            if (
                typeof desc === 'object' &&
                (
                    desc.type === 'Label' ||
                    desc.type === 'Sub-rotina' ||
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



            item.range =
                range;



            if (
                typeof desc === 'object'
            ) {


                item.documentation =
                    new vscode.MarkdownString(
                        desc.description || ''
                    );


            } else {


                item.documentation =
                    new vscode.MarkdownString(
                        String(desc)
                    );

            }



            return item;

        });

}



module.exports = {
    handleDependencies
};