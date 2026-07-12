/**
 * SISTEMA, HARDWARE E REDE
 *
 * Variáveis responsáveis por fornecer informações
 * sobre o sistema operacional, componentes de
 * hardware, arquitetura do processador e dados
 * relacionados à configuração de rede e conexões.
 */

const processamento_variables = {
    'PROCESSOR_ARCHITECTURE': 'Retorna a arquitetura do processador.',
    'PROCESSOR_IDENTIFIER': 'Retorna identificação detalhada da CPU.',
    'PROCESSOR_LEVEL': 'Retorna o nível/modelo do processador.',
    'PROCESSOR_REVISION': 'Retorna a revisão do processador.',
    'NUMBER_OF_PROCESSORS': 'Retorna quantidade de núcleos/processadores lógicos.',
}

const windows_sistema_variables = {
    'OS': 'Retorna o nome do sistema operacional.',
    'NUMBER_OF_PROCESSORS': 'Quantidade de processadores lógicos disponíveis.',
    'ARCHITEW6432': 'Indica execução WOW64 em sistema 64 bits.',
    'SESSIONNAME': 'Nome da sessão atual do Windows.',
}


const rede_variables = {
    'COMSPEC': 'Retorna o caminho completo do interpretador CMD.',
    'ALLUSERSPROFILE': 'Retorna perfil compartilhado entre usuários.',
    'CLIENTNAME': 'Retorna nome do cliente remoto conectado via RDP.',
    'CLIENTNAME': 'Retorna nome da máquina cliente em sessão remota.', 
}

// para exportar

module.exports = {
    ...processamento_variables,
    ...windows_sistema_variables,
    ...rede_variables,
};