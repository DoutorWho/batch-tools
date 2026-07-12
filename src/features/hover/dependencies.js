const vscode = require('vscode');
const { escapeRegex } = require('../hover/utils.js');


function handleDependenciesHover(word, cmdData) {
    if (!cmdData?.dependencies) return null;

    for (const [dep, desc] of Object.entries(cmdData.dependencies)) {
        // 1. Dependência Direta
        if (dep.toLowerCase() === word) {
            if (typeof desc === 'object') {
                let markdown = `# ${dep}\n\n${desc.description || ''}\n`;
                const nested = Object.keys(desc).filter(k => k !== 'description');

                if (nested.length > 0) {
                    markdown += `\n---\n\n## Subdependências\n\n`;
                    for (const nestedKey of nested) {
                        markdown += `- \`${nestedKey}\` → ${desc[nestedKey]}\n`;
                    }
                }
                return new vscode.Hover(new vscode.MarkdownString(markdown));
            }

            const md = new vscode.MarkdownString(`# ${dep}\n\n${typeof desc === 'string' ? desc : desc.description || ''}`);
            return new vscode.Hover(md);
        }

        // 2. Subdependências
        if (typeof desc === 'object') {
            for (const [nestedKey, nestedDesc] of Object.entries(desc)) {
                if (nestedKey === 'description') continue;

                const normalizedWord = word.endsWith('=') ? word : `${word}=`;
                if (nestedKey.toLowerCase() === word || nestedKey.toLowerCase() === normalizedWord) {
                    let markdown = `# ${nestedKey}\n\n${nestedDesc}\n\n---\n\nPertence a: \`${dep}\`\n`;
                    return new vscode.Hover(new vscode.MarkdownString(markdown));
                }
            }
        }
    }
    return null;
}

module.exports = { handleDependenciesHover };