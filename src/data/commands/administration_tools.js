/**
 * GERENCIAMENTO E ADMINISTRAÇÃO
 * 
 * Reúne ferramentas administrativas avançadas do Windows,
 * utilizadas para gerenciar computadores, usuários,
 * políticas de grupo, registro do sistema, tarefas,
 * administração remota, monitoramento e serviços
 * corporativos da infraestrutura Windows.
 *
 * Inclui comandos voltados principalmente para
 * administradores de sistemas e ambientes Active Directory.
 */

const administration_tools_commands = {
        'gpupdate': {
        type: 'Administração',
        description: 'Atualiza políticas de grupo do Windows.\nSintaxe: `gpupdate [opções]`',
        dependencies: {

            '/force': {
                description: 'Reaplica todas as políticas.',
                '/wait': 'Pode aguardar conclusão.'
            },

            '/target': {
                description: 'Define alvo.',
                'user': 'Atualiza políticas do usuário.',
                'computer': 'Atualiza políticas da máquina.'
            },

            '/wait': {
                description: 'Define tempo de espera.',
                '0': 'Não espera.',
                '-1': 'Espera indefinidamente.'
            },

            '/logoff': 'Faz logoff automático se necessário.',
            '/boot': 'Reinicia automaticamente se necessário.'
        }
    },

    'gpresult': {
        type: 'Administração',
        description: 'Exibe políticas de grupo aplicadas.\nSintaxe: `gpresult [opções]`',
        dependencies: {

            '/r': {
                description: 'Resumo das políticas.',
                '/scope user': 'Escopo usuário.'
            },

            '/h': {
                description: 'Exporta relatório HTML.',
                'resultado.html': 'Arquivo de saída.'
            },

            '/scope': {
                description: 'Define escopo.',
                'user': 'Políticas do usuário.',
                'computer': 'Políticas do computador.'
            },

            '/z': 'Modo extremamente detalhado.',
            '/v': 'Modo detalhado.'
        }
    },

    
    'schtasks': {
        type: 'Agendamento',
        description: 'Gerencia tarefas agendadas.\nSintaxe: `schtasks comando`',
        dependencies: {
            '/create': 'Cria tarefa.',
            '/delete': 'Remove tarefa.',
            '/query': 'Lista tarefas.',
            '/run': 'Executa tarefa.'
        }
    },

    'reg': {
        type: 'Registro do Windows',
        description: 'Manipula o Registro do Windows.\nSintaxe: `reg comando`',
        dependencies: {
            'query': 'Consulta valores.',
            'add': 'Adiciona chaves.',
            'delete': 'Remove chaves.',
            'export': 'Exporta registro.'
        }
    },

    'netdom': {
        type: 'Domínio',
        description: 'Gerencia computadores e domínios Active Directory.\nSintaxe: `netdom comando`',
        dependencies: {

            'join': {
                description: 'Adiciona computador ao domínio.',
                '/domain': 'Define domínio.',
                '/userd': 'Usuário do domínio.',
                '/passwordd': 'Senha.'
            },

            'remove': {
                description: 'Remove computador do domínio.',
                '/force': 'Força remoção.'
            },

            'renamecomputer': 'Renomeia computador remotamente.',
            'resetpwd': 'Redefine senha da conta máquina.'
        }
    },

        'winrm': {
        type: 'Administração Remota',
        description: 'Gerencia Windows Remote Management.\nSintaxe: `winrm comando`',
        dependencies: {

            'quickconfig': {
                description: 'Configuração rápida.',
                '-quiet': 'Modo silencioso.'
            },

            'enumerate': {
                description: 'Lista recursos.',
                'winrm/config/listener': 'Lista listeners.'
            },

            'get': 'Obtém configuração.',
            'set': 'Define configuração.',
            'invoke': 'Executa método remoto.'
        }
    },

    'winrs': {
        type: 'Administração Remota',
        description: 'Executa comandos remotamente via WinRM.\nSintaxe: `winrs comando`',
        dependencies: {

            '-r:': {
                description: 'Define host remoto.',
                'SERVIDOR01': 'Servidor remoto.'
            },

            '-u:': {
                description: 'Define usuário.',
                'admin': 'Usuário remoto.'
            },

            '-p:': {
                description: 'Define senha.',
                '123456': 'Exemplo.'
            },

            'cmd': 'Executa CMD remoto.',
            'powershell': 'Executa PowerShell remoto.'
        }
    },

    'logman': {
        type: 'Monitoramento',
        description: 'Gerencia logs e coletores de desempenho.\nSintaxe: `logman comando`',
        dependencies: {

            'create': {
                description: 'Cria coletor.',
                'counter': 'Coletor de contadores.',
                'trace': 'Coletor de rastreamento.'
            },

            'start': {
                description: 'Inicia coleta.',
                'nome': 'Nome do coletor.'
            },

            'stop': {
                description: 'Interrompe coleta.',
                '-ets': 'Sessão em tempo real.'
            },

            'delete': 'Remove coletor.',
            'query': 'Lista coletores.'
        }
    },

    'bitsadmin': {
        type: 'Transferência',
        description: 'Gerencia transferências BITS.\nSintaxe: `bitsadmin comando`',
        dependencies: {

            '/transfer': {
                description: 'Cria transferência imediata.',
                '/download': 'Modo download.',
                '/upload': 'Modo upload.'
            },

            '/monitor': {
                description: 'Monitora jobs ativos.',
                'job': 'Nome do job.'
            },

            '/list': 'Lista jobs existentes.',
            '/reset': 'Remove todos os jobs.'
        }
    },

    'driverquery': {
        type: 'Diagnóstico',
        description: 'Lista drivers instalados no sistema.\nSintaxe: `driverquery [opções]`',
        dependencies: {

            '/v': {
                description: 'Modo detalhado.',
                '/fo csv': 'Pode ser combinado com CSV.'
            },

            '/fo': {
                description: 'Formato da saída.',
                'table': 'Tabela.',
                'list': 'Lista.',
                'csv': 'Formato CSV.'
            },

            '/si': {
                description: 'Exibe assinaturas digitais.',
                'signed': 'Drivers assinados.'
            }
        }
    },
    'sc': {
        type: 'Gerenciamento de Sistema',
        description: 'Comunicação com o Controlador de Serviços e drivers.\nSintaxe: `sc [comando] [nome_do_serviço]`',
        dependencies: {
            'query': {
                description: 'Obtém e exibe o status de serviços ativos ou configurados.',
                'type=': {
                    description: 'Filtra pelo tipo de serviço a ser listado.',
                    'service': 'Lista apenas serviços padrão do Windows.',
                    'driver': 'Lista apenas drivers de dispositivo.',
                    'all': 'Lista tanto serviços quanto drivers.'
                },
                'state=': {
                    description: 'Filtra pelo estado atual do serviço.',
                    'active': 'Lista apenas serviços que estão executando (padrão).',
                    'inactive': 'Lista apenas serviços que estão parados.',
                    'all': 'Lista todos os serviços, independentemente do status.'
                }
            },

            'config': {
                description: 'Modifica a configuração de um serviço no registro.',
                'start=': 'Altera o tipo de inicialização (Ex: `start= auto`, `start= demand`, `start= disabled`).',
                'binpath=': 'Altera o caminho do executável do serviço.',
                'displayname=': 'Altera o nome de exibição do serviço.'
            },

            'start': 'Inicia um serviço que está parado.',
            'stop': 'Envia uma estrutura de controle STOP para parar um serviço.',
            'pause': 'Envia uma estrutura de controle PAUSE para pausar um serviço.',
            'continue': 'Retoma um serviço que foi pausado.',
            'delete': 'Exclui um serviço do registro (remove do sistema).'
        }
    },
    
}

// colocando os dados

module.exports = {
    ...administration_tools_commands,
};