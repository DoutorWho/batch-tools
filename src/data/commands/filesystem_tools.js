/**
 * SISTEMA OPERACIONAL
 *
 * Biblioteca de comandos relacionados à administração,
 * configuração e gerenciamento do ambiente Windows.
 *
 * Reúne comandos nativos do CMD e ferramentas integradas
 * ao sistema operacional para consulta de informações,
 * controle de processos, execução de programas, serviços,
 * manutenção, reparo e configuração de componentes internos.
 *
 * Inclui recursos relacionados ao Prompt de Comando (CMD),
 * PowerShell, gerenciamento de tarefas, integridade do sistema,
 * inicialização de componentes e ajustes do ambiente Windows.
 *
 * Categorias presentes:
 * • Execução de programas e comandos
 * • Gerenciamento de processos e tarefas
 * • Informações do sistema e usuário
 * • Configuração do ambiente Windows
 * • Administração de serviços e componentes
 * • Manutenção e reparo do sistema
 * • Controle de desligamento e inicialização
 * • Gerenciamento de codificação e console
 */



const filesystem_commands = {
    'dir': {
        type: 'Informação',
        description: 'Exibe a lista de arquivos e subpastas de um diretório.\nSintaxe: `dir [caminho] [opções]`',
        dependencies: {

            '/a': {
                description: 'Exibe arquivos conforme atributos específicos.',
                'd': 'Mostra apenas diretórios.',
                'h': 'Mostra arquivos ocultos.',
                's': 'Mostra arquivos de sistema.',
                'r': 'Mostra arquivos somente leitura.',
                'a': 'Mostra arquivos prontos para arquivamento.',
                '-h': 'Oculta arquivos ocultos da listagem.'
            },

            '/o': {
                description: 'Controla a ordenação da listagem.',
                'n': 'Ordena por nome.',
                'e': 'Ordena por extensão.',
                's': 'Ordena por tamanho.',
                'd': 'Ordena por data.',
                'g': 'Agrupa diretórios primeiro.',
                '-n': 'Inverte a ordem da classificação.'
            },

            '/b': 'Formato básico (bare format) - exibe apenas os nomes limpos, sem resumos.',
            '/s': 'Lista os arquivos encontrados no diretório atual e dentro de todas as suas subpastas.',
            '/p': 'Faz uma pausa na tela a cada bloco cheio de informações listadas.',
            '/w': 'Exibe a listagem no formato amplo, organizando os nomes em colunas laterais.',
            '/q': 'Mostra a informação de quem é o proprietário (dono) do arquivo na rede NTFS.',
            '/r': 'Exibe os fluxos de dados alternativos (ADS) ocultos nos arquivos.'
        }
    },
    'tree': {
        type: 'Informação',
        description: 'Exibe graficamente a estrutura de diretórios.\nSintaxe: `tree [caminho]`',
        dependencies: {
            '/f': 'Exibe também os arquivos.',
            '/a': 'Usa caracteres ASCII simples.'
        }
    },
    'mkdir': {
        type: 'Gerenciamento de Arquivos',
        description: 'Cria um ou mais diretórios (pastas).\nSintaxe: `mkdir [unidade:]caminho`',
        dependencies: {
            '/p': 'Cria toda a árvore de diretórios pai automaticamente caso não existam.'
        }
    },
    'rmdir': {
        type: 'Gerenciamento de Arquivos',
        description: 'Remove (deleta) um diretório.\nSintaxe: `rmdir [/s] [/q] [unidade:]caminho`',
        dependencies: {
            '/s': 'Remove a pasta especificada e todos os arquivos/subpastas dentro dela.',
            '/q': 'Modo silencioso. Não pede confirmação [S/N] antes de apagar a árvore de pastas.',
            '@diretorios': {
                target: 'folder',
                description: 'Sugere somente diretórios.'
            }
        }
    },
    'del': {
        type: 'Gerenciamento de Arquivos',
        description: 'Apaga um ou mais arquivos do disco.\nSintaxe: `del [/f] [/s] [/q] nomes_dos_arquivos`',
        dependencies: {
            '/f': 'Força a exclusão de arquivos configurados com atributo de "Apenas Leitura".',
            '/s': 'Exclui os arquivos correspondentes em todas as subpastas recursivamente.',
            '/q': 'Modo silencioso. Suprime o aviso de confirmação global para caracteres curinga.',
            '@arquivos': {
                target: 'file',
                description: 'Sugere somente arquivos.'
            }
        }
    },
    'erase': {
        type: 'Gerenciamento de Arquivos',
        description: 'Apaga um ou mais arquivos do disco (idêntico ao comando del).\nSintaxe: `erase [/f] [/s] [/q] nomes_dos_arquivos`',
        dependencies: {
            '/f': 'Força a exclusão de arquivos configurados com atributo de "Apenas Leitura".',
            '/s': 'Exclui os arquivos correspondentes em todas as subpastas recursivamente.',
            '/q': 'Modo silencioso. Suprime o aviso de confirmação global para caracteres curinga.'
        }
    },
    'copy': {
        type: 'Gerenciamento de Arquivos',
        description: 'Copia um ou mais arquivos de uma origem para um destino.\nSintaxe: `copy [/y] [/v] origem destino`',
        dependencies: {
            '/y': 'Sobrescreve um arquivo existente sem pedir confirmação do usuário.',
            '/v': 'Verifica se os novos arquivos foram gravados corretamente no disco após a cópia.'
        }
    },
    'move': {
        type: 'Gerenciamento de Arquivos',
        description: 'Move arquivos ou renomeia diretórios inteiros.\nSintaxe: `move [/y] origem destino`',
        dependencies: {
            '/y': 'Substitui arquivos existentes no destino sem exibir caixas de aviso.'
        }
    },
    'xcopy': {
        type: 'Gerenciamento Avançado',
        description: 'Utilitário avançado para cópia de arquivos e árvores de diretórios.\nSintaxe: `xcopy origem [destino] [opções]`',
        dependencies: {
            '/s': 'Copia pastas e subpastas do alvo, ignorando as que estiverem totalmente vazias.',
            '/e': 'Copia todas as subpastas do alvo, incluindo as pastas vazias.',
            '/h': 'Copia arquivos ocultos e arquivos protegidos do sistema operacional.',
            '/y': 'Suprime solicitações para confirmar a substituição de arquivos existentes.',
            '/i': 'Se o destino não existir, assume que o destino se trata de um novo diretório.',
            '/c': 'Continua o processo de cópia mesmo que ocorram erros de leitura.',
            '/q': 'Modo silencioso. Não exibe os nomes dos arquivos na tela enquanto estão sendo copiados.'
        }
    },
    'robocopy': {
        type: 'Gerenciamento Avançado',
        description: 'Cópia Robustecida de Arquivos. Excelente para backups e grandes volumes.\nSintaxe: `robocopy origem destino [arquivos] [opções]`',
        dependencies: {

            '/copyall': {
                description: 'Copia todas as propriedades NTFS do arquivo.',
                'd': 'Copia dados do arquivo.',
                'a': 'Copia atributos.',
                't': 'Copia timestamps/datas.',
                's': 'Copia permissões NTFS.',
                'o': 'Copia informações do proprietário.',
                'u': 'Copia informações de auditoria.'
            },

            '/r:': {
                description: 'Define o número máximo de tentativas em caso de erro.',
                '0': 'Não tenta novamente.',
                '1': 'Realiza apenas uma nova tentativa.',
                '1000000': 'Valor padrão do Robocopy.'
            },

            '/w:': {
                description: 'Define o tempo de espera entre tentativas.',
                '0': 'Sem espera.',
                '5': 'Espera 5 segundos.',
                '30': 'Espera 30 segundos.'
            },

            '/mt': {
                description: 'Habilita processamento multithread.',
                '1': 'Executa usando 1 thread.',
                '8': 'Valor padrão do Robocopy.',
                '128': 'Máximo de threads suportadas.'
            },

            '/mir': 'Espelha uma árvore de diretórios completa (apaga no destino o que sumiu na origem).',
            '/e': 'Copia subdiretórios inteiros, incluindo os que estiverem vazios.',
            '/z': 'Copia arquivos no modo reiniciável (sobrevive a quedas de rede sem corromper).'
        }
    },
    'ren': {
        type: 'Gerenciamento de Arquivos',
        description: 'Renomeia arquivos ou diretórios.\nSintaxe: `ren antigo novo`'
    },
    'replace': {
        type: 'Gerenciamento de Arquivos',
        description: 'Substitui arquivos em diretórios.\nSintaxe: `replace origem destino`',
        dependencies: {

            '/a': {
                description: 'Adiciona novos arquivos.',
                '/s': 'Permite uso recursivo.'
            },

            '/u': {
                description: 'Atualiza somente arquivos antigos.',
                '/w': 'Solicita confirmação.'
            },

            '/p': 'Solicita confirmação antes de substituir.',
            '/r': 'Substitui arquivos somente leitura.'
        }
    },
    'type': {
        description: 'Exibe o conteúdo de um ou mais arquivos de texto na tela do console.\nSintaxe: `type [unidade:][caminho]nome_do_arquivo`',
        dependencies: {
            'nul': 'Limpa ou oculta a saída de dados enviando para o dispositivo nulo (Ex: `comando > nul`).',
            'con': 'Faz a leitura a partir do próprio console ou teclado do usuário.'
        }
    }
};

