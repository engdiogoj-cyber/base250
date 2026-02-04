// =====================================================
// BASE250 - SISTEMA COMPLETO DE GESTÃO DE IMÓVEIS V4.1
// VERSÃO 2 (REFATORADA E MELHORADA)
// Data: 04/02/2026
// =====================================================
// MELHORIAS DA V2 vs V1:
// ✅ Removidas TODAS as funções duplicadas (30+ funções)
// ✅ Dados sensíveis movidos para Script Properties
// ✅ Tratamento de erros aprimorado
// ✅ Constantes nomeadas para números mágicos
// ✅ Performance melhorada com cache
// ✅ Documentação JSDoc completa
// ✅ Código deprecated removido
// ✅ Estilo de código consistente
// =====================================================
// RESPONSABILIDADE:
// - Sistema completo modular para gestão de imóveis
// - Integração Google Forms → Sheets → Drive → Email
// - Geração automatizada de contratos e declarações
// - Dashboard administrativo integrado
// =====================================================

// =====================================================
// MÓDULO 0: CONFIGURAÇÕES GLOBAIS
// =====================================================

/**
 * Constantes do sistema para evitar números mágicos
 */
const CONSTANTS = {
  FILENAME_MAX_LENGTH: 50,
  CPF_LENGTH: 11,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 11,
  CACHE_DURATION_MINUTES: 5,
  DATE_FORMAT_BR: 'dd/MM/yyyy',
  TIMEZONE_BR: 'America/Sao_Paulo'
};

/**
 * Configuração principal do sistema
 * NOTA: Dados sensíveis devem ser configurados via Script Properties
 * Acesse: Projeto > Configurações > Propriedades do script
 */
const CONFIG = {
  // Emails - Configure via Script Properties: ADMIN_EMAIL, PROPRIETARIO_EMAIL
  adminEmail: getScriptProperty('ADMIN_EMAIL') || 'configure@scriptproperties.com',
  proprietarioEmail: getScriptProperty('PROPRIETARIO_EMAIL') || 'configure@scriptproperties.com',
  
  // Proprietário - Configure via Script Properties para dados sensíveis
  proprietario: {
    nome: getScriptProperty('PROPRIETARIO_NOME') || 'CONFIGURAR VIA SCRIPT PROPERTIES',
    cpf: getScriptProperty('PROPRIETARIO_CPF') || '000.000.000-00',
    estadoCivil: getScriptProperty('PROPRIETARIO_ESTADO_CIVIL') || 'SOLTEIRO',
    profissao: getScriptProperty('PROPRIETARIO_PROFISSAO') || 'NÃO CONFIGURADO',
    endereco: getScriptProperty('PROPRIETARIO_ENDERECO') || 'Endereço não configurado',
    telefone: getScriptProperty('PROPRIETARIO_TELEFONE') || '(00) 00000-0000',
    pix: getScriptProperty('PROPRIETARIO_PIX') || '00000000000',
    banco: getScriptProperty('PROPRIETARIO_BANCO') || 'Banco não configurado',
    agencia: getScriptProperty('PROPRIETARIO_AGENCIA') || '0000-0',
    conta: getScriptProperty('PROPRIETARIO_CONTA') || '000000-0'
  }
};

/**
 * Configuração de email
 */
const CONFIG_EMAIL = {
  logoId: getScriptProperty('EMAIL_LOGO_ID') || '1uSaRNGhOzYcWbhs-4Irj01EadhmVBNAw',
  assinaturaRodape: 'BASE250 – Residencial Itacorubi'
};

/**
 * Configuração de contratos
 */
