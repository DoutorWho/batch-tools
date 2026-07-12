/**
 * CMD E PROCESSAMENTO
 *
 * Variáveis responsáveis pelo funcionamento do
 * interpretador de comandos, controle de execução,
 * extensões do CMD, prompt e informações internas
 * do processo em execução.
 */

const cmd_processamento_variables = {
    'CMDCMDLINE': 'Retorna a linha de comando usada para iniciar o CMD.',
    'CMDEXTVERSION': 'Retorna a versão das extensões do CMD.',
    'CMDER_ROOT': 'Variável usada pelo Cmder para localizar instalação.',
    'PROMPT': 'Retorna a configuração atual do prompt.',
    'ERRORLEVEL': 'Retorna o código de saída do último comando executado.',
    '__APPDIR__': 'Retorna o diretório onde o cmd.exe está localizado.',
    '__PID__': 'Retorna o PID do processo atual do CMD.',
    '__TICK__': 'Retorna contador interno de ticks do CMD.',
    '__RANDOM__': 'Retorna um número pseudoaleatório interno.',
    'RANDOM': 'Gera um número pseudoaleatório entre 0 e 32767.',

}

const powershell_variables = {
    'PSMODULEPATH': 'Lista caminhos de módulos do PowerShell.',
    'WT_SESSION': 'Identificador da sessão do Windows Terminal.',
    'TERM': 'Define tipo de terminal atual.',
    'TERM_PROGRAM': 'Identifica o programa terminal em uso.',
}

const dinamicas_avancadas_variables = {
    'ERRORLEVEL': 'Código de retorno do último comando executado.',
    'CMDEXTVERSION': 'Versão atual das extensões do CMD.',
    'HIGHESTNUMANODENUMBER': 'Maior nó NUMA disponível no sistema.',
}



// para exportar

module.exports = {
    ...cmd_processamento_variables,
    ...powershell_variables,
    ...dinamicas_avancadas_variables,
};