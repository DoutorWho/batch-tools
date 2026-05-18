const vscode = require('vscode');

// =====================================
// HOVER + UTILITÁRIOS 
// =====================================

function getCommandInfo(word) {

    if (!word) return null;

    word = word.trim().toLowerCase();

    for (const cmd in commandMap) {

        const data = commandMap[cmd];

        // comando base
        if (word === cmd.toLowerCase()) {
            return data.description;
        }

        // dependências (/a /p on/off etc)
        if (data.dependencies) {

            for (const dep in data.dependencies) {

                if (word === dep.toLowerCase()) {
                    return data.dependencies[dep];
                }
            }
        }
    }

    return null;
}

// =====================================
// MELHOR DETECÇÃO DE TOKEN (IMPORTANTE)
// =====================================


function getHoverWord(document, position) {

    const range =
        document.getWordRangeAtPosition(position, /[@/a-zA-Z0-9_]+/);

    if (!range) return null;

    return document.getText(range);
}

// =====================================
// ESCAPE REGEX (mantido)
// =====================================

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


// =====================================
// LABELS / TARGETS DO SCRIPT | para o AutoCOMPLEMENT
// =====================================

function getScriptTargets(text) {

    // =====================================
    // RECONHECE:
    //
    // :label
    // call :label
    // goto label
    // =====================================

    const regexTargets =
        // /^\s*(?::|call\s+:|goto\s+)([a-zA-Z0-9_\-.]+)\s*$/gim;
        /^\s*(?::|call\s+:|goto\s+)([a-zA-Z0-9_\-.]+)(?:\s+.*)?$/gim;

    const targets =
        new Map();

    let match;

    while ((match = regexTargets.exec(text))) {

        const name =
            match[1];

        const line =
            match[0];

        // evita duplicatas
        if (targets.has(name.toLowerCase())) {
            continue;
        }

        // =====================================
        // TIPO
        // =====================================

        let type =
            'Label';

        let description =
            'Destino encontrado no script';

        if (/^\s*:/.test(line)) {

            type =
                'Label';

            description =
                'Label principal do script';
        }

        else if (/^\s*call\s+:/i.test(line)) {

            type =
                'Sub-rotina';

            description =
                'Sub-rotina, uma label';
        }

        else if (/^\s*goto\s+/i.test(line)) {

            type =
                'Destino GOTO';

            description =
                'Destino utilizado por GOTO';
        }

        targets.set(
            name.toLowerCase(),
            {
                name,
                type,
                description
            }
        );
    }

    return [...targets.values()];
}

// =====================================
// HOVER
// =====================================