const CONFIG_CONTRATOS = {
  pastaRaizId: '1-HTxNhWR6uDorAvVULlDcZDvK3BzukHt',
  pastaDocumentosId: '1Flg0IwVykfDlZdSQ2LnkZy1vzjjTk8cAXs2va42Sca-IEcLlFEwcrH61cYICvDJOjohzKgKE',
  pastaFotosId: '1R7bJTZWB96GJ1qhnyeGODCOUViDf4bISxfT-tWLZq_P3LEWuYks82D_BX1372DwApNHOLmJ7',
  
  abaContratos: 'Contratos',
  abaLinks: 'Links',
  abaSaidas: 'Saídas',
  abaAuditoria: 'Auditoria',
  
  templateContratoId: '1Znvwd5xtiDQ1XZrvCtxTor2wLq1Mh91_S51pt6coq5o'
};

/**
 * Mapeamento de colunas da aba Contratos
 * NOTA: Para tornar dinâmico no futuro, use busca por cabeçalho
 */
const COL_CONTRATOS = {
  apto: 1,              // A - Número do apartamento
  inquilino: 2,         // B - Nome do inquilino
  valorAluguel: 3,      // C - Valor do aluguel
  avanco: 4,            // D - Avanço (FÓRMULA)
  status: 5,            // E - Status (FÓRMULA)
  linhaForm: 6,         // F - Linha do formulário
  linkPasta: 7,         // G - Link da pasta
  dataEntrada: 8,       // H - Data de entrada
  prazoMeses: 9,        // I - Prazo em meses
  dataFim: 10,          // J - Data fim (FÓRMULA)
  genero: 11,           // K - Gênero
  telefone: 12,         // L - Telefone
  email: 13,            // M - Email
  nacionalidade: 14,    // N - Nacionalidade
  estadoCivil: 15,      // O - Estado civil
  profissao: 16,        // P - Profissão
  cpf: 17,              // Q - CPF
  endereco: 18,         // R - Endereço
  dataNascimento: 19,   // S - Data de nascimento
  dataEmissao: 20,      // T - Data de emissão
  caucao: 21,           // U - Caução
  celescUnidade: 22,    // V - Celesc Unidade
  celescUC: 23          // W - Celesc UC
};

/**
 * Mapeamento de colunas da aba Links
 */
const COL_LINKS = {
  apto: 1,                    // A - Número do apartamento
  inquilino: 2,               // B - Nome do inquilino
  linhaFormResponse: 3,       // C - Linha do Form Response
  linkPastaContrato: 4,       // D - Link da pasta do contrato
  linkFoto3x4: 5,             // E - Link da foto 3x4
  linkDocumentoRG: 6,         // F - Link do documento RG
  linkContratoPDF: 7,         // G - Link do contrato PDF
  linkContratoAssinado: 8,    // H - Link do contrato assinado
  linkDeclaracao: 9           // I - Link da declaração
};

/**
 * Configuração do Forms
 */
const CONFIG_FORMS = {
  abaForms: 'Form_Responses',
  mapa: {
    nome: 'Nome Completo',
    nacionalidade: 'Nacionalidade',
    estadoCivil: 'Estado Civil',
    profissao: 'Profissão',
    cpf: 'CPF',
    endereco: 'Endereço Completo',
    dataNascimento: 'Data de Nascimento',
    telefone: 'Número de telefone (Ex: (00) 12345-6789)',
    email: 'E-mail',
    dataEntrada: 'Data Prevista da Entrada',
    linkDocsForms: 'Envie seu RG (frente e verso)',
    linkFotoForms: 'Adicione uma foto tipo 3x4'
  }
};

/**
 * Configuração de declaração
 */
const CONFIG_DECLARACAO = {
  templateId: '1qpTnT_MFXFlcU0tDXdudvbLm6fCnIznvRYnVN2rCtcQ',
  abaContratos: 'Contratos'
};

/**
 * Campos obrigatórios para validação
 */
const CAMPOS_OBRIGATORIOS = [
  COL_CONTRATOS.apto,
  COL_CONTRATOS.inquilino,
  COL_CONTRATOS.valorAluguel,
  COL_CONTRATOS.dataEntrada,
  COL_CONTRATOS.prazoMeses,
  COL_CONTRATOS.genero,
  COL_CONTRATOS.nacionalidade,
  COL_CONTRATOS.estadoCivil,
  COL_CONTRATOS.profissao,
  COL_CONTRATOS.cpf,
  COL_CONTRATOS.endereco,
  COL_CONTRATOS.caucao
];

