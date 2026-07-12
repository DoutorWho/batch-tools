const vscode = require('vscode');


// =====================================
// PEGA VARIÁVEIS DECLARADAS COM SET
// =====================================

function getDeclaredVariables(text) {

    const variables = [];

    const regex =
        /^\s*set\s+(?:\/([ap])\s+)?(?:"?([a-zA-Z0-9_]+)\s*=\s*.*?"?)$/gim;


    let match;


    while ((match = regex.exec(text))) {

        const mode = match[1] || null;
        const name = match[2];


        let type = "String";


        if (mode === "a") {
            type = "Inteiro";
        }


        if (mode === "p") {
            type = "String (entrada)";
        }


        variables.push({
            name: name.toLowerCase(),
            type,
            mode
        });
    }


    return variables;
}


// =====================================
// HOVER VARIÁVEIS
// =====================================

function handleVariablesHover(word, line, text, systemVars) {


   const cleanWord =
        word
            .replace(/^%/, '')
            .replace(/%$/, '')
            .replace(/^!/, '')
            .replace(/!$/, '')
            .toLowerCase();



    // =====================================
    // VARIÁVEIS DO SCRIPT
    // =====================================

    const variables =
        getDeclaredVariables(text);



    const variable =
        variables.find(
            v => v.name === cleanWord
        );



    if (variable) {


        let markdown = "";


        markdown += `# ${variable.name}\n\n`;

        markdown += `Variável de script\n\n`;

        markdown += `## Tipo\n\n`;

        markdown += `${variable.type}\n\n`;

        markdown += `## Exemplos\n\n`;

        markdown += `- \`%${variable.name}%\`\n`;

        markdown += `- \`!${variable.name}!\`\n`;



        if (variable.mode === "a") {

            markdown +=
                `\n---\n\nCriada com \`set /a\` (operações matemáticas).\n`;
        }


        if (variable.mode === "p") {

            markdown +=
                `\n---\n\nCriada com \`set /p\` (entrada do usuário).\n`;
        }



        return new vscode.Hover(
            new vscode.MarkdownString(markdown)
        );
    }



    // =====================================
    // VARIÁVEIS DO WINDOWS
    // =====================================

    for (const [sysVar, desc] of Object.entries(systemVars)) {


        if (cleanWord === sysVar.toLowerCase()) {


            const md =
`
# ${sysVar}

${desc}

## Tipo

Variável de sistema do CMD / Windows
`;


            return new vscode.Hover(
                new vscode.MarkdownString(md)
            );
        }
    }


    return null;
}



module.exports = {
    handleVariablesHover,
    getDeclaredVariables
};