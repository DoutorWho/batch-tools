/**
 * REDE E CONECTIVIDADE
 *
 * Reúne comandos utilizados para configurar, diagnosticar e
 * monitorar conexões de rede no Windows, incluindo protocolos
 * TCP/IP, resolução de nomes, roteamento, compartilhamento de
 * recursos e comunicação entre computadores.
 *
 * Também inclui ferramentas para administração de serviços de
 * rede e acesso remoto em ambientes locais ou corporativos.
 */

const network_commands = {
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

    'netstat': {
        type: 'Diagnóstico de Rede',
        description: 'Exibe conexões de rede e portas abertas.\nSintaxe: `netstat [opções]`',
        dependencies: {
            '-a': 'Mostra todas as conexões.',
            '-n': 'Mostra endereços numéricos.',
            '-o': 'Exibe PID associado.'
        }
    },

    'hostname': {
        type: 'Informação',
        description: 'Exibe o nome do computador.'
    },

    'msg': {
        type: 'Rede',
        description: 'Envia mensagens para sessões ou usuários.\nSintaxe: `msg usuario mensagem`',
        dependencies: {

            '/server': {
                description: 'Define servidor remoto.',
                'SERVIDOR01': 'Exemplo de host remoto.'
            },

            '/time': {
                description: 'Define timeout da mensagem.',
                '30': '30 segundos.'
            },

            '/v': 'Modo detalhado.',
            '/w': 'Espera confirmação.'
        }
    },

    'mstsc': {
        type: 'Rede',
        description: 'Abre Conexão de Área de Trabalho Remota.\nSintaxe: `mstsc [arquivo.rdp]`',
        dependencies: {

            '/v': {
                description: 'Define host remoto.',
                '192.168.0.10': 'Exemplo de IP.',
                'SERVIDOR01': 'Exemplo hostname.'
            },

            '/admin': 'Conecta sessão administrativa.',
            '/f': 'Tela cheia.',
            '/multimon': 'Usa múltiplos monitores.'
        }
    },

    'openfiles': {
        type: 'Administração de Rede',
        description: 'Lista ou desconecta arquivos abertos remotamente.\nSintaxe: `openfiles [opções]`',
        dependencies: {

            '/query': {
                description: 'Lista arquivos abertos remotamente.',
                '/fo': 'Permite definir formato de saída.',
                '/v': 'Modo detalhado.'
            },

            '/disconnect': {
                description: 'Fecha conexão remota com arquivo aberto.',
                '/id': 'Define ID do arquivo.'
            },

            '/local': {
                description: 'Ativa rastreamento local de arquivos.',
                'on': 'Habilita rastreamento.',
                'off': 'Desabilita rastreamento.'
            },

            '/fo': {
                description: 'Formato da saída.',
                'table': 'Formato tabela.',
                'list': 'Formato lista.',
                'csv': 'Formato CSV.'
            },

            '/v': 'Exibe informações detalhadas.'
        }
    },
}


// colocando os dados

module.exports = {
    ...network_commands,
};