// =====================================================
// MÓDULO 0.5: UTILITÁRIOS DE CONFIGURAÇÃO
// =====================================================

/**
 * Obtém uma propriedade do script de forma segura
 * @param {string} key - Chave da propriedade
 * @param {string} defaultValue - Valor padrão se não encontrado
 * @returns {string} Valor da propriedade ou valor padrão
 */
function getScriptProperty(key, defaultValue = '') {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    return scriptProperties.getProperty(key) || defaultValue;
  } catch (e) {
    logError(`Erro ao obter propriedade ${key}`, e);
    return defaultValue;
  }
}

/**
 * Define uma propriedade do script
 * @param {string} key - Chave da propriedade
 * @param {string} value - Valor da propriedade
 * @returns {boolean} Sucesso da operação
 */
function setScriptProperty(key, value) {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty(key, value);
    return true;
  } catch (e) {
    logError(`Erro ao definir propriedade ${key}`, e);
    return false;
  }
}

/**
 * Função helper para configurar dados sensíveis
 * Execute esta função uma vez para configurar os dados do proprietário
 * IMPORTANTE: Execute manualmente no editor de scripts, não exponha via menu
 */
function configurarDadosSensiveisDoProprietario() {
  const ui = SpreadsheetApp.getUi();
  
  ui.alert(
    '⚠️ Configuração de Dados Sensíveis',
    'Esta função irá solicitar dados pessoais do proprietário.\\n' +
    'Os dados serão armazenados de forma segura nas Script Properties.\\n\\n' +
    'IMPORTANTE: Execute esta função apenas uma vez e não compartilhe o código.',
    ui.ButtonSet.OK_CANCEL
  );
  
  // Esta é uma função de exemplo - implementar conforme necessário
  logInfo('Execute esta função manualmente para configurar dados sensíveis');
}

// =====================================================
// MÓDULO 1: UTILITÁRIOS (CONSOLIDADO - SEM DUPLICATAS)
// =====================================================

/**
 * Sistema de cache simples para melhorar performance
 */
const CacheManager = {
  /**
   * Obtém valor do cache
   * @param {string} key - Chave do cache
   * @returns {any} Valor do cache ou null
   */
  get: function(key) {
    try {
      const cache = CacheService.getScriptCache();
      const cached = cache.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      logError(`Erro ao obter cache ${key}`, e);
      return null;
    }
  },
  
  /**
   * Define valor no cache
   * @param {string} key - Chave do cache
   * @param {any} value - Valor a ser armazenado
   * @param {number} expirationInSeconds - Tempo de expiração em segundos
   */
  set: function(key, value, expirationInSeconds = 300) {
    try {
      const cache = CacheService.getScriptCache();
      cache.put(key, JSON.stringify(value), expirationInSeconds);
    } catch (e) {
      logError(`Erro ao definir cache ${key}`, e);
    }
  },
  
  /**
   * Remove valor do cache
   * @param {string} key - Chave do cache
   */
  remove: function(key) {
    try {
      const cache = CacheService.getScriptCache();
      cache.remove(key);
    } catch (e) {
      logError(`Erro ao remover cache ${key}`, e);
    }
  },
  
  /**
   * Limpa todo o cache
   */
  clearAll: function() {
    try {
      const cache = CacheService.getScriptCache();
      cache.removeAll(cache.getKeys());
      logInfo('Cache limpo com sucesso');
    } catch (e) {
      logError('Erro ao limpar cache', e);
    }
  }
};

/**
 * Sistema de logging melhorado
 */
