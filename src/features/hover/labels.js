const vscode = require('vscode');
const { getScriptTargets } = require('../hover/utils.js');

function handleLabels(before, position, document) {
    // ... Código anterior do autocomplete mantido idêntico ...
}

function handleLabelsHover(word, line, text) {
    const regexLabels = /^\s*(?::|call\s+:|goto\s+)([a-zA-Z0-9_\-.]+)\s*$/gim;
    let matchLabel;

    while ((matchLabel = regexLabels.exec(text))) {
        const labelName = matchLabel[1];
        const cleanWord = word.replace(/^:/, '');
        const isLabelContext = /^\s*(?::|call\s+:|goto\s+)/i.test(line);

        if (isLabelContext && cleanWord === labelName.toLowerCase()) {
            let markdown = `# ${labelName}\n\nLabel / destino de fluxo do script\n\n## Exemplos\n\n`;
            markdown += `- \`goto ${labelName}\`\n- \`call :${labelName}\`\n- \`:${labelName}\`\n`;
            
            return new vscode.Hover(new vscode.MarkdownString(markdown));
        }
    }
    return null;
}

module.exports = { handleLabels, handleLabelsHover };