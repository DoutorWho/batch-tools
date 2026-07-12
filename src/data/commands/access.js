/**
 * GERENCIAMENTO DE DADOS E SEGURANÇA
 *
 * Pesquisa, localização e análise de arquivos,
 * textos e programas.
 *
 * Comparação, extração e manipulação
 * de conteúdos compactados.
 *
 * Controle de permissões, certificados,
 * criptografia e execução privilegiada.
 */

const search_commands = {
      'find': {
            type: 'Pesquisa',
            description: 'Procura texto dentro de arquivos.\nSintaxe: `find "texto" arquivo`',
            dependencies: {
                '/i': 'Ignora diferença entre maiúsculas e minúsculas.',
                '/v': 'Exibe linhas que NÃO contém o texto.',
                '/c': 'Conta o número de linhas encontradas.'
            }
        },

        'findstr': {
            type: 'Pesquisa',
            description: 'Pesquisa avançada de strings usando expressões.\nSintaxe: `findstr [opções] texto arquivo`',
            dependencies: {
                '/i': 'Ignora maiúsculas/minúsculas.',
                '/r': 'Usa expressões regulares.',
                '/s': 'Pesquisa em subpastas.',
                '/n': 'Mostra número das linhas.',
                '/v': 'Mostra apenas as linhas que NÃO contêm o texto pesquisado (inverte a busca).',
                '/c:TEXTO': 'Procura pelo texto especificado como uma string literal exata (permite espaços).',
                '/g:ARQUIVO': 'Obtém os termos de busca a partir do arquivo de texto especificado (um termo por linha).',
                '/f:ARQUIVO': 'Obtém a lista de arquivos que serão vasculhados a partir do arquivo especificado.',
                '/b': 'Coincide o padrão se ele estiver exatamente no início da linha.',
                '/e': 'Coincide o padrão se ele estiver exatamente no final da linha.',
                '/l': 'Trata as strings de busca literalmente (desativa expressões regulares globais).',
                '/x': 'Mostra apenas as linhas que coincidem exatamente com o texto inteiro.',
                '/m': 'Mostra apenas o nome do arquivo se ele contiver pelo menos uma ocorrência.',
                '/o': 'Mostra o deslocamento (offset) em caracteres antes de cada linha localizada.',
                '/p': 'Ignora arquivos que contêm caracteres não imprimíveis (pula arquivos binários).'
            }
        },

          'where': {
            type: 'Pesquisa',
            description: 'Localiza arquivos executáveis.\nSintaxe: `where programa`',
            dependencies: {
                '/r': 'Pesquisa recursiva.',
                '/q': 'Modo silencioso (Quiet). Não exibe nada na tela, apenas retorna o código de status (útil em testes de `if errorlevel`).',
                '/f': 'Exibe o nome do arquivo localizado entre aspas duplas (garante compatibilidade com caminhos que têm espaços).',
                '/t': 'Exibe o tamanho do arquivo (em bytes), a data e a hora da última modificação junto com o caminho.',
                '/?': 'Exibe a ajuda detalhada do comando diretamente no prompt.'
            }
        },

    'fc': {
        type: 'Comparação',
        description: 'Compara arquivos ou conjuntos de arquivos.\nSintaxe: `fc arquivo1 arquivo2`',
        dependencies: {
            '/b': 'Comparação binária.',
            '/c': 'Ignora maiúsculas/minúsculas.',
            '/n': 'Mostra números de linha.'
        }
    },
    'sort': {
        type: 'Processamento',
        description: 'Ordena linhas de texto.\nSintaxe: `sort`',
        dependencies: {
            '/r': 'Ordena em ordem reversa.'
        }
    },
    'expand': {
        type: 'Compactação',
        description: 'Extrai arquivos compactados CAB.\nSintaxe: `expand origem destino`',
        dependencies: {

            '-f:': {
                description: 'Extrai arquivos específicos.',
                '*': 'Extrai todos os arquivos.',
                '*.dll': 'Extrai DLLs.'
            },

            '-r': 'Renomeia arquivos compactados automaticamente.',
            '-d': 'Lista conteúdo do CAB sem extrair.'
        }
    },

    'extract': {
        type: 'Compactação',
        description: 'Extrai arquivos de pacotes CAB.\nSintaxe: `extract [opções] arquivo`',
        dependencies: {
            '/a': {
                description: 'Processa múltiplos CABs sequenciais.',
                'cab2.cab': 'Continua extração.'
            },

            '/e': {
                description: 'Extrai todos os arquivos.',
                '/l': 'Define diretório destino.'
            },

            '/y': 'Suprime confirmação de sobrescrita.'
        }
    },
}