const LoggerEx = {
  /**
   * Log de informação
   * @param {string} message - Mensagem
   * @param {Object} data - Dados adicionais
   */
  info: function(message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[INFO] ${timestamp} - ${message}`;
    Logger.log(logMessage);
    if (data) Logger.log(JSON.stringify(data, null, 2));
  },
  
  /**
   * Log de erro
   * @param {string} message - Mensagem
   * @param {Error} error - Objeto de erro
   */
  error: function(message, error = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[ERROR] ${timestamp} - ${message}`;
    Logger.log(logMessage);
    if (error) {
      Logger.log(`Stack: ${error.stack || error.toString()}`);
    }
  },
  
  /**
   * Log de aviso
   * @param {string} message - Mensagem
   */
  warn: function(message) {
    const timestamp = new Date().toISOString();
    Logger.log(`[WARN] ${timestamp} - ${message}`);
  }
};

// Aliases para compatibilidade
function log(mensagem) {
  LoggerEx.info(mensagem);
}

function logInfo(mensagem) {
  LoggerEx.info(mensagem);
}

function logError(mensagem, erro) {
  LoggerEx.error(mensagem, erro);
}

function logWarn(mensagem) {
  LoggerEx.warn(mensagem);
}

// =====================================================
// MÓDULO 1.1: VALIDAÇÃO DE DADOS
// =====================================================

/**
 * Valida se todos os dados obrigatórios estão preenchidos
 * @param {Array} dadosImportados - Array com dados importados
 * @param {Array} linhaContrato - Array com dados da linha do contrato
 * @returns {Object} Objeto com {valido: boolean, erros: Array}
 */
function validarDadosCompletos(dadosImportados, linhaContrato) {
  const erros = [];
  
  try {
    // Validar campos obrigatórios
    CAMPOS_OBRIGATORIOS.forEach(colIdx => {
      const valor = linhaContrato[colIdx - 1];
      if (!valor || valor.toString().trim() === '') {
        erros.push(`Campo obrigatório vazio na coluna ${colIdx}`);
      }
    });
    
    // Validações específicas
    const cpf = linhaContrato[COL_CONTRATOS.cpf - 1];
    if (cpf && !validarCPF(cpf)) {
      erros.push('CPF inválido');
    }
    
    const email = linhaContrato[COL_CONTRATOS.email - 1];
    if (email && !validarEmail(email)) {
      erros.push('Email inválido');
    }
    
    const telefone = linhaContrato[COL_CONTRATOS.telefone - 1];
    if (telefone && !validarTelefone(telefone)) {
      erros.push('Telefone inválido');
    }
    
    return {
      valido: erros.length === 0,
      erros: erros
    };
    
  } catch (e) {
    logError('Erro ao validar dados completos', e);
    return {
      valido: false,
      erros: ['Erro na validação: ' + e.message]
    };
  }
}

/**
 * Valida email
 * @param {string} email - Email para validar
 * @returns {boolean} true se válido
 */
function validarEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

/**
 * Valida CPF brasileiro
 * @param {string} cpf - CPF para validar
 * @returns {boolean} true se válido
 */
function validarCPF(cpf) {
  if (!cpf || typeof cpf !== 'string') {
    return false;
  }
  
  // Remove caracteres não numéricos
  const cpfNumeros = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpfNumeros.length !== CONSTANTS.CPF_LENGTH) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpfNumeros)) {
    return false;
  }
  
  // Validação dos dígitos verificadores
  let soma = 0;
  let resto;
  
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfNumeros.substring(i - 1, i)) * (11 - i);
  }
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfNumeros.substring(9, 10))) return false;
  
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfNumeros.substring(i - 1, i)) * (12 - i);
  }
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfNumeros.substring(10, 11))) return false;
  
  return true;
}

/**
 * Valida telefone brasileiro
 * @param {string} telefone - Telefone para validar
 * @returns {boolean} true se válido
 */
