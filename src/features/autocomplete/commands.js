const vscode = require('vscode');

function handleGlobalCommands(commandMap) {
    const items = [];

    for (const [name, data] of Object.entries(commandMap)) {
        const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Keyword);
        item.detail = data.description;

        if (data.dependencies) {
            let markdown = `### Parâmetros comuns\n\n`;
            for (const [dep, desc] of Object.entries(data.dependencies)) {
                if (typeof desc === 'object') {
                    markdown += `- \`${dep}\` → ${desc.description || 'Subcomandos'}\n`;
                } else {
                    markdown += `- \`${dep}\` → ${desc}\n`;
                }
            }
            item.documentation = new vscode.MarkdownString(markdown);
        }
        items.push(item);
    }

    return items;
}

module.exports = { handleGlobalCommands };