const vscode = require('vscode');

function activate(context) {
    vscode.window.showInformationMessage('Batch Tools ativado');

    // =====================================
    // BASE DE COMANDOS (EXPANDIDA)
    // =====================================

    // =====================================
    // ENGINE CENTRAL (EXPANDIDA)
    // =====================================

    const commandMap = {
        '@echo': {
            type: 'Controle de Fluxo',
            description: 'Controla a exibição dos comandos na tela.\nSintaxe: `@echo [on | off]`',
            dependencies: {
                'on': 'Ativa a exibição de cada comando antes de ser executado.',
                'off': 'Desativa a ocultação de comandos (padrão em scripts limpos).'
            }
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
                '/q': 'Modo silencioso. Não pede confirmação [S/N] antes de apagar a árvore de pastas.'
            }
        },

        'del': {
            type: 'Gerenciamento de Arquivos',
            description: 'Apaga um ou mais arquivos do disco.\nSintaxe: `del [/f] [/s] [/q] nomes_dos_arquivos`',
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

        'cd': {
            type: 'Navegação',
            description: 'Exibe o nome do diretório atual ou altera a pasta de trabalho.\nSintaxe: `cd [/d] [caminho]`',
            dependencies: {
                '/d': 'Altera simultaneamente a unidade de disco (Drive) e a pasta de destino atual.'
            }
        },

        'ipconfig': {
            type: 'Diagnóstico de Rede',
            description: 'Exibe todos os valores de configuração da rede TCP/IP atual.\nSintaxe: `ipconfig [opções]`',
            dependencies: {
                '/all': 'Exibe informações detalhadas de rede (Mac Address, DHCP, DNS, Máscara).',
                '/release': 'Envia um aviso DHCPRELEASE para liberar o endereço IP atual do adaptador.',
                '/renew': 'Renova o endereço de IP para todos os adaptadores de rede conectados.',
                '/flushdns': 'Purga e redefine o cache de resolução do cliente DNS do Windows.',
                '/displaydns': 'Exibe o conteúdo atual armazenado na tabela de cache do DNS.'
            }
        },

        'ping': {
            type: 'Diagnóstico de Rede',
            description: 'Verifica a conectividade de rede enviando pacotes ICMP para um alvo.\nSintaxe: `ping [/t] [/n pacote] alvo`',
            dependencies: {

                '/n': {
                    description: 'Define a quantidade de pacotes enviados.',
                    '1': 'Envia apenas um pacote.',
                    '4': 'Quantidade padrão do Windows.',
                    '10': 'Envia dez pacotes.'
                },

                '/l': {
                    description: 'Define o tamanho do pacote enviado.',
                    '32': 'Tamanho padrão do pacote.',
                    '64': 'Pacote com 64 bytes.',
                    '1500': 'Pacote grande para testes MTU.'
                },

                '/t': 'Dispara contra o alvo continuamente até que seja interrompido via Ctrl+C.'
            }
        },

        'net': {
            type: 'Administração de Rede',
            description: 'Ferramenta de gerenciamento para serviços, usuários e recursos de rede.\nSintaxe: `net [comando_dependente]`',
            dependencies: {

                'user': {
                    description: 'Gerencia contas de usuários locais.',
                    '/add': 'Adiciona um novo usuário.',
                    '/delete': 'Remove um usuário existente.',
                    '/active:yes': 'Ativa a conta.',
                    '/active:no': 'Desativa a conta.'
                },

                'start': 'Inicia um serviço de rede do Windows que se encontra parado.',
                'stop': 'Interrompe a execução de um serviço do Windows em atividade.',
                'view': 'Lista computadores e recursos compartilhados na mesma rede local.'
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

                '/online': 'Especifica que a operação deve ser feita na imagem do Windows atual em execução.'
            }
        },

        'systeminfo': {
            type: 'Informação',
            description: 'Exibe propriedades detalhadas sobre a configuração do sistema e do hardware.'
        },

        'cls': {
            type: 'Interface',
            description: 'Limpa todas as saídas de texto registradas no terminal do console.'
        },

        'pause': {
            type: 'Controle de Fluxo',
            description: 'Suspende o processamento de um script e exibe a mensagem de espera por teclas.'
        },

        'echo': {
            type: 'Interface',
            description: 'Exibe mensagens de texto personalizadas diretamente na tela do console.\nSintaxe: `echo [mensagem]`'
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

        'type': {
            description: 'Exibe o conteúdo de um ou mais arquivos de texto na tela do console.\nSintaxe: `type [unidade:][caminho]nome_do_arquivo`',
            dependencies: {
                'nul': 'Limpa ou oculta a saída de dados enviando para o dispositivo nulo (Ex: `comando > nul`).',
                'con': 'Faz a leitura a partir do próprio console ou teclado do usuário.'
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

        'goto': {
            type: 'Controle de Fluxo',
            description: 'Desvia a execução do script para uma label específica.\nSintaxe: `goto label`',
            dependencies: {
                'eof': 'Finaliza a sub-rotina atual e retorna automaticamente.'
            }
        },

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

        'title': {
            type: 'Interface',
            description: 'Define o título da janela atual do CMD.\nSintaxe: `title texto`'
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

        'pushd': {
            type: 'Navegação',
            description: 'Salva o diretório atual e muda para outro.\nSintaxe: `pushd caminho`'
        },

        'popd': {
            type: 'Navegação',
            description: 'Retorna ao diretório salvo anteriormente via pushd.'
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

        'tree': {
            type: 'Informação',
            description: 'Exibe graficamente a estrutura de diretórios.\nSintaxe: `tree [caminho]`',
            dependencies: {
                '/f': 'Exibe também os arquivos.',
                '/a': 'Usa caracteres ASCII simples.'
            }
        },

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
                '/n': 'Mostra número das linhas.'
            }
        },

        'more': {
            type: 'Interface',
            description: 'Exibe saída paginada no console.\nSintaxe: `comando | more`'
        },

        'sort': {
            type: 'Processamento',
            description: 'Ordena linhas de texto.\nSintaxe: `sort`',
            dependencies: {
                '/r': 'Ordena em ordem reversa.'
            }
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

        'path': {
            type: 'Sistema',
            description: 'Define ou exibe caminhos de busca de executáveis.\nSintaxe: `path caminho`'
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

        'hostname': {
            type: 'Informação',
            description: 'Exibe o nome do computador.'
        },

        'netstat': {
            type: 'Diagnóstico de Rede',
            description: 'Exibe conexões de rede e portas abertas.\nSintaxe: `netstat [opções]`',
            dependencies: {
                '-a': 'Mostra todas as conexões.',
                '-n': 'Mostra endereços numéricos.',
                '-o': 'Exibe PID associado.'
            }
        },

        'tracert': {
            type: 'Diagnóstico de Rede',
            description: 'Rastreia rota até um destino.\nSintaxe: `tracert host`',
            dependencies: {
                '-d': 'Não resolve nomes DNS.',
                '-h': 'Define máximo de saltos.'
            }
        },

        'nslookup': {
            type: 'Diagnóstico de Rede',
            description: 'Consulta servidores DNS.\nSintaxe: `nslookup dominio`'
        },

        'arp': {
            type: 'Diagnóstico de Rede',
            description: 'Gerencia cache ARP.\nSintaxe: `arp [opções]`',
            dependencies: {
                '-a': 'Mostra entradas ARP.',
                '-d': 'Remove entrada.'
            }
        },

        'route': {
            type: 'Rede',
            description: 'Manipula tabela de roteamento IP.\nSintaxe: `route comando`',
            dependencies: {
                'print': 'Mostra tabela de rotas.',
                'add': 'Adiciona rota.',
                'delete': 'Remove rota.'
            }
        },

        'whoami': {
            type: 'Informação',
            description: 'Mostra usuário atualmente autenticado.'
        },

        'tasklist': {
            type: 'Gerenciamento de Sistema',
            description: 'Lista processos em execução.\nSintaxe: `tasklist`',
            dependencies: {
                '/v': 'Modo detalhado.',
                '/svc': 'Mostra serviços associados.',
                '/fi': 'Aplica filtros.'
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

        'fc': {
            type: 'Comparação',
            description: 'Compara arquivos ou conjuntos de arquivos.\nSintaxe: `fc arquivo1 arquivo2`',
            dependencies: {
                '/b': 'Comparação binária.',
                '/c': 'Ignora maiúsculas/minúsculas.',
                '/n': 'Mostra números de linha.'
            }
        },

        'where': {
            type: 'Pesquisa',
            description: 'Localiza arquivos executáveis.\nSintaxe: `where programa`',
            dependencies: {
                '/r': 'Pesquisa recursiva.'
            }
        },

        'ren': {
            type: 'Gerenciamento de Arquivos',
            description: 'Renomeia arquivos ou diretórios.\nSintaxe: `ren antigo novo`'
        },

        'clip': {
            type: 'Interface',
            description: 'Envia saída diretamente para a área de transferência.\nSintaxe: `comando | clip`'
        },

        'endlocal': {
            type: 'Controle de Escopo',
            description: 'Finaliza escopo iniciado com setlocal e restaura variáveis.'
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
        }
    };
    


    // variáveis de sistema listadas
    const systemVars = {
        'DATE': 'Retorna a data atual do sistema',
        'TIME': 'Retorna a hora atual do sistema',
        'USERNAME': 'Retorna o nome do usuário logado no momento',
        'PATH': 'Lista os diretórios de busca para arquivos executáveis',
        'CD': 'Retorna o diretório atual (mesmo que a variável %__CD__%)',
        'errorlevel': 'Retorna o código de saída (erro) do último comando executado'
    };
    
    // =====================================
    // HOVER + UTILITÁRIOS (CORRIGIDO)
    // =====================================

    function getCommandInfo(word) {

        if (!word) return null;

        word = word.trim().toLowerCase();

        for (const cmd in commandMap) {

            const data = commandMap[cmd];

            // comando base
            if (word === cmd.toLowerCase()) {
                return data.description;
            }

            // dependências (/a /p on/off etc)
            if (data.dependencies) {

                for (const dep in data.dependencies) {

                    if (word === dep.toLowerCase()) {
                        return data.dependencies[dep];
                    }
                }
            }
        }

        return null;
    }

    // =====================================
    // MELHOR DETECÇÃO DE TOKEN (IMPORTANTE)
    // =====================================
    

    function getHoverWord(document, position) {

        const range =
            document.getWordRangeAtPosition(position, /[@/a-zA-Z0-9_]+/);

        if (!range) return null;

        return document.getText(range);
    }

    // =====================================
    // ESCAPE REGEX (mantido)
    // =====================================

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }


    // =====================================
    // LABELS / TARGETS DO SCRIPT | para o AutoCOMPLEMENT
    // =====================================

    function getScriptTargets(text) {

        // =====================================
        // RECONHECE:
        //
        // :label
        // call :label
        // goto label
        // =====================================

        const regexTargets =
            // /^\s*(?::|call\s+:|goto\s+)([a-zA-Z0-9_\-.]+)\s*$/gim;
            /^\s*(?::|call\s+:|goto\s+)([a-zA-Z0-9_\-.]+)(?:\s+.*)?$/gim;

        const targets =
            new Map();

        let match;

        while ((match = regexTargets.exec(text))) {

            const name =
                match[1];

            const line =
                match[0];

            // evita duplicatas
            if (targets.has(name.toLowerCase())) {
                continue;
            }

            // =====================================
            // TIPO
            // =====================================

            let type =
                'Label';

            let description =
                'Destino encontrado no script';

            if (/^\s*:/.test(line)) {

                type =
                    'Label';

                description =
                    'Label principal do script';
            }

            else if (/^\s*call\s+:/i.test(line)) {

                type =
                    'Sub-rotina';

                description =
                    'Sub-rotina, uma label';
            }

            else if (/^\s*goto\s+/i.test(line)) {

                type =
                    'Destino GOTO';

                description =
                    'Destino utilizado por GOTO';
            }

            targets.set(
                name.toLowerCase(),
                {
                    name,
                    type,
                    description
                }
            );
        }

        return [...targets.values()];
    }

    // =====================================
    // AUTOCOMPLETE
    // =====================================

    const completionProvider =
        vscode.languages.registerCompletionItemProvider(

        'bat',

        {
            provideCompletionItems(document, position) {

                const items = [];

                const line =
                    document.lineAt(position).text;

                const before =
                    line.substring(0, position.character);

                // =====================================
                // 0. DETECTA VARIÁVEL PRIMEIRO (PRIORIDADE MÁXIMA)
                // =====================================

                //const varMatch = before.match(/(?<!%)(%)([a-zA-Z0-9_]*)$/);
                const varMatch = before.match(/(?<![!%])([!%])([a-zA-Z0-9_]*)$/);

                if (varMatch) {

                    const textoDigitado = varMatch[2];
                    const gatilho = varMatch[1]

                    const start =
                        new vscode.Position(
                            position.line,
                            position.character - textoDigitado.length
                        );

                    const range =
                        new vscode.Range(start, position);

                    // =========================
                    // sistema
                    // =========================

                    Object.entries(systemVars).forEach(([v, descricao]) => {

                        const nomeVariavel = v.toLowerCase();

                        if (textoDigitado === "" || v.startsWith(textoDigitado)) {

                            const item = new vscode.CompletionItem(
                                `%${v}%`,
                                vscode.CompletionItemKind.Variable
                            );

                            // 3. REFORÇO: O filterText ajuda o VS Code a não se perder
                            item.filterText = v;

                            item.range = range;
                            item.insertText = `${v}${gatilho}`;

                            // Agora o detail usa a descrição específica do objeto
                            item.detail = descricao;

                            // Dica extra: você pode colocar um rótulo no lado direito (label details)
                            item.label = {
                                label: `${gatilho}${v}${gatilho}`,
                                description: 'Sistema'
                            };

                            item.range = range;

                            items.push(item);
                        }
                    });

                    // =========================
                    // script para os básicos
                    // =========================

                    const text = document.getText();

                    const regex =
                        /^set\s+(?:\/[ap]\s+)?([a-zA-Z0-9_]+)=/gim;

                    let match;

                    // para caso ele tenha digitado %
                    while ((match = regex.exec(text))) {

                        const item =
                            new vscode.CompletionItem(
                                `%${match[1]}%`,
                                vscode.CompletionItemKind.Variable
                            );

                        item.filterText = match[1]

                        item.insertText = `${match[1]}${gatilho}`

                        item.detail = 'Variável do script';

                        // retulo na parte esquerda
                        item.label = {
                            label: `${gatilho}${match[1]}${gatilho}`,
                            description: 'Script'
                        };

                        item.range = range;

                        items.push(item);
                    }

                    return items;
                }

                // =========================
                // LABELS + CALLS DO SCRIPT
                // =========================

                const text =
                    document.getText();

                // =====================================
                // CONTEXTOS:
                //
                // :
                // goto
                // call
                // =====================================

                const isLabelContext =
                    /:\w*$/i.test(before)
                    ||
                    /\b(goto|call)\s+[a-zA-Z0-9_\-.:]*$/i
                        .test(before);

                if (isLabelContext) {

                    // =====================================
                    // TEXTO PARCIAL
                    // =====================================

                    const currentMatch =
                        before.match(/[:a-zA-Z0-9_\-.]+$/);

                    const currentText =
                        currentMatch
                            ? currentMatch[0]
                            : '';

                    // =====================================
                    // RANGE
                    // =====================================

                    const start =
                        new vscode.Position(
                            position.line,
                            position.character - currentText.length
                        );

                    const range =
                        new vscode.Range(start, position);

                    // =====================================
                    // TARGETS
                    // =====================================

                    const targets =
                        getScriptTargets(text);

                    for (const target of targets) {

                        const item =
                            new vscode.CompletionItem(
                                `:${target.name}`,
                                vscode.CompletionItemKind.Reference
                            );

                        // =====================================
                        // MATCH
                        // =====================================

                        item.filterText =
                            `${target.name} :${target.name}`;

                        // =====================================
                        // INSERT
                        // =====================================

                        // digitando :
                        if (/:\w*$/i.test(before)) {

                            item.insertText =
                                `:${target.name}`;

                        } else {

                            // goto/call
                            item.insertText =
                                target.name;
                        }

                        item.detail =
                            target.description;

                        item.documentation =
                            new vscode.MarkdownString(
                                `${target.description}\n\n\`${target.name}\``
                            );

                        item.label = {
                            label: `:${target.name}`,
                            description: target.type
                        };

                        item.range = range;

                        items.push(item);
                    }
                }

                // =====================================
                // 1. DEPENDÊNCIAS (set, mkdir, @echo)
                // =====================================

                let activeCommand = null;

                for (const key in commandMap) {

                    const regex =
                        new RegExp(`^\\s*${escapeRegex(key)}\\b`, 'i');

                    if (regex.test(before)) {

                        activeCommand = key;
                        break;
                    }
                }

                if (activeCommand && commandMap[activeCommand]) {

                    const cmd = commandMap[activeCommand];

                    // =====================================
                    // DEPENDÊNCIAS DINÂMICAS
                    // =====================================

                    let dynamicDependencies =
                        {
                            ...(cmd.dependencies || {})
                        };

                    // =====================================
                    // GOTO / CALL → LABELS
                    // =====================================

                    if (
                        activeCommand.toLowerCase() === 'goto'
                        ||
                        activeCommand.toLowerCase() === 'call'
                    ) {

                        const targets =
                            getScriptTargets(text);

                        for (const target of targets) {

                            dynamicDependencies[target.name] = {
                                type: target.type,
                                description: target.description
                            };
                        }
                    }

                    const hasSpaceAfter =
                        new RegExp(`^\\s*${escapeRegex(activeCommand)}\\s+`, 'i')
                            .test(before);

                    if (hasSpaceAfter) {

                        if (!dynamicDependencies) {
                            return [];
                        }

                        // =====================================
                        // DESCOBRE SE ESTÁ DENTRO DE UMA FLAG
                        // EX: for /f ...
                        // =====================================

                        let nestedDependencies = null;

                        for (const [depName, depValue] of Object.entries(dynamicDependencies)) {

                            if (
                                typeof depValue === 'object' &&
                                before.toLowerCase().includes(depName.toLowerCase())
                            ) {

                                nestedDependencies = depValue;
                            }
                        }

                        // =====================================
                        // PARTE ONDE ELE SUBSTITUI CORRETAMENTE
                        // =====================================

                        const depMatch =
                            before.match(/[\/!a-zA-Z0-9:=._()-]+$/);

                        const start =
                            new vscode.Position(
                                position.line,
                                position.character - (depMatch ? depMatch[0].length : 0)
                            );

                        const range =
                            new vscode.Range(start, position);

                        // =====================================
                        // DEPENDÊNCIAS INTERNAS
                        // =====================================

                        if (nestedDependencies) {

                            return Object.entries(nestedDependencies)
                                .filter(([key]) => key !== 'description')
                                .map(([dep, desc]) => {

                                    const item =
                                        new vscode.CompletionItem(
                                            dep,
                                            vscode.CompletionItemKind.Field
                                        );

                                    item.documentation =
                                        new vscode.MarkdownString(String(desc));

                                    item.range = range;

                                    return item;
                                });
                        }

                        // =====================================
                        // DEPENDÊNCIAS NORMAIS
                        // =====================================

                        return Object.entries(dynamicDependencies).map(([dep, desc]) => {

                        let kind =
                            vscode.CompletionItemKind.Keyword;

                        // =====================================
                        // LABELS / TARGETS
                        // =====================================

                        if (
                            typeof desc === 'object'
                            &&
                            (
                                desc.type === 'Label'
                                ||
                                desc.type === 'Sub-rotina'
                                ||
                                desc.type === 'Destino GOTO'
                            )
                        )
                        {

                            kind =
                                vscode.CompletionItemKind.Reference;
                        }

                        const item =
                            new vscode.CompletionItem(
                                dep,
                                kind
                            );

                            // =====================================
                            // DESCRIÇÃO
                            // =====================================

                            if (typeof desc === 'object') {

                                let markdown =
                                    `${desc.description || ''}`;

                                const nested =
                                    Object.keys(desc)
                                        .filter(k => k !== 'description');

                                if (nested.length > 0) {

                                    markdown += `\n\n---\n\n`;

                                    for (const nestedKey of nested) {

                                        markdown +=
                                            `- \`${nestedKey}\` → ${desc[nestedKey]}\n`;
                                    }
                                }

                                item.documentation =
                                    new vscode.MarkdownString(markdown);

                            } else {

                                item.documentation =
                                    new vscode.MarkdownString(String(desc));
                            }

                            item.range = range;

                            return item;
                        });
                    }

                    return [];
                }

                // =====================================
                // 2. COMANDOS GLOBAIS
                // =====================================

                for (const [name, data] of Object.entries(commandMap)) {

                    const item = new vscode.CompletionItem(
                        name,
                        vscode.CompletionItemKind.Keyword
                    );

                    item.detail = data.description;

                    // =====================================
                    // DOCUMENTAÇÃO DOS PARÂMETROS
                    // =====================================

                    if (data.dependencies) {

                        let markdown =
                            `### Parâmetros comuns\n\n`;

                        for (const [dep, desc] of Object.entries(data.dependencies)) {

                            if (typeof desc === 'object') {

                                markdown +=
                                    `- \`${dep}\` → ${desc.description || 'Subcomandos'}\n`;

                            } else {

                                markdown +=
                                    `- \`${dep}\` → ${desc}\n`;
                            }
                        }

                        item.documentation =
                            new vscode.MarkdownString(markdown);
                    }

                    items.push(item);
                }

                return items;
            }
        },

        ' ', '/', '%'
    );



    // =====================================
    // HOVER
    // =====================================

const hoverProvider =
    vscode.languages.registerHoverProvider('bat', {

        provideHover(document, position) {

            try {

                const line =
                    document.lineAt(position.line).text;

                if (!line) {
                    return;
                }

                const text =
                    document.getText();

                // =====================================
                // RANGE SOB CURSOR
                // =====================================

                const range =
                    document.getWordRangeAtPosition(
                        position,
                        /[@!%:\/a-zA-Z0-9_.\-]+/i
                    );

                if (!range) {
                    return;
                }

                const rawWord =
                    document.getText(range);

                const word =
                    rawWord.toLowerCase();

                // =====================================
                // COMANDO BASE
                // =====================================

                const base =
                    line.trim().split(/\s+/)[0]?.toLowerCase();

                const cmdData =
                    commandMap[base] ||
                    commandMap[`@${base}`];

                // =====================================
                // 1. HOVER DO COMANDO BASE
                // =====================================

                if (
                    cmdData &&
                    (
                        word === base ||
                        word === `@${base}`
                    )
                ) {

                    let markdown =
                        `# ${base}\n\n`;

                    markdown +=
                        `${cmdData.description || 'Comando batch'}\n`;

                    if (cmdData.dependencies) {

                        markdown += `\n---\n\n`;
                        markdown += `## Dependências\n\n`;

                        for (const [dep, desc] of Object.entries(cmdData.dependencies)) {

                            if (typeof desc === 'object') {

                                markdown +=
                                    `- \`${dep}\` → ${desc.description || 'Subdependências'}\n`;

                            } else {

                                markdown +=
                                    `- \`${dep}\` → ${desc}\n`;
                            }
                        }
                    }

                    return new vscode.Hover(
                        new vscode.MarkdownString(markdown)
                    );
                }

                // =====================================
                // 2. HOVER DEPENDÊNCIAS
                // =====================================

                if (cmdData?.dependencies) {

                    for (const [dep, desc] of Object.entries(cmdData.dependencies)) {

                        // =====================================
                        // DEPENDÊNCIA NORMAL
                        // =====================================

                        if (dep.toLowerCase() === word) {

                            // caso ele tenha dependencias, tipo set /p =, tem
                            if (typeof desc === 'object') {

                                let markdown =
                                    `# ${dep}\n\n`;

                                markdown +=
                                    `${desc.description || ''}\n`;

                                const nested =
                                    Object.keys(desc)
                                        .filter(k => k !== 'description');

                                if (nested.length > 0) {

                                    markdown += `\n---\n\n`;
                                    markdown += `## Subdependências\n\n`;

                                    for (const nestedKey of nested) {

                                        markdown +=
                                            `- \`${nestedKey}\` → ${desc[nestedKey]}\n`;
                                    }
                                }

                                return new vscode.Hover(
                                    new vscode.MarkdownString(markdown)
                                );
                            }

                            // caso ele não tenha dependencias, tipo mkdir /p, qu não tem nada além do /p
                     
                            const md = new vscode.MarkdownString();

                            md.appendMarkdown(`# ${dep}\n\n`);
                            md.appendMarkdown(
                                typeof desc === 'string'
                                    ? desc
                                    : desc.description || ''
                            );

                            return new vscode.Hover(md);      
                        }

                        // =====================================
                        // SUBDEPENDÊNCIAS
                        // =====================================

                        if (typeof desc === 'object') {

                            for (const [nestedKey, nestedDesc] of Object.entries(desc)) {

                                if (nestedKey === 'description') {
                                    continue;
                                }

                                const normalizedWord =
                                    word.endsWith('=')
                                        ? word
                                        : `${word}=`;

                                if (
                                    nestedKey.toLowerCase() === word
                                    ||
                                    nestedKey.toLowerCase() === normalizedWord
                                ) {

                                    let markdown =
                                        `# ${nestedKey}\n\n`;

                                    markdown +=
                                        `${nestedDesc}\n`;

                                    markdown += `\n---\n\n`;

                                    markdown +=
                                        `Pertence a: \`${dep}\`\n`;
                                    return new vscode.Hover(
                                        new vscode.MarkdownString(markdown)
                                    );
                                }
                            }
                        }                     
                    }
                }

                // =====================================
                // 3. VARIÁVEIS DE SCRIPT
                // set nome=abc
                // set /p nome=...
                // set /a nome=...
                // =====================================

                const regexVars =
                    /^\s*set\s+(?:\/[ap]\s+)?([a-zA-Z0-9_]+)\s*=/gim;

                let matchVar;

                while ((matchVar = regexVars.exec(text))) {

                    const varName =
                        matchVar[1];

                    // =====================================
                    // CORREÇÃO:
                    // reconhece "local" diretamente
                    // no set local=
                    // set /p local=
                    // =====================================

                    const cleanWord =
                        word
                            .replace(/^%/, '')
                            .replace(/%$/, '')
                            .replace(/^!/, '')
                            .replace(/!$/, '');

                    if (
                        cleanWord === varName.toLowerCase()
                    ) {

                        let markdown =
                            `# ${varName}\n\n`;

                        markdown +=
                            `Variável de script declarada com \`set\`\n\n`;

                        markdown +=
                            `## Exemplos\n\n`;

                        markdown +=
                            `- \`set ${varName}=valor\`\n`;

                        markdown +=
                            `- \`%${varName}%\`\n`;

                        markdown +=
                            `- \`!${varName}!\`\n`;

                        return new vscode.Hover(
                            new vscode.MarkdownString(markdown)
                        );
                    }
                }

                // =====================================
                // 4. VARIÁVEIS DE SISTEMA
                // =====================================

                for (const [sysVar, sysDesc] of Object.entries(systemVars)) {

                    const lowerSys =
                        sysVar.toLowerCase();

                    const cleanWord =
                        word
                            .replace(/^%/, '')
                            .replace(/%$/, '')
                            .replace(/^!/, '')
                            .replace(/!$/, '');

                    if (
                        cleanWord === lowerSys
                    ) {

                        let markdown =
                            `# ${sysVar}\n\n`;

                        markdown +=
                            `${sysDesc}\n\n`;

                        markdown +=
                            `## Tipo\n\n`;

                        markdown +=
                            `Variável de sistema do CMD / Windows\n`;

                        return new vscode.Hover(
                            new vscode.MarkdownString(markdown)
                        );
                    }
                }

                // =====================================
                // 5. LABELS / CALL / GOTO
                // =====================================

                const regexLabels =
                    // /^\s*(?::|call\s+|goto\s+)([a-zA-Z0-9_\-.]+)/gim; retirei a parte de goto funcionar!
                    /^\s*(?::|call\s+:|goto\s+)([a-zA-Z0-9_\-.]+)\s*$/gim;

                let matchLabel;

                while ((matchLabel = regexLabels.exec(text))) {

                    const labelName =
                        matchLabel[1];

                    const cleanWord =
                        word.replace(/^:/, '');

                    const lineText =
                        document.lineAt(position.line).text;

                    const isLabelContext =
                        /^\s*(?::|call\s+:|goto\s+)/i.test(lineText);

                    if (
                            isLabelContext &&
                            cleanWord === labelName.toLowerCase()
                        ) {

                        let markdown =
                            `# ${labelName}\n\n`;

                        markdown +=
                            `Label / destino de fluxo do script\n\n`;

                        markdown +=
                            `## Exemplos\n\n`;

                        markdown +=
                            `- \`goto ${labelName}\`\n`;

                        markdown +=
                            `- \`call :${labelName}\`\n`;

                        markdown +=
                            `- \`:${labelName}\`\n`;

                        return new vscode.Hover(
                            new vscode.MarkdownString(markdown)
                        );
                    }
                }

                return;

            } catch (err) {

                console.log('Hover error:', err);

                return;
            }
        }
    });

    // =====================================
    // DECORAÇÃO (/p /a SOMENTE CONTEXTO)
    // =====================================

    const optionDecoration =
        vscode.window.createTextEditorDecorationType({
            color: '#FF69C0'
        });

    const variableDecoration =
        vscode.window.createTextEditorDecorationType({
            color: '#E6A15C',
            fontStyle: 'italic'
        });

    function updateDecorations(editor) {

        if (!editor) return;

        const document =
            editor.document;

        const commandDecorations = [];
        const variableDecorations = [];


        const lineCount =
            document.lineCount;

        for (let i = 0; i < lineCount; i++) {

            const line =
                document.lineAt(i).text;

            // =====================================
            // VARIÁVEIS (SEGURAS)
            // =====================================

            if (typeof extractVariables === 'function') {

                const vars =
                    extractVariables(line);

                for (const v of vars) {
                    
                    variableDecorations.push({
                        range: new vscode.Range(
                            new vscode.Position(i, v.start),
                            new vscode.Position(i, v.end)
                        )
                    });
                }
            }
        }

        for (let i = 0; i < lineCount; i++) {

            const line =
                document.lineAt(i).text;

            const base =
                line.trim().split(/\s+/)[0]?.toLowerCase();

            const cmdData =
                commandMap[base] ||
                commandMap[`@${base}`];

            if (!cmdData?.dependencies) {
                continue;
            }

            // =====================================
            // pega só deps válidas (/p /a -h)
            // =====================================

            for (const dep of Object.keys(cmdData.dependencies)) {

                if (
                    !/^\/[a-z0-9]+$/i.test(dep) &&
                    !/^-[a-z0-9]+$/i.test(dep)
                ) {
                    continue;
                }

                const escaped =
                    dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                const regex =
                    new RegExp(
                        `(^|\\s)(${escaped})(?=\\s|$|=)`,
                        'gi'
                    );

                let match;

                while ((match = regex.exec(line))) {

                    const start =
                        new vscode.Position(i, match.index + match[1].length);

                    const end =
                        new vscode.Position(i, match.index + match[1].length + dep.length);

                    commandDecorations.push({
                        range: new vscode.Range(start, end)
                    });
                }
            }
        }

        editor.setDecorations(optionDecoration, commandDecorations);
        editor.setDecorations(variableDecoration, variableDecorations);
    }

    // para as cores do %%


    
   function extractVariables(line) {

    const results = [];

    let i = 0;

    while (i < line.length) {

        const char = line[i];

        // =====================================
        // %% LOOP (APENAS 1 LETRA)
        // =====================================

        if (line.startsWith('%%', i)) {

            const start = i;
            i += 2;

            const letter = line[i];

            if (letter && /[a-z]/i.test(letter)) {

                i++;

                results.push({
                    start,
                    end: i,
                    valid: true
                });

            } else {
                i++;
            }

            continue;
        }

        // =====================================
        // %VAR% OU !VAR!
        // MESMA REGRA PARA AMBOS
        // =====================================

        if (char === '%' || char === '!') {

            const delimiter = char;
            const start = i;

            i++;

            const next = line[i];

            // precisa começar com letra
            if (!next || !/[a-z]/i.test(next)) {
                continue;
            }

            const openIndex = i;

            i++;

            while (i < line.length) {

                const c = line[i];

                // fecha se encontrar mesmo símbolo
                if (c === delimiter) {
                    i++;
                    break;
                }

                // espaço quebra regra (ignora resto)
                if (c === ' ') {
                    break;
                }

                i++;
            }

            results.push({
                start,
                end: i,
                valid: true
            });

            continue;
        }

        i++;
    }

    return results;
}

    // =====================================

    if (vscode.window.activeTextEditor) {
        updateDecorations(vscode.window.activeTextEditor);
    }

    vscode.window.onDidChangeActiveTextEditor(updateDecorations);

    vscode.workspace.onDidChangeTextDocument(event => {

        const editor =
            vscode.window.activeTextEditor;

        if (editor && event.document === editor.document) {
            updateDecorations(editor);
        }
    });



    // parte normal
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};