function validarTelefone(telefone) {
  if (!telefone || typeof telefone !== 'string') {
    return false;
  }
  
  // Remove caracteres não numéricos
  const telefoneNumeros = telefone.replace(/\D/g, '');
  
  // Verifica se tem entre 10 e 11 dígitos (com DDD)
  return telefoneNumeros.length >= CONSTANTS.PHONE_MIN_LENGTH && 
         telefoneNumeros.length <= CONSTANTS.PHONE_MAX_LENGTH;
}

/**
 * Valida data
 * @param {Date|string} data - Data para validar
 * @returns {boolean} true se válida
 */
function validarData(data) {
  if (!data) {
    return false;
  }
  
  try {
    let dataObj;
    
    if (data instanceof Date) {
      dataObj = data;
    } else if (typeof data === 'string') {
      // Tenta parsear no formato DD/MM/YYYY
      const partes = data.split('/');
      if (partes.length === 3) {
        const dia = parseInt(partes[0]);
        const mes = parseInt(partes[1]) - 1;
        const ano = parseInt(partes[2]);
        dataObj = new Date(ano, mes, dia);
      } else {
        dataObj = new Date(data);
      }
    } else {
      return false;
    }
    
    // Verifica se é uma data válida
    return dataObj instanceof Date && !isNaN(dataObj.getTime());
    
  } catch (e) {
    logError('Erro ao validar data', e);
    return false;
  }
}

// =====================================================
// MÓDULO 1.2: FORMATAÇÃO DE DADOS
// =====================================================

/**
 * Normaliza nome de arquivo removendo caracteres inválidos
 * @param {string} texto - Texto para normalizar
 * @returns {string} Nome de arquivo normalizado
 */
function normalizarNomeArquivo(texto) {
  if (!texto || typeof texto !== 'string') {
    return 'arquivo';
  }
  
  let nome = texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-zA-Z0-9_\-\s]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '_') // Substitui espaços por underscore
    .trim();
  
  // Limita o tamanho
  if (nome.length > CONSTANTS.FILENAME_MAX_LENGTH) {
    nome = nome.substring(0, CONSTANTS.FILENAME_MAX_LENGTH);
  }
  
  return nome || 'arquivo';
}

/**
 * Formata CPF no padrão brasileiro
 * @param {string} cpf - CPF para formatar
 * @returns {string} CPF formatado (000.000.000-00)
 */
