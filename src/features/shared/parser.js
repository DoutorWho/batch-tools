
// para ignorar o rem ou ::
function isComment(line) {

    const trimmed =
        line.trimStart();

    return (
        /^rem(\s|$)/i.test(trimmed) ||
        /^::/.test(trimmed)
    );

}


function getCurrentSegment(line, cursor) {

    return line
        .substring(0, cursor)
        .split(/(?:&&|\|\||[|&<>])/)
        .pop()
        .trimStart();

}

function getCommandAtPosition(line, position) {

    const segments =
        line.split(/(?:&&|\|\||[|&<>])/);


    let start = 0;


    for (const segment of segments) {

        const end =
            start + segment.length;


        if (
            position >= start &&
            position <= end
        ) {

            return segment.trim();

        }


        start =
            end + 1;
    }


    return line.trim();
}


// Divide uma linha em comandos independentes
// Exemplo:
// tasklist /v | taskkill /f
//
// retorna:
// [
//   "tasklist /v",
//   "taskkill /f"
// ]

function getCommandSegments(line) {

    return line
        .split(/(?:&&|\|\||[|&<>])/)
        .map(segment => segment.trim())
        .filter(segment => segment.length > 0);

}



module.exports = {
    isComment,
    getCurrentSegment,
    getCommandAtPosition,
    getCommandSegments,
};