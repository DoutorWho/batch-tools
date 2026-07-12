/**
 * BIBLIOTECA DE DADOS DO INTERPRETADOR CMD
 *
 * Ponto central de exportação dos dados utilizados
 * pela extensão.
 *
 * Reúne comandos do CMD e elementos da linguagem,
 * incluindo comandos internos, ferramentas administrativas,
 * manipulação de arquivos, rede, armazenamento, controle
 * de execução, variáveis de ambiente e informações
 * do sistema.
 *
 * Este arquivo abstrai a organização interna dos módulos,
 * permitindo que outros componentes acessem todos os dados
 * através de uma única importação.
 */


// =========================================
// COMANDOS DO CMD
// =========================================

const access = require('./commands/access');
const administration_tools = require('./commands/administration_tools');
const filesystem_tools = require('./commands/filesystem_tools');
const network = require('./commands/network');
const runtime = require('./commands/runtime');
const storage = require('./commands/storage');


// =========================================
// VARIÁVEIS DA LINGUAGEM
// =========================================

const datetime = require('./language/datetime');
const environment = require('./language/environment');
const shell = require('./language/shell');
const system = require('./language/system');
const user = require('./language/user');


// =========================================
// EXPORTAÇÃO GERAL
// =========================================

const comandos_cmd = {
    ...access,
    ...administration_tools,
    ...filesystem_tools,
    ...network,
    ...runtime,
    ...storage
};


const variaveis_de_sistemas = {
    ...datetime,
    ...environment,
    ...shell,
    ...system,
    ...user
};

module.exports = {
    comandos_cmd,
    variaveis_de_sistemas,
};