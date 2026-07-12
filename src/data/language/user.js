/**
 * USUÁRIO E SESSÃO
 *
 * Variáveis relacionadas à identificação do usuário,
 * domínio, sessão ativa, computador e conexões
 * de usuários remotos.
 */

const user_variables = {
    'USERNAME': 'Retorna o nome do usuário logado no momento.',
    'USERDOMAIN': 'Retorna o domínio do usuário atual.',
    'USERPROFILE': 'Retorna o caminho completo da pasta do usuário atual.',
    'LOGONSERVER': 'Retorna o servidor responsável pelo logon do usuário.',
    'SESSIONNAME': 'Retorna o nome da sessão atual do Terminal Services.',
    'COMPUTERNAME': 'Retorna o nome do computador.',
}


// para exportar

module.exports = {
    ...user_variables,
};