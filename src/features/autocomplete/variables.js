const vscode = require('vscode');


function handleVariables(
    before,
    position,
    systemVars,
    document
) {


    const varMatch =
        before.match(
            /(?<![!%])([!%])([a-zA-Z0-9_]*)$/
        );


    if(!varMatch){
        return null;
    }



    const items = [];

    const textoDigitado =
        varMatch[2];

    const gatilho =
        varMatch[1];



    const start =
        new vscode.Position(
            position.line,
            position.character -
            textoDigitado.length
        );


    const range =
        new vscode.Range(
            start,
            position
        );



    // =====================================
    // VARIÁVEIS DO SISTEMA
    // =====================================


    Object.entries(systemVars)
        .forEach(([v,descricao])=>{


            if(
                textoDigitado === "" ||
                v
                .toLowerCase()
                .startsWith(
                    textoDigitado.toLowerCase()
                )
            ){


                const item =
                    new vscode.CompletionItem(
                        `${gatilho}${v}${gatilho}`,
                        vscode.CompletionItemKind.Variable
                    );


                item.filterText =
                    v;


                item.insertText =
                    `${v}${gatilho}`;


                item.range =
                    range;


                item.detail =
                    "Variável de sistema";


                item.label =
                {
                    label:
                        `${gatilho}${v}${gatilho}`,

                    description:
                        "Sistema"
                };


                items.push(item);

            }

        });



    // =====================================
    // VARIÁVEIS DO SCRIPT
    // =====================================


    const text =
        document.getText();



    /*
        Aceita:

        set nome=valor

        set "nome=valor"

        set /a numero=10

        set /p nome=
    */


    const regex =
        /^\s*set\s+(?:\/([ap])\s+)?(?:"?([a-zA-Z0-9_]+)\s*=)/gim;



    let match;



    const variables =
        new Map();



    while(
        (match = regex.exec(text))
    ){


        const modo =
            match[1];


        const nome =
            match[2];



        let type =
            "string";



        if(
            modo &&
            modo.toLowerCase() === "a"
        ){

            type =
                "float";

        }



        variables.set(
            nome.toLowerCase(),
            {
                name:nome,
                type
            }
        );

    }



    for(
        const variable
        of variables.values()
    ){



        if(
            textoDigitado &&
            !variable.name
                .toLowerCase()
                .startsWith(
                    textoDigitado.toLowerCase()
                )
        ){
            continue;
        }




        const item =
            new vscode.CompletionItem(
                `${gatilho}${variable.name}${gatilho}`,
                vscode.CompletionItemKind.Variable
            );



        item.filterText =
            variable.name;



        item.insertText =
            `${variable.name}${gatilho}`;



        item.range =
            range;



        item.detail =
            `Variável do script (${variable.type})`;



        item.label =
        {
            label:
                `${gatilho}${variable.name}${gatilho}`,

            description:
                variable.type
        };



        item.documentation =
            new vscode.MarkdownString(
                `Variável criada pelo comando SET.\n\n` +
                `Tipo: **${variable.type}**\n\n` +
                `Exemplo:\n\n` +
                `set ${variable.name}=valor`
            );



        items.push(item);

    }



    return items;

}



module.exports = {
    handleVariables
};