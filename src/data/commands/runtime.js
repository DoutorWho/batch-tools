/**
 * AMBIENTE DE EXECUÇÃO DO CONSOLE
 *
 * Reúne os comandos responsáveis pela interação do usuário
 * com o ambiente de linha de comando e pelo controle da
 * execução de scripts Batch.
 *
 * Inclui recursos de exibição de mensagens, entrada de dados,
 * configuração da interface do console, paginação de conteúdo,
 * controle do prompt, estruturas condicionais, laços de repetição,
 * chamadas de sub-rotinas, escopo de variáveis, parâmetros e
 * gerenciamento do fluxo de execução.
 *
 * Esses comandos definem o comportamento do interpretador,
 * controlando tanto a comunicação entre usuário e terminal
 * quanto a lógica necessária para construção de scripts.
 */


const console_commands = {
   '@echo': {
        type: 'Controle de Fluxo',
        description: 'Controla a exibição dos comandos na tela.\nSintaxe: `@echo [on | off]`',
        dependencies: {
            'on': 'Ativa a exibição de cada comando antes de ser executado.',
            'off': 'Desativa a ocultação de comandos (padrão em scripts limpos).'
        }
    },

    'echo': {
        type: 'Interface',
        description: 'Exibe mensagens de texto personalizadas diretamente na tela do console.\nSintaxe: `echo [mensagem]`'
    },
    
    'echo.': {
        type: 'Interface',
        description: 'Exibe uma linha em branco no console.\nSintaxe: `echo.`',
        dependencies: {
            '.': 'O ponto após `echo` força a quebra de linha vazia.'
        }
    },

    'cls': {
        type: 'Interface',
        description: 'Limpa todas as saídas de texto registradas no terminal do console.'
    },

    'color': {
        type: 'Interface',
        description: 'Altera as cores do console.\nSintaxe: `color [atributo]`',
        dependencies: {
            '0': 'Preto.',
            '1': 'Azul.',
            '2': 'Verde.',
            '4': 'Vermelho.',
            '7': 'Cinza claro.',
            'f': 'Branco brilhante.'
        }
    },

    'title': {
        type: 'Interface',
        description: 'Define o título da janela atual do CMD.\nSintaxe: `title texto`'
    },

    'prompt': {
        type: 'Interface',
        description: 'Altera o prompt do CMD.\nSintaxe: `prompt texto`',
        dependencies: {
            '$p': 'Diretório atual.',
            '$g': 'Símbolo >.',
            '$t': 'Hora atual.',
            '$d': 'Data atual.'
        }
    },

    'more': {
        type: 'Interface',
        description: 'Exibe saída paginada no console.\nSintaxe: `comando | more`'
    },

    'clip': {
        type: 'Interface',
        description: 'Envia saída diretamente para a área de transferência.\nSintaxe: `comando | clip`'
    },

    'choice': {
        type: 'Entrada de Dados',
        description: 'Solicita escolha do usuário.\nSintaxe: `choice [opções]`',
        dependencies: {
            '/c': 'Define caracteres permitidos.',
            '/n': 'Oculta opções padrão.',
            '/t': 'Define timeout automático.',
            '/d': 'Define resposta padrão.'
        }
    },

    'pause': {
        type: 'Controle de Fluxo',
        description: 'Suspende o processamento de um script e exibe a mensagem de espera por teclas.'
    },

    'date': {
        type: 'Interface',
        description: 'Exibe ou altera a data atual configurada no sistema operacional.\nSintaxe: `date [/t] [nova_data]`',
        dependencies: {

            '/t': {
                description: 'Exibe apenas a data atual sem solicitar alteração.',
                'dd/mm/aaaa': 'Formato de data mais comum em sistemas PT-BR.',
                'mm-dd-aa': 'Pode variar conforme regionalização do Windows.'
            }
        }
    },

    'time': {
        type: 'Interface',
        description: 'Exibe ou altera a hora atual do sistema.\nSintaxe: `time [/t] [nova_hora]`',
        dependencies: {

            '/t': {
                description: 'Exibe apenas a hora atual sem permitir edição.',
                'hh:mm': 'Formato de hora simples.',
                'hh:mm:ss,cc': 'Formato completo incluindo segundos e centésimos.'
            }
        }
    },

    'path': {
        type: 'Sistema',
        description: 'Define ou exibe caminhos de busca de executáveis.\nSintaxe: `path caminho`'
    },

    'set': {
        type: 'Variáveis',
        description: 'Cria, modifica ou exibe variáveis de ambiente.\nSintaxe: `set VARIAVEL=VALOR`',
        dependencies: {
            '/a': {
                description: 'Executa operações matemáticas e expressões numéricas.',
                '+': 'Operador matemático de adição.',
                '-': 'Operador matemático de subtração.',
                '*': 'Operador matemático de multiplicação.',
                '/': 'Operador matemático de divisão.',
                '%': 'Operador matemático de módulo/resto.',
                '()': 'Agrupa expressões matemáticas.'
            },

            '/p': {
                description: 'Solicita entrada de dados diretamente do usuário.',
                '=': 'Define o texto de prompt exibido ao usuário.'
            }
        }
    },
    'print': {
        type: 'Impressão',
        description: 'Envia arquivos texto diretamente para impressão.\nSintaxe: `print arquivo`',
        dependencies: {

            '/d': {
                description: 'Define impressora de destino.',
                '\\\\pc\\impressora': 'Exemplo de impressora de rede.'
            }
        }
    },
}

