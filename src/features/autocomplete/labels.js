const vscode = require('vscode');
const { getScriptTargets } = require('../hover/utils.js');


function handleLabels(before, position, document) {

    /*
        Detecta contexto:

        :
        call 
        call :
        call :nome
        goto 
        goto nome
    */


    const match =
        before.match(/(?:^|\s)(call|goto)\s*:?(.*)$/i);


    const onlyColon =
        /:\w*$/.test(before);



    if (!match && !onlyColon) {
        return null;
    }



    const text =
        document.getText();


    const targets =
        getScriptTargets(text);



    if (!targets || targets.length === 0) {
        return null;
    }



    /*
        Descobre o que está sendo digitado
    */


    let typed = "";


    if (match) {

        typed = match[2] || "";

    } 
    else {

        const m =
            before.match(/:(\w*)$/);

        typed =
            m ? m[1] : "";
    }



    const start =
        new vscode.Position(
            position.line,
            position.character - typed.length
        );


    const range =
        new vscode.Range(
            start,
            position
        );



    const items = [];



    for (const target of targets) {


        // filtro manual
        if (
            typed &&
            !target.name
                .toLowerCase()
                .startsWith(
                    typed.toLowerCase()
                )
        ) {
            continue;
        }



        const item =
            new vscode.CompletionItem(
                target.name,
                vscode.CompletionItemKind.Reference
            );



        /*
            Se já existe :
            não coloca outro

            call :
            + exemplo

            vira:

            call :exemplo

        */


        if (
            /:\w*$/.test(before)
        ) {

            item.insertText =
                target.name;

        } else {

            item.insertText =
                ":" + target.name;
        }



        item.range =
            range;


        item.filterText =
            target.name;



        item.detail =
            target.type;



        item.documentation =
            new vscode.MarkdownString(
                `${target.description}\n\n` +
                `Label: \`${target.name}\``
            );


        items.push(item);
    }



    return items.length
        ? items
        : null;
}



module.exports = {
    handleLabels
};