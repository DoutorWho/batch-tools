// variáveis de sistema listadas
const variaveis_de_sistemas = {

    // =========================================
    // DATA / HORA
    // =========================================

    'DATE': 'Retorna a data atual do sistema.',
    'TIME': 'Retorna a hora atual do sistema.',

    '__DATE__': 'Versão interna expandida da data atual do CMD.',
    '__TIME__': 'Versão interna expandida da hora atual do CMD.',

    // =========================================
    // USUÁRIO / SESSÃO
    // =========================================

    'USERNAME': 'Retorna o nome do usuário logado no momento.',
    'USERDOMAIN': 'Retorna o domínio do usuário atual.',
    'USERPROFILE': 'Retorna o caminho completo da pasta do usuário atual.',
    'LOGONSERVER': 'Retorna o servidor responsável pelo logon do usuário.',
    'SESSIONNAME': 'Retorna o nome da sessão atual do Terminal Services.',
    'COMPUTERNAME': 'Retorna o nome do computador.',

    // =========================================
    // DIRETÓRIOS / CAMINHOS
    // =========================================

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

    // =========================================
    // CMD / PROCESSAMENTO
    // =========================================

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

    // =========================================
    // PROCESSADOR / HARDWARE
    // =========================================

    'PROCESSOR_ARCHITECTURE': 'Retorna a arquitetura do processador.',
    'PROCESSOR_IDENTIFIER': 'Retorna identificação detalhada da CPU.',
    'PROCESSOR_LEVEL': 'Retorna o nível/modelo do processador.',
    'PROCESSOR_REVISION': 'Retorna a revisão do processador.',
    'NUMBER_OF_PROCESSORS': 'Retorna quantidade de núcleos/processadores lógicos.',

    // =========================================
    // REDE
    // =========================================

    'COMSPEC': 'Retorna o caminho completo do interpretador CMD.',
    'ALLUSERSPROFILE': 'Retorna perfil compartilhado entre usuários.',
    'CLIENTNAME': 'Retorna nome do cliente remoto conectado via RDP.',
    'CLIENTNAME': 'Retorna nome da máquina cliente em sessão remota.',

    // =========================================
    // POWERSHELL / TERMINAL
    // =========================================

    'PSMODULEPATH': 'Lista caminhos de módulos do PowerShell.',
    'WT_SESSION': 'Identificador da sessão do Windows Terminal.',
    'TERM': 'Define tipo de terminal atual.',
    'TERM_PROGRAM': 'Identifica o programa terminal em uso.',

    // =========================================
    // WINDOWS / SISTEMA
    // =========================================

    'OS': 'Retorna o nome do sistema operacional.',
    'NUMBER_OF_PROCESSORS': 'Quantidade de processadores lógicos disponíveis.',
    'ARCHITEW6432': 'Indica execução WOW64 em sistema 64 bits.',
    'SESSIONNAME': 'Nome da sessão atual do Windows.',
    

    // =========================================
    // WINDOWS TERMINAL / SHELL
    // =========================================

    'OneDrive': 'Retorna pasta sincronizada do OneDrive.',
    'OneDriveConsumer': 'Retorna pasta pessoal do OneDrive.',
    'OneDriveCommercial': 'Retorna pasta corporativa do OneDrive.',
    'ChocolateyInstall': 'Diretório de instalação do Chocolatey.',
    'JAVA_HOME': 'Diretório de instalação do Java.',
    'PYTHONHOME': 'Diretório principal do Python.',
    'NODE_PATH': 'Caminhos globais usados pelo Node.js.',

    // =========================================
    // VARIÁVEIS DINÂMICAS AVANÇADAS
    // =========================================

    'ERRORLEVEL': 'Código de retorno do último comando executado.',
    'CMDEXTVERSION': 'Versão atual das extensões do CMD.',
    'HIGHESTNUMANODENUMBER': 'Maior nó NUMA disponível no sistema.',
};

module.exports = {
    variaveis_de_sistemas,
};