function criarHoverProvider(commandMap, systemVars) {
    return vscode.languages.registerHoverProvider('bat', {

    provideHover(document, position) {

        try {

            const line =
                document.lineAt(position.line).text;

            if (!line) {
                return;
            }

            const text =
                document.getText();

            // =====================================
            // RANGE SOB CURSOR
            // =====================================

            const range =
                document.getWordRangeAtPosition(
                    position,
                    /[@!%:\/a-zA-Z0-9_.\-]+/i
                );

            if (!range) {
                return;
            }

            const rawWord =
                document.getText(range);

            const word =
                rawWord.toLowerCase();

            // =====================================
            // COMANDO BASE
            // =====================================

            const base =
                line.trim().split(/\s+/)[0]?.toLowerCase();

            const cmdData =
                commandMap[base] ||
                commandMap[`@${base}`];

            // =====================================
            // 1. HOVER DO COMANDO BASE
            // =====================================

            if (
                cmdData &&
                (
                    word === base ||
                    word === `@${base}`
                )
            ) {

                let markdown =
                    `# ${base}\n\n`;

                markdown +=
                    `${cmdData.description || 'Comando batch'}\n`;

                if (cmdData.dependencies) {

                    markdown += `\n---\n\n`;
                    markdown += `## Dependências\n\n`;

                    for (const [dep, desc] of Object.entries(cmdData.dependencies)) {

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

            // =====================================
            // 2. HOVER DEPENDÊNCIAS
            // =====================================

            if (cmdData?.dependencies) {

                for (const [dep, desc] of Object.entries(cmdData.dependencies)) {

                    // =====================================
                    // DEPENDÊNCIA NORMAL
                    // =====================================

                    if (dep.toLowerCase() === word) {

                        // caso ele tenha dependencias, tipo set /p =, tem
                        if (typeof desc === 'object') {

                            let markdown =
                                `# ${dep}\n\n`;

                            markdown +=
                                `${desc.description || ''}\n`;

                            const nested =
                                Object.keys(desc)
                                    .filter(k => k !== 'description');

                            if (nested.length > 0) {

                                markdown += `\n---\n\n`;
                                markdown += `## Subdependências\n\n`;

                                for (const nestedKey of nested) {

                                    markdown +=
                                        `- \`${nestedKey}\` → ${desc[nestedKey]}\n`;
                                }
                            }

                            return new vscode.Hover(
                                new vscode.MarkdownString(markdown)
                            );
                        }

                        // caso ele não tenha dependencias, tipo mkdir /p, qu não tem nada além do /p
                    
                        const md = new vscode.MarkdownString();

                        md.appendMarkdown(`# ${dep}\n\n`);
                        md.appendMarkdown(
                            typeof desc === 'string'
                                ? desc
                                : desc.description || ''
                        );

                        return new vscode.Hover(md);      
                    }

                    // =====================================
                    // SUBDEPENDÊNCIAS
                    // =====================================

                    if (typeof desc === 'object') {

                        for (const [nestedKey, nestedDesc] of Object.entries(desc)) {

                            if (nestedKey === 'description') {
                                continue;
                            }

                            const normalizedWord =
                                word.endsWith('=')
                                    ? word
                                    : `${word}=`;

                            if (
                                nestedKey.toLowerCase() === word
                                ||
                                nestedKey.toLowerCase() === normalizedWord
                            ) {

                                let markdown =
                                    `# ${nestedKey}\n\n`;

                                markdown +=
                                    `${nestedDesc}\n`;

                                markdown += `\n---\n\n`;

                                markdown +=
                                    `Pertence a: \`${dep}\`\n`;
                                return new vscode.Hover(
                                    new vscode.MarkdownString(markdown)
                                );
                            }
                        }
                    }                     
                }
            }

            // =====================================
            // 3. VARIÁVEIS DE SCRIPT
            // =====================================

            // coleta variáveis do set (local)
            const declaredVars = [];

            const setRegex =
                /^\s*set\s+(?:\/[pa]\s+)?([a-zA-Z0-9_]+)\s*=/gim;

            let m;

            while ((m = setRegex.exec(text))) {
                declaredVars.push(m[1].toLowerCase());
            }

            // limpa word atual
            const cleanWord =
                word
                    .replace(/^%|%$|^!|!$/g, '')
                    .replace(/=$/, '');

            // =====================================
            // TEXTO PADRÃO (UM SÓ)
            // =====================================

            const makeVarHover = (name) => {

                const md = new vscode.MarkdownString();

                md.appendMarkdown(`# ${name}\n\n`);

                md.appendMarkdown(`Variável de script\n\n`);

                md.appendMarkdown(`## Exemplos\n\n`);

                md.appendMarkdown(`- \`set ${name}=valor\`\n`);
                md.appendMarkdown(`- \`%${name}%\`\n`);
                md.appendMarkdown(`- \`!${name}!\`\n`);

                return md;
            };

            // =====================================
            // 1. USO (% e !)
            // =====================================

            if (
                (word.startsWith('%') || word.startsWith('!')) &&
                declaredVars.includes(cleanWord)
            ) {
                return new vscode.Hover(makeVarHover(cleanWord));
            }

            // =====================================
            // 2. DECLARAÇÃO NO SET
            // =====================================

            const setMatch =
                line.match(/^\s*set\s+(?:\/[pa]\s+)?([a-zA-Z0-9_]+)\s*=/i);

            if (setMatch) {

                const varName = setMatch[1].toLowerCase();

                if (cleanWord === varName) {
                    return new vscode.Hover(makeVarHover(varName));
                }
            }

            // =====================================
            // 4. VARIÁVEIS DE SISTEMA
            // =====================================

            for (const [sysVar, sysDesc] of Object.entries(systemVars)) {

                const lowerSys =
                    sysVar.toLowerCase();

                const cleanWord =
                    word
                        .replace(/^%/, '')
                        .replace(/%$/, '')
                        .replace(/^!/, '')
                        .replace(/!$/, '');

                if (
                    cleanWord === lowerSys
                ) {

                    let markdown =
                        `# ${sysVar}\n\n`;

                    markdown +=
                        `${sysDesc}\n\n`;

                    markdown +=
                        `## Tipo\n\n`;

                    markdown +=
                        `Variável de sistema do CMD / Windows\n`;

                    return new vscode.Hover(
                        new vscode.MarkdownString(markdown)
                    );
                }
            }

            // =====================================
            // 5. LABELS / CALL / GOTO
            // =====================================

            const regexLabels =
                // /^\s*(?::|call\s+|goto\s+)([a-zA-Z0-9_\-.]+)/gim; retirei a parte de goto funcionar!
                /^\s*(?::|call\s+:|goto\s+)([a-zA-Z0-9_\-.]+)\s*$/gim;

            let matchLabel;

            while ((matchLabel = regexLabels.exec(text))) {

                const labelName =
                    matchLabel[1];

                const cleanWord =
                    word.replace(/^:/, '');

                const lineText =
                    document.lineAt(position.line).text;

                const isLabelContext =
                    /^\s*(?::|call\s+:|goto\s+)/i.test(lineText);

                if (
                        isLabelContext &&
                        cleanWord === labelName.toLowerCase()
                    ) {

                    let markdown =
                        `# ${labelName}\n\n`;

                    markdown +=
                        `Label / destino de fluxo do script\n\n`;

                    markdown +=
                        `## Exemplos\n\n`;

                    markdown +=
                        `- \`goto ${labelName}\`\n`;

                    markdown +=
                        `- \`call :${labelName}\`\n`;

                    markdown +=
                        `- \`:${labelName}\`\n`;

                    return new vscode.Hover(
                        new vscode.MarkdownString(markdown)
                    );
                }
            }

            return;

        } catch (err) {

            console.log('Hover error:', err);

            return;
        }
    }
});
}

// =====================================
// EXPORTAÇÕES (COMMONJS)
// =====================================
module.exports = {
    criarHoverProvider,
    getCommandInfo,
    getHoverWord,
    escapeRegex,
    getScriptTargets
};