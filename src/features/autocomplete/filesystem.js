const vscode = require('vscode');
const fs = require('fs');
const path = require('path');


function handleFilesystemAutocomplete(
    document,
    position,
    target = 'folder'
) {


    const line =
        document
            .lineAt(position.line)
            .text;


    const before =
        line.substring(
            0,
            position.character
        );




    // pega tudo depois do comando
    const match =
        before.match(
            /^\s*\S+\s+(.*)$/
        );


    if (!match) {
        return null;
    }



    let typedPath =
        match[1] || "";



    // remove aspas
    typedPath =
        typedPath.replace(/^"|"$/g, "");



    // =====================================
    // DEFINE DIRETÓRIO BASE
    // =====================================

    let basePath =
        path.dirname(
            document.uri.fsPath
        );



    let partial =
        typedPath;



    // =====================================
    // SE TEM BARRA, ENTRA NA PASTA
    //
    // exemplos:
    //
    // exemplos\
    // exemplos\teste
    //
    // =====================================

    if (
        typedPath.includes('\\') ||
        typedPath.includes('/')
    ) {


        const separator =
            typedPath.lastIndexOf('\\') >= 0
            ?
            '\\'
            :
            '/';



        const index =
            typedPath.lastIndexOf(separator);



        const folderPart =
            typedPath.substring(
                0,
                index + 1
            );



        partial =
            typedPath.substring(
                index + 1
            );



        basePath =
            path.resolve(
                basePath,
                folderPart
            );

    }



    console.log(
        "BASE:",
        basePath
    );


    console.log(
        "PARTIAL:",
        partial
    );



    if (
        !fs.existsSync(basePath)
    ) {

        console.log(
            "PASTA NÃO EXISTE"
        );

        return [];

    }



    const items = [];



    const entries =
        fs.readdirSync(
            basePath,
            {
                withFileTypes:true
            }
        );



    for(
        const entry of entries
    ) {


        const isFolder =
            entry.isDirectory();



        // =============================
        // FILTRO PELO TARGET
        // =============================

        if(
            target === 'folder' &&
            !isFolder
        ){
            continue;
        }


        if(
            target === 'file' &&
            isFolder
        ){
            continue;
        }



        // =============================
        // FILTRO PELO TEXTO DIGITADO
        // =============================

        if(
            partial &&
            !entry.name
                .toLowerCase()
                .startsWith(
                    partial.toLowerCase()
                )
        ){
            continue;
        }



        const item =
            new vscode.CompletionItem(
                entry.name,
                isFolder
                ?
                vscode.CompletionItemKind.Folder
                :
                vscode.CompletionItemKind.File
            );



        // mantém o caminho
        item.insertText =
            entry.name +
            (
                isFolder
                ?
                '/'
                :
                ''
            );



        items.push(item);

    }



    return items;

}



module.exports = {
    handleFilesystemAutocomplete
};