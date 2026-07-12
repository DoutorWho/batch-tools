/**
 * DATA E HORA
 *
 * Variáveis responsáveis por fornecer informações
 * temporais do sistema, incluindo data, hora e
 * valores internos relacionados ao interpretador.
 */

const datetime_variables = {
    'DATE': 'Retorna a data atual do sistema.',
    'TIME': 'Retorna a hora atual do sistema.',
    '__DATE__': 'Versão interna expandida da data atual do CMD.',
    '__TIME__': 'Versão interna expandida da hora atual do CMD.',
}


// para exportar

module.exports = {
    ...datetime_variables,
};