const nevegation_commands = {
    'cd': {
        type: 'Navegação',
        description: 'Exibe o nome do diretório atual ou altera a pasta de trabalho.\nSintaxe: `cd [/d] [caminho]`',
        dependencies: {
            '/d': 'Altera simultaneamente a unidade de disco (Drive) e a pasta de destino atual.',
            '@diretorios': {
                target: 'folder',
                description: 'Sugere somente diretórios.'
            }
        }
    },
    'pushd': {
        type: 'Navegação',
        description: 'Salva o diretório atual e muda para outro.\nSintaxe: `pushd caminho`',
        dependencies: {
            '@diretorios': {
                target: 'folder',
                description: 'Sugere somente diretórios.'
            }
        }
    },
    'popd': {
        type: 'Navegação',
        description: 'Retorna ao diretório salvo anteriormente via pushd.'
    }
};

const system_commands = {
    'start': {
        type: 'Execução',
        description: 'Inicia um programa, comando ou abre uma nova janela.\nSintaxe: `start [opções] programa`',
        dependencies: {
            '/min': 'Inicia a janela minimizada.',
            '/max': 'Inicia a janela maximizada.',
            '/wait': 'Espera o programa terminar antes de continuar.',
            '/b': 'Executa sem abrir nova janela.'
        }
    },
    'tasklist': {
        type: 'Gerenciamento de Sistema',
        description: 'Lista processos em execução.\nSintaxe: `tasklist`',
        dependencies: {
            '/v': 'Modo detalhado (exibe usuário, uso de memória, etc).',
            '/svc': 'Mostra os serviços associados a cada processo.',
            
            '/fi': {
                description: 'Aplica filtros para exibir apenas processos específicos.',
                'STATUS': 'Filtra por estado (Ex: `tasklist /fi "STATUS eq RUNNING"`).',
                'IMAGENAME': 'Filtra pelo nome do executável (Ex: `tasklist /fi "IMAGENAME eq cmd.exe"`).',
                'PID': 'Filtra pelo ID numérico do processo.'
            },

            '/fo': {
                description: 'Especifica o formato da saída.',
                'TABLE': 'Formato de tabela padrão.',
                'LIST': 'Formato de lista vertical.',
                'CSV': 'Formato delimitado por vírgulas (excelente para scripts).'
            },

            '/nh': 'Oculta o cabeçalho das colunas na saída (funciona com TABLE e CSV).',
            '/m': 'Lista os módulos DLL carregados por cada processo.'
        }
    },
    'taskkill': {
        type: 'Gerenciamento de Sistema',
        description: 'Encerra uma ou mais tarefas ou processos em execução.\nSintaxe: `taskkill [/f] [/im processo | /pid id]`',
        dependencies: {

            '/im': {
                description: 'Especifica o nome da imagem do processo.',
                '*': 'Permite uso de curingas (Ex: `taskkill /im chrome*`).'
            },

            '/pid': {
                description: 'Especifica o ID numérico do processo.',
                '/t': 'Finaliza também os processos filhos vinculados ao PID.'
            },

            '/f': 'Força o encerramento imediato do processo (mata processos travados).'
        }
    },
    'wmic': {
        type: 'Administração de Sistema',
        description: 'Interface de gerenciamento WMI via linha de comando.\nSintaxe: `wmic classe comando`',
        dependencies: {

            'process': {
                description: 'Gerencia processos.',
                'list': 'Lista processos.',
                'call terminate': 'Finaliza processo.'
            },

            'os': {
                description: 'Informações do sistema operacional.',
                'get caption': 'Nome do sistema.',
                'get version': 'Versão do Windows.'
            },

            'logicaldisk': {
                description: 'Gerencia discos.',
                'get size': 'Exibe tamanho.',
                'get freespace': 'Exibe espaço livre.'
            },

            '/format:': {
                description: 'Define formato de saída.',
                'table': 'Formato tabela.',
                'list': 'Formato lista.'
            }
        }
    },
    'shutdown': {
        type: 'Gerenciamento de Sistema',
        description: 'Permite desligar ou reiniciar computadores locais ou remotos.\nSintaxe: `shutdown [/s | /r | /l] [/t tempo]`',
        dependencies: {

            '/s': {
                description: 'Realiza o desligamento completo da máquina.',
                '/t': 'Permite definir atraso antes do desligamento.',
                '/f': 'Força fechamento de programas abertos.'
            },

            '/r': {
                description: 'Realiza o desligamento seguido da reinicialização completa do sistema.',
                '/o': 'Reinicia acessando opções avançadas de boot.',
                '/t': 'Permite definir atraso antes da reinicialização.'
            },

            '/l': 'Faz o logoff imediato da conta do usuário logado no momento.',
            '/a': 'Cancela um desligamento agendado.',
            '/hybrid': 'Executa desligamento híbrido (Fast Startup).'
        }
    },
    'sfc': {
        type: 'Manutenção de Sistema',
        description: 'Verificador de Arquivos do Sistema. Valida a integridade do Windows.\nSintaxe: `sfc [/scannow]`',
        dependencies: {
            '/scannow': 'Verifica e repara automaticamente arquivos corrompidos protegidos do sistema.'
        }
    },
    'dism': {
        type: 'Manutenção de Sistema',
        description: 'Gerenciamento e Manutenção de Imagens de Implantação do Windows.\nSintaxe: `dism /online /cleanup-image [opção]`',
        dependencies: {

            '/cleanup-image': {
                description: 'Aciona ferramentas de reparo da imagem do Windows.',
                '/checkhealth': 'Verifica rapidamente se há corrupção registrada.',
                '/scanhealth': 'Realiza análise completa da imagem.',
                '/restorehealth': 'Corrige corrupção automaticamente via Windows Update.'
            },

            '/online': 'Especifica que a operation deve ser feita na imagem do Windows atual em execução.'
        }
    },
    'whoami': {
        type: 'Informação',
        description: 'Mostra usuário atualmente autenticado.'
    },
    'tzutil': {
        type: 'Tempo',
        description: 'Gerencia fusos horários do Windows.\nSintaxe: `tzutil [opções]`',
        dependencies: {
            '/g': {
                description: 'Mostra fuso atual.',
                'E. South America Standard Time': 'Exemplo.'
            },

            '/s': {
                description: 'Define novo fuso.',
                '"UTC"': 'Define UTC.',
                '"Pacific Standard Time"': 'Fuso Pacífico.'
            },

            '/l': {
                description: 'Lista fusos disponíveis.',
                'GMT': 'Exemplo de zona.'
            }
        }
    },
    'systeminfo': {
        type: 'Informação',
        description: 'Exibe propriedades detalhadas sobre a configuração do sistema e do hardware.'
    },
    'ver': {
        type: 'Informação',
        description: 'Exibe a versão atual do Windows em execução.\nSintaxe: `ver`',
        dependencies: {
            '10.0': 'Versões modernas do Windows 10/11 utilizam kernel NT 10.0.',
            '6.1': 'Windows 7.'
        }
    },
    'assoc': {
        type: 'Sistema',
        description: 'Exibe ou modifica associações entre extensões e tipos de arquivos.\nSintaxe: `assoc [.ext]=tipo`',
        dependencies: {

            '.txt': {
                description: 'Extensão de arquivos texto.',
                'txtfile': 'Tipo associado padrão do Windows.'
            },

            '.bat': {
                description: 'Extensão de scripts Batch.',
                'batfile': 'Tipo padrão de execução Batch.'
            }
        }
    },
    'ftype': {
        type: 'Sistema',
        description: 'Define o aplicativo associado a um tipo de arquivo.\nSintaxe: `ftype tipo=comando`',
        dependencies: {

            'txtfile': {
                description: 'Tipo associado a arquivos texto.',
                'notepad.exe %1': 'Abre arquivos TXT no Bloco de Notas.'
            },

            'batfile': {
                description: 'Tipo associado a scripts Batch.',
                '"%1" %*': 'Executa o script passando parâmetros.'
            }
        }
    },
    'cmd': {
        type: 'Sistema',
        description: 'Inicia uma nova instância do Prompt de Comando.\nSintaxe: `cmd [opções]`',
        dependencies: {
            '/c': 'Executa comando e fecha.',
            '/k': 'Executa comando e permanece aberto.',
            '/q': 'Desativa echo.'
        }
    },
    'powershell': {
        type: 'Sistema',
        description: 'Executa comandos PowerShell via CMD.\nSintaxe: `powershell comando`',
        dependencies: {
            '-command': 'Executa comando PowerShell.',
            '-file': 'Executa script .ps1.',
            '-noprof': 'Inicia sem perfil.'
        }
    },
    'mode': {
        type: 'Sistema',
        description: 'Configura dispositivos e console do sistema.\nSintaxe: `mode dispositivo parâmetros`',
        dependencies: {

            'con': {
                description: 'Configura console.',
                'cols=': 'Define largura.',
                'lines=': 'Define altura.'
            },

            'com1': {
                description: 'Configura porta serial.',
                'baud=9600': 'Define baud rate.',
                'parity=n': 'Sem paridade.'
            }
        }
    },
    'doskey': {
        type: 'Interface',
        description: 'Gerencia histórico e macros do console.\nSintaxe: `doskey [macros]`',
        dependencies: {

            '/history': {
                description: 'Mostra histórico do CMD.',
                'F7': 'Acesso visual ao histórico.'
            },

            '/macros': {
                description: 'Lista macros carregadas.',
                'nome=valor': 'Define macro.'
            },

            '/reinstall': 'Reinstala editor de linha.',
            '/listsize=': 'Define tamanho do histórico.'
        }
    },
    'chcp': {
        type: 'Codificação',
        description: 'Exibe ou altera a página de código ativa (codificação de caracteres) do console.\nSintaxe: `chcp [PAGINA]`',
        dependencies: {
            '65001': {
                description: 'Define a codificação do console para o padrão universal UTF-8.',
                '> nul': 'Oculta a mensagem de confirmação automática "Active code page: 65001" no terminal.'
            },

            '850': {
                description: 'Define a codificação para o padrão antigo do Windows brasileiro (Multilingual Latin 1).',
                'original': 'Restaura o padrão do CMD caso precise rodar scripts legados que dependem dessa tabela.'
            }
        }
    }
};


// colocando os dados

module.exports = {
    ...filesystem_commands,
    ...nevegation_commands,
    ...system_commands,
};

