const vscode = require('vscode');

function handleCommandsHover(word, base, cmdData) {

    if (cmdData && (word === base || word === `@${base}`)) {

        let markdown =
            `# ${base}\n\n${cmdData.description || 'Comando batch'}\n`;


        if (cmdData.dependencies) {

            markdown +=
                `\n---\n\n## Dependências\n\n`;


            for (const [dep, desc] of Object.entries(cmdData.dependencies)) {


                // Não mostra regras internas
                // Ex: @arquivos, @diretorios
                if (dep.startsWith('@')) {
                    continue;
                }


                if (typeof desc === 'object') {

                    markdown +=
                        `- \`${dep}\` → ${desc.description || 'Subdependências'}\n`;

                } else {

                    markdown +=
                        `- \`${dep}\` → ${desc}\n`;

                }
            }
        }


        return new vscode.Hover(
            new vscode.MarkdownString(markdown)
        );
    }


    return null;
}


module.exports = {
    handleCommandsHover
};