const security_commands = {
    'cacls': {
        type: 'Segurança',
        description: 'Exibe ou modifica permissões ACL de arquivos.\nSintaxe: `cacls arquivo [opções]`',
        dependencies: {

            '/e': {
                description: 'Edita ACL existente sem substituir completamente.',
                '/g': 'Permite combinar concessão de permissões.'
            },

            '/g': {
                description: 'Concede permissões a um usuário.',
                'usuario:f': 'Controle total.',
                'usuario:r': 'Somente leitura.',
                'usuario:c': 'Alteração.'
            },

            '/r': {
                description: 'Revoga permissões de usuários.',
                'usuario': 'Usuário removido da ACL.'
            },

            '/p': {
                description: 'Substitui permissões existentes.',
                'usuario:n': 'Nenhuma permissão.',
                'usuario:f': 'Controle total.'
            }
        }
    },
    'icacls': {
        type: 'Segurança',
        description: 'Gerencia permissões NTFS modernas.\nSintaxe: `icacls arquivo [opções]`',
        dependencies: {

            '/grant': {
                description: 'Concede permissões.',
                'usuario:F': 'Controle total.',
                'usuario:M': 'Modificar.',
                'usuario:R': 'Somente leitura.'
            },

            '/deny': {
                description: 'Nega permissões explicitamente.',
                'usuario:W': 'Bloqueia escrita.'
            },

            '/remove': {
                description: 'Remove entradas ACL específicas.',
                'usuario': 'Remove usuário da ACL.'
            },

            '/inheritance': {
                description: 'Controla herança de permissões.',
                ':e': 'Habilita herança.',
                ':d': 'Desabilita e copia ACL.',
                ':r': 'Remove ACL herdada.'
            },

            '/t': 'Processa subdiretórios recursivamente.',
            '/c': 'Continua mesmo se ocorrerem erros.'
        }
    },
    'cipher': {
        type: 'Segurança',
        description: 'Gerencia criptografia EFS em volumes NTFS.\nSintaxe: `cipher [opções]`',
        dependencies: {

            '/e': {
                description: 'Criptografa arquivos.',
                '/s': 'Processa subpastas.'
            },

            '/d': {
                description: 'Remove criptografia.',
                '/a': 'Inclui arquivos ocultos.'
            },

            '/w': {
                description: 'Apaga espaço livre com segurança.',
                'c:': 'Executa limpeza segura na unidade C.'
            },

            '/k': 'Cria novo certificado EFS.',
            '/x': 'Exporta certificado EFS.'
        }
    },
    'certutil': {
        type: 'Segurança',
        description: 'Ferramenta avançada de certificados e criptografia.\nSintaxe: `certutil [opções]`',
        dependencies: {

            '-hashfile': {
                description: 'Calcula hash de arquivo.',
                'md5': 'Hash MD5.',
                'sha1': 'Hash SHA1.',
                'sha256': 'Hash SHA256.'
            },

            '-encode': {
                description: 'Codifica arquivo.',
                'entrada saída': 'Converte para Base64.'
            },

            '-decode': {
                description: 'Decodifica Base64.',
                'entrada saída': 'Restaura arquivo original.'
            },

            '-store': 'Lista certificados do repositório.',
            '-verify': 'Verifica certificado.'
        }
    },
    'runas': {
        type: 'Segurança',
        description: 'Executa programas usando outra conta.\nSintaxe: `runas /user:usuario comando`',
        dependencies: {

            '/user': {
                description: 'Define usuário.',
                'admin': 'Conta administrador.',
                'dominio\\usuario': 'Conta de domínio.'
            },

            '/savecred': {
                description: 'Salva credenciais.',
                '/noprofile': 'Executa sem carregar perfil.'
            },

            '/netonly': 'Usa credenciais apenas na rede.',
            '/env': 'Mantém ambiente atual.'
        }
    },
}

// colocando os dados

module.exports = {
    ...security_commands,
    ...search_commands,
};