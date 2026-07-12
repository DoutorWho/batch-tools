/**
 * ARMAZENAMENTO E SISTEMA DE ARQUIVOS
 *
 * Reúne comandos responsáveis pelo gerenciamento de dispositivos
 * de armazenamento, volumes, sistemas de arquivos e manutenção
 * de discos no Windows.
 *
 * Inclui operações como verificação de integridade, formatação,
 * compressão, conversão de sistemas de arquivos, criação de
 * unidades virtuais, gerenciamento de volumes e recuperação
 * de dados.
 */

const storage_commands = {
    'chkdsk': {
        type: 'Manutenção de Disco',
        description: 'Verifica o sistema de arquivos de um volume em busca de erros lógicos.\nSintaxe: `chkdsk [volume:] [/f] [/r]`',
        dependencies: {
            '/f': 'Corrige erros lógicos detectados na estrutura do disco do sistema.',
            '/r': 'Localiza setores defeituosos (bad sectors) e tenta recuperar dados legíveis.',
            '/x': 'Força o volume a se desmontar antes da verificação começar, liberando travas.'
        }
    },

    'format': {
        type: 'Manutenção de Disco',
        description: 'Formata um volume para aceitar o sistema de arquivos do Windows.\nSintaxe: `format volume [/q] [/fs:sistema]`',
        dependencies: {

            '/fs:': {
                description: 'Define o formato do sistema de arquivos.',
                'ntfs': 'Sistema de arquivos NTFS.',
                'fat32': 'Sistema compatível com dispositivos antigos.',
                'exfat': 'Sistema ideal para pendrives e HDs externos.'
            },

            '/v:': {
                description: 'Define o rótulo do volume.',
                'NOME': 'Nome personalizado do disco.'
            },

            '/q': 'Executa uma formatação rápida. Apaga a tabela do volume sem varrer setores.'
        }
    },

    'label': {
        type: 'Gerenciamento de Disco',
        description: 'Cria, altera ou remove o rótulo de identificação de um volume.\nSintaxe: `label [unidade:] [nome]`',
        dependencies: {
            'c:': 'Altera o rótulo da unidade C.',
            'backup': 'Exemplo de nome personalizado de volume.'
        }
    },

    'vol': {
        type: 'Informação',
        description: 'Exibe o rótulo e o número serial de um volume.\nSintaxe: `vol [unidade:]`',
        dependencies: {
            'c:': 'Exibe informações do volume C.',
            'd:': 'Exibe informações do volume D.'
        }
    },

    'compact': {
        type: 'Gerenciamento de Disco',
        description: 'Gerencia compressão NTFS.\nSintaxe: `compact [opções]`',
        dependencies: {

            '/c': {
                description: 'Compacta arquivos.',
                '/s': 'Inclui subdiretórios.'
            },

            '/u': {
                description: 'Descompacta arquivos.',
                '/i': 'Continua mesmo com erros.'
            },

            '/a': 'Exibe arquivos ocultos.',
            '/f': 'Força compressão.'
        }
    },

    'convert': {
        type: 'Sistema de Arquivos',
        description: 'Converte FAT/FAT32 para NTFS.\nSintaxe: `convert unidade: /fs:ntfs`',
        dependencies: {

            '/fs:ntfs': {
                description: 'Define NTFS como sistema alvo.',
                'ntfs': 'Formato NTFS.'
            },

            '/v': 'Modo detalhado.',
            '/nosecurity': 'Define permissões abertas após conversão.',
            '/x': 'Força desmontagem do volume.'
        }
    },

    'fsutil': {
        type: 'Sistema de Arquivos',
        description: 'Executa tarefas avançadas de sistema de arquivos.\nSintaxe: `fsutil comando`',
        dependencies: {

            'file': {
                description: 'Gerencia arquivos.',
                'createnew': 'Cria arquivo vazio.',
                'setshortname': 'Define nome curto.'
            },

            'volume': {
                description: 'Gerencia volumes.',
                'diskfree': 'Mostra espaço livre.',
                'querycluster': 'Consulta cluster.'
            },

            'dirty': {
                description: 'Manipula estado dirty.',
                'query': 'Consulta estado.',
                'set': 'Marca volume.'
            },

            'behavior': {
                description: 'Configura comportamento NTFS.',
                'querydisabledeletenotify': 'Consulta TRIM SSD.'
            }
        }
    },

    'subst': {
        type: 'Sistema',
        description: 'Cria unidades virtuais apontando para diretórios.\nSintaxe: `subst unidade: caminho`',
        dependencies: {

            '/d': {
                description: 'Remove unidade virtual.',
                'x:': 'Remove drive virtual X.'
            },

            'x:': {
                description: 'Exemplo de unidade virtual.',
                'c:\\projetos': 'Diretório associado.'
            }
        }
    },

    'recover': {
        type: 'Recuperação',
        description: 'Tenta recuperar dados legíveis de setores defeituosos.\nSintaxe: `recover arquivo`',
        dependencies: {
            'c:\\arquivo.txt': 'Exemplo de arquivo alvo.',
            'd:\\dados.bin': 'Outro exemplo de recuperação.'
        }
    },

    'attrib': {
        type: 'Gerenciamento de Arquivos',
        description: 'Exibe ou altera atributos de arquivos.\nSintaxe: `attrib [+r|-r] arquivo`',
        dependencies: {
            '+r': 'Define arquivo como somente leitura.',
            '-r': 'Remove atributo somente leitura.',
            '+h': 'Define arquivo como oculto.',
            '-h': 'Remove atributo oculto.',
            '+s': 'Define atributo de sistema.',
            '-s': 'Remove atributo de sistema.'
        }
    },

    'mklink': {
        type: 'Gerenciamento de Arquivos',
        description: 'Cria links simbólicos e junções NTFS.\nSintaxe: `mklink [opções] link alvo`',
        dependencies: {

            '/d': {
                description: 'Cria link simbólico para diretório.',
                'link pasta': 'Exemplo de diretório.'
            },

            '/h': {
                description: 'Cria hard link.',
                'arquivo': 'Link físico para arquivo.'
            },

            '/j': {
                description: 'Cria junção NTFS.',
                'pasta': 'Junção entre diretórios.'
            }
        }
    },
}

// colocando os dados

module.exports = {
    ...storage_commands,
};