/**
 * DIRETÓRIOS, CAMINHOS E AMBIENTE
 *
 * Variáveis responsáveis por armazenar caminhos
 * do sistema, diretórios de usuários, localização
 * de programas instalados e configurações gerais
 * do ambiente de execução.
 */



const diretorios_variables = {
    'CD': 'Retorna o diretório atual.',
    '__CD__': 'Retorna o diretório atual absoluto do CMD.',
    'PATH': 'Lista os diretórios usados para localizar executáveis.',
    'PATHEXT': 'Define extensões consideradas executáveis pelo CMD.',
    'HOMEDRIVE': 'Retorna a unidade padrão do usuário.',
    'HOMEPATH': 'Retorna o caminho da pasta pessoal do usuário.',
    'APPDATA': 'Retorna a pasta Roaming AppData do usuário.',
    'LOCALAPPDATA': 'Retorna a pasta Local AppData do usuário.',
    'PROGRAMDATA': 'Retorna a pasta ProgramData compartilhada.',
    'PROGRAMFILES': 'Retorna a pasta Program Files.',
    'PROGRAMFILES(X86)': 'Retorna a pasta Program Files (x86).',
    'COMMONPROGRAMFILES': 'Retorna a pasta Common Files.',
    'COMMONPROGRAMFILES(X86)': 'Retorna a pasta Common Files (x86).',
    'PUBLIC': 'Retorna a pasta pública do Windows.',
    'TEMP': 'Retorna a pasta temporária atual.',
    'TMP': 'Retorna a pasta temporária auxiliar.',
    'WINDIR': 'Retorna a pasta do Windows.',
    'SYSTEMROOT': 'Retorna o diretório raiz do sistema operacional.',
    'SYSTEMDRIVE': 'Retorna a unidade onde o Windows está instalado.',
}


const terminal_shell_variables = {
    'OneDrive': 'Retorna pasta sincronizada do OneDrive.',
    'OneDriveConsumer': 'Retorna pasta pessoal do OneDrive.',
    'OneDriveCommercial': 'Retorna pasta corporativa do OneDrive.',
    'ChocolateyInstall': 'Diretório de instalação do Chocolatey.',
    'JAVA_HOME': 'Diretório de instalação do Java.',
    'PYTHONHOME': 'Diretório principal do Python.',
    'NODE_PATH': 'Caminhos globais usados pelo Node.js.',
}

// para exportar

module.exports = {
    ...diretorios_variables,
    ...terminal_shell_variables
};