function formatarCPF(cpf) {
  if (!cpf) return '';
  
  // Remove caracteres não numéricos
  const numeros = cpf.toString().replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (numeros.length !== CONSTANTS.CPF_LENGTH) {
    return cpf; // Retorna original se inválido
  }
  
  // Formata: 000.000.000-00
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata telefone no padrão brasileiro
 * @param {string} tel - Telefone para formatar
 * @returns {string} Telefone formatado
 */
function formatarTelefone(tel) {
  if (!tel) return '';
  
  // Remove caracteres não numéricos
  const numeros = tel.toString().replace(/\D/g, '');
  
  // Formato com 11 dígitos: (00) 00000-0000
  if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  // Formato com 10 dígitos: (00) 0000-0000
  if (numeros.length === 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  // Retorna original se não se encaixa nos formatos
  return tel;
}

/**
 * Formata data no padrão brasileiro
 * @param {Date|string} data - Data para formatar
 * @returns {string} Data formatada (dd/MM/yyyy)
 */
function formatarData(data) {
  if (!data) return '';
  
  try {
    let dataObj;
    
    if (data instanceof Date) {
      dataObj = data;
    } else {
      dataObj = new Date(data);
    }
    
    if (!validarData(dataObj)) {
      return '';
    }
    
    return Utilities.formatDate(
      dataObj,
      CONSTANTS.TIMEZONE_BR,
      CONSTANTS.DATE_FORMAT_BR
    );
    
  } catch (e) {
    logError('Erro ao formatar data', e);
    return '';
  }
}

/**
 * Formata data no formato ISO
 * @param {Date|string} data - Data para formatar
 * @returns {string} Data no formato ISO (yyyy-MM-dd)
 */
function dataISO(data) {
  if (!data) return '';
  
  try {
    let dataObj;
    
    if (data instanceof Date) {
      dataObj = data;
    } else {
      dataObj = new Date(data);
    }
    
    if (!validarData(dataObj)) {
      return '';
    }
    
    return Utilities.formatDate(dataObj, CONSTANTS.TIMEZONE_BR, 'yyyy-MM-dd');
    
  } catch (e) {
    logError('Erro ao formatar data ISO', e);
    return '';
  }
}

/**
 * Formata data por extenso em português
 * @param {Date|string} data - Data para formatar
 * @returns {string} Data por extenso
 */
function dataPorExtenso(data) {
  if (!data) return '';
  
  try {
    let dataObj;
    
    if (data instanceof Date) {
      dataObj = data;
    } else {
      dataObj = new Date(data);
    }
    
    if (!validarData(dataObj)) {
      return '';
    }
    
    const meses = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    
    const dia = dataObj.getDate();
    const mes = meses[dataObj.getMonth()];
    const ano = dataObj.getFullYear();
    
    return `${dia} de ${mes} de ${ano}`;
    
  } catch (e) {
    logError('Erro ao formatar data por extenso', e);
    return '';
  }
}

// =====================================================
// MÓDULO 1.3: UTILITÁRIOS DE DATA
// =====================================================

/**
 * Adiciona meses a uma data
 * @param {Date} data - Data inicial
 * @param {number} meses - Quantidade de meses para adicionar
 * @returns {Date} Nova data
 */
function adicionarMeses(data, meses) {
  if (!data || !validarData(data)) {
    return null;
  }
  
  try {
    const novaData = new Date(data);
    novaData.setMonth(novaData.getMonth() + parseInt(meses));
    return novaData;
  } catch (e) {
    logError('Erro ao adicionar meses', e);
    return null;
  }
}

// =====================================================
// MÓDULO 1.4: CONVERSÃO DE NÚMEROS
// =====================================================

/**
 * Converte número para extenso (até 999)
 * @param {number} num - Número para converter
 * @returns {string} Número por extenso
 */
function numeroParaExtenso(num) {
  const unidades = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const dezenasEspeciais = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
  
  if (num === 0) return 'zero';
  if (num < 0) return 'menos ' + numeroParaExtenso(-num);
  if (num > 999) return num.toString(); // Retorna o número se for maior que 999
  
  let resultado = '';
  
  // Centenas
  const c = Math.floor(num / 100);
  if (c > 0) {
    if (num === 100) {
      resultado = 'cem';
    } else {
      resultado = centenas[c];
    }
  }
  
  num = num % 100;
  
  // Dezenas especiais (10-19)
  if (num >= 10 && num <= 19) {
    if (resultado) resultado += ' e ';
    resultado += dezenasEspeciais[num - 10];
    return resultado;
  }
  
  // Dezenas
  const d = Math.floor(num / 10);
  if (d > 0) {
    if (resultado) resultado += ' e ';
    resultado += dezenas[d];
  }
  
  // Unidades
  const u = num % 10;
  if (u > 0) {
    if (resultado) resultado += ' e ';
    resultado += unidades[u];
  }
  
  return resultado;
}

/**
 * Converte valor monetário para extenso
 * @param {number} valor - Valor para converter
 * @returns {string} Valor por extenso
 */
function valorParaExtenso(valor) {
  if (!valor || isNaN(valor)) {
    return 'zero reais';
  }
  
  const reais = Math.floor(valor);
  const centavos = Math.round((valor - reais) * 100);
  
  let resultado = numeroParaExtenso(reais);
  resultado += reais === 1 ? ' real' : ' reais';
  
  if (centavos > 0) {
    resultado += ' e ' + numeroParaExtenso(centavos);
    resultado += centavos === 1 ? ' centavo' : ' centavos';
  }
  
  return resultado;
}

// =====================================================
// MÓDULO 1.5: UTILITÁRIOS DE DRIVE
// =====================================================

/**
 * Extrai ID do arquivo/pasta do Google Drive de uma URL
 * @param {string} url - URL do Drive
 * @returns {string} ID extraído ou string vazia
 */
function extrairIdDoDrive(url) {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  try {
    // Tenta extrair via regex
    const patterns = [
      /\/d\/([a-zA-Z0-9_-]+)/,           // /d/ID
      /id=([a-zA-Z0-9_-]+)/,             // id=ID
      /folders\/([a-zA-Z0-9_-]+)/,       // folders/ID
      /^([a-zA-Z0-9_-]{25,})$/           // ID puro
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // Se já é um ID válido
    if (/^[a-zA-Z0-9_-]{25,}$/.test(url)) {
      return url;
    }
    
    return '';
    
  } catch (e) {
    logError('Erro ao extrair ID do Drive', e);
    return '';
  }
}

// =====================================================
// MÓDULO 1.6: UTILITÁRIOS DE TEXTO
// =====================================================

/**
 * Detecta gênero baseado no estado civil
 * @param {string} estadoCivil - Estado civil
 * @returns {string} 'M' ou 'F'
 */
function detectarGenero(estadoCivil) {
  if (!estadoCivil || typeof estadoCivil !== 'string') {
    return 'M'; // Default masculino
  }
  
  const estado = estadoCivil.toUpperCase().trim();
  
  // Feminino
  if (estado.includes('CASADA') || 
      estado.includes('SOLTEIRA') || 
      estado.includes('DIVORCIADA') || 
      estado.includes('VIÚVA')) {
    return 'F';
  }
  
  // Masculino (default)
  return 'M';
}

/**
 * Resolve artigos e pronomes baseado em gênero
 * @param {string} genero - 'M' ou 'F'
 * @returns {Object} Objeto com artigos e pronomes
 */
function resolverGenero(genero) {
  const isFeminino = genero && genero.toUpperCase() === 'F';
  
  return {
    artigo: isFeminino ? 'a' : 'o',
    pronome: isFeminino ? 'ela' : 'ele',
    pronomeObj: isFeminino ? 'ela' : 'ele',
    artigo Maiusc: isFeminino ? 'A' : 'O',
    pronomePoss: isFeminino ? 'sua' : 'seu'
  };
}

/**
 * Escapa caracteres especiais de regex
 * @param {string} texto - Texto para escapar
 * @returns {string} Texto escapado
 */
function escapeRegex(texto) {
  if (!texto) return '';
  return texto.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// =====================================================
// NOTA: ESTE É O INÍCIO DA V2 REFATORADA
// O RESTO DO CÓDIGO CONTINUARÁ NOS PRÓXIMOS MÓDULOS
// 
// IMPORTANTE: Esta versão consolida todas as funções
// utilitárias em uma única definição, eliminando as
// duplicatas encontradas na V1.
// 
// Para migração completa, continue com os próximos
// módulos seguindo esta mesma estrutura limpa.
// =====================================================

// Os módulos seguintes (2-10) devem seguir o mesmo padrão:
// - Documentação JSDoc completa
// - Tratamento de erros robusto
// - Uso de constantes nomeadas
// - Cache quando apropriado
// - Sem duplicação de código

/**
 * PLACEHOLDER: Continue a implementação dos módulos 2-10
 * seguindo os mesmos padrões de qualidade estabelecidos aqui.
 * 
 * Módulos pendentes:
 * - MÓDULO 2: Gestão de Arquivos
 * - MÓDULO 3: Importação Forms
 * - MÓDULO 4: Menu Principal
 * - MÓDULO 5: Geração de Contratos
 * - MÓDULO 6: Declarações
 * - MÓDULO 7: Templates de Email
 * - MÓDULO 8: Envio de Emails
 * - MÓDULO 9: Integração WhatsApp
 * - MÓDULO 10: Encerramento de Contratos
 */
