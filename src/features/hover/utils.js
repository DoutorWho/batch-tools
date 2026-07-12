/**
 * UTILITÁRIOS DO SISTEMA DE HOVER
 *
 * Contém funções auxiliares usadas pelo sistema
 * de documentação contextual, incluindo análise
 * de tokens, tratamento de regex e identificação
 * de elementos do script Batch.
 */


function getCommandInfo(word, commandMap) {

    if (!word) return null;

    word = word.trim().toLowerCase();

    for (const cmd in commandMap) {

        const data = commandMap[cmd];

        if (word === cmd.toLowerCase()) {
            return data.description;
        }

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


function getHoverWord(document, position) {

    const range =
        document.getWordRangeAtPosition(
            position,
            /[@/a-zA-Z0-9_]+/
        );

    if (!range) return null;

    return document.getText(range);
}


function escapeRegex(str) {

    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

}


function getScriptTargets(text) {

    const targets = new Map();

    const lines = text.split(/\r?\n/);

    for (const line of lines) {

        //
        // LABEL
        //
        let match =
            line.match(/^\s*:([a-zA-Z0-9_.-]+)/);

        if (match) {

            const name = match[1];

            if (!targets.has(name.toLowerCase())) {

                targets.set(name.toLowerCase(), {
                    name,
                    type: 'Label',
                    description: 'Label principal do script'
                });

            }

            continue;
        }

        //
        // GOTO
        //
        match =
            line.match(/^\s*goto\s+([a-zA-Z0-9_.-]+)/i);

        if (match) {

            const name = match[1];

            if (!targets.has(name.toLowerCase())) {

                targets.set(name.toLowerCase(), {
                    name,
                    type: 'Destino GOTO',
                    description: 'Destino utilizado por GOTO'
                });

            }

            continue;
        }

        //
        // CALL
        //
        match =
            line.match(/^\s*call\s+:?([a-zA-Z0-9_.-]+)/i);

        if (match) {

            const name = match[1];

            if (!targets.has(name.toLowerCase())) {

                targets.set(name.toLowerCase(), {
                    name,
                    type: 'Sub-rotina',
                    description: 'Sub-rotina'
                });

            }

        }

    }

    return [...targets.values()];
}

module.exports = {
    getCommandInfo,
    getHoverWord,
    escapeRegex,
    getScriptTargets
};