const flow_commands = {
    'if': {
        type: 'Estrutura Condicional',
        description: 'Executa processamentos condicionais em scripts do Windows.\nSintaxe: `if [not] condicao (comandos) else (comandos)`',
        dependencies: {

            'exist': {
                description: 'Retorna verdadeiro se o arquivo ou pasta existir.',
                'not': 'Inverte a condição caso o arquivo NÃO exista.'
            },

            'defined': {
                description: 'Retorna verdadeiro caso a variável exista.',
                'not': 'Executa caso a variável NÃO esteja definida.'
            },

            'errorlevel': {
                description: 'Testa o código de retorno do último comando.',
                '0': 'Indica sucesso.',
                '1': 'Indica erro genérico.',
                '2': 'Indica erro específico.'
            },

            'equ': 'Operador de comparação: Igual a.',
            'neq': 'Operador de comparação: Diferente de.',
            'gtr': 'Operador de comparação numérico: Maior que (Greater Than).',
            'lss': 'Operador de comparação numérico: Menor que (Less Than).',
            'geq': 'Operador de comparação numérico: Maior ou igual a.',
            'leq': 'Operador de comparação numérico: Menor ou igual a.'
        }
    },

    'else': {
        type: 'Estrutura Condicional',
        description: 'Direciona o script para um bloco alternativo caso o `if` falhe.\nSintaxe: `if condicao (bloco) else (bloco_alternativo)`',
        dependencies: {
            'exist': 'Mapeia tratamento alternativo caso um arquivo avaliado não exista.',
            'defined': 'Mapeia tratamento alternativo caso uma variável avaliada não tenha dados.',
            'errorlevel': 'Mapeia tratamento se o código de retorno não bater com o esperado.'
        }
    },

    'for': {
        type: 'Estrutura de Repetição',
        description: 'Executa um comando especificado para cada elemento contido em um grupo.\nSintaxe no Script: `for %%variavel in (conjunto) do (comandos)`',
        dependencies: {
            'in': 'Cláusula obrigatória que delimita o início do conjunto de arquivos ou dados.',
            'do': 'Cláusula obrigatória que dispara o bloco de execução para cada ciclo do loop.',
            '/l': 'Loop numérico iterativo. Passa um início, incremento e fim (Ex: `for /l %%i in (1,1,10)`).',
            '/r': 'Loop recursivo. Percorre todas as subpastas varrendo arquivos compatíveis.',
            '/d': 'Varre apenas nomes de diretórios presentes na pasta alvo, pulando arquivos.',

            '/f': {
                description: 'Processa dados. Analisa linhas de arquivos, strings de texto ou saídas de outros comandos.',
                'delims=': 'Flag de `/f`. Especifica quais caracteres quebram a linha em pedaços (tokens).',
                'tokens=': 'Flag de `/f`. Especifica quais colunas da quebra serão passadas para as variáveis.',
                'usebackq': 'Flag de `/f`. Permite ler arquivos com espaço usando aspas ou executar strings como comandos.',
                'eol=': 'Flag de `/f`. Especifica o caractere de fim de linha (ignora linhas que começam com ele, padrão: `;`).',
                'skip=': 'Flag de `/f`. Especifica o número de linhas a serem puladas (ignoradas) no início do arquivo.'
            }
        }
    },

    'goto': {
        type: 'Controle de Fluxo',
        description: 'Desvia a execução do script para uma label específica.\nSintaxe: `goto label`',
        dependencies: {
            'eof': 'Finaliza a sub-rotina atual e retorna automaticamente.'
        }
    },

    'call': {
        type: 'Controle de Fluxo',
        description: 'Chama outro arquivo Batch ou executa uma label/sub-rotina dentro do mesmo script.\nSintaxe: `call [arquivo.bat | :label]`',
        dependencies: {
            ':label': 'Executa uma sub-rotina interna do próprio script e retorna ao ponto seguinte após finalizar.',
            '%1': 'Representa o primeiro parâmetro recebido pela sub-rotina ou arquivo chamado.',
            '%2': 'Representa o segundo parâmetro recebido pela sub-rotina ou arquivo chamado.',
            '%*': 'Representa todos os parâmetros enviados para a sub-rotina ou script chamado.'
        }
    },

    'exit': {
        type: 'Controle de Fluxo',
        description: 'Sai do programa de terminal atual (CMD.EXE) ou encerra o script Batch atual.\nSintaxe: `exit [/b] [codigo_de_erro]`',
        dependencies: {
            '/b': 'Fecha apenas o script atual em execução, mantendo a janela do CMD aberta.',
            '0': 'Indica encerramento com sucesso, sem falhas de execução.',
            '1': 'Retorna um código de erro genérico ao encerrar o script.'
        }
    },

    'timeout': {
        type: 'Controle de Fluxo',
        description: 'Pausa o script por alguns segundos.\nSintaxe: `timeout /t segundos`',
        dependencies: {
            '/t': 'Define tempo de espera.',
            '/nobreak': 'Impede interrupção por teclado.'
        }
    },

    'shift': {
        type: 'Parâmetros',
        description: 'Move parâmetros de %1 para %0, %2 para %1 e assim por diante.'
    },

    'setlocal': {
        type: 'Controle de Escopo',
        description: 'Inicia a localização (isolamento) de variáveis de ambiente em um arquivo em lote.\nSintaxe: `setlocal [opções]`',
        dependencies: {

            'enabledelayedexpansion': {
                description: 'Habilita expansão atrasada de variáveis.',
                '!variavel!': 'Permite leitura dinâmica de variáveis dentro de loops.'
            },

            'disableextensions': 'Desabilita extensões avançadas do CMD.',
            'enableextensions': 'Habilita extensões avançadas do CMD.'
        }
    },

    'endlocal': {
        type: 'Controle de Escopo',
        description: 'Finaliza escopo iniciado com setlocal e restaura variáveis.'
    },
}


// colocando os dados

module.exports = {
    ...console_commands,
    ...flow_commands,
};

