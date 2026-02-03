/**
 * LISTAR APARTAMENTOS PARA O DASHBOARD
 * Retorna array de objetos: { apto, inquilino, valor, dataEntrada, prazoMeses, status, linkPasta }
 */
function listarApartamentosParaDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName(CONFIG_CONTRATOS.abaContratos);
  if (!aba) return [];
  const dados = aba.getDataRange().getValues();
  const resultado = [];
  for (let i = 1; i < dados.length; i++) {
    const linha = dados[i];
    resultado.push({
      apto: linha[COL_CONTRATOS.apto - 1] || '',
      inquilino: linha[COL_CONTRATOS.inquilino - 1] || '',
      valor: linha[COL_CONTRATOS.valorAluguel - 1] || '',
      dataEntrada: linha[COL_CONTRATOS.dataEntrada - 1] ? formatarData(linha[COL_CONTRATOS.dataEntrada - 1]) : '',
      prazoMeses: linha[COL_CONTRATOS.prazoMeses - 1] || '',
      status: linha[COL_CONTRATOS.status - 1] || '',
      linkPasta: linha[COL_CONTRATOS.linkPasta - 1] || ''
    });
  }
  return resultado;
}

/**
 * ATUALIZAR STATUS DO APARTAMENTO
 * apto: string/number, novoStatus: string
 */
function atualizarStatusApartamento(apto, novoStatus) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const aba = ss.getSheetByName(CONFIG_CONTRATOS.abaContratos);
    const dados = aba.getDataRange().getValues();
    for (let i = 1; i < dados.length; i++) {
      const valorApto = (dados[i][COL_CONTRATOS.apto - 1] || '').toString();
      if (valorApto === String(apto)) {
        const linhaIndex = i + 1;
        aba.getRange(linhaIndex, COL_CONTRATOS.status).setValue(novoStatus);

        // registrar auditoria se disponível
        try {
          const inquilino = dados[i][COL_CONTRATOS.inquilino - 1] || '';
          if (typeof registrarAuditoriaEnvio === 'function') {
            registrarAuditoriaEnvio(apto, inquilino, `STATUS ATUALIZADO → ${novoStatus}`);
          }
        } catch (e) {
          Logger.log('Aviso: não foi possível registrar auditoria: ' + e.message);
        }

        return { sucesso: true };
      }
    }
    return { sucesso: false, erro: 'Apartamento não encontrado' };
  } catch (e) {
    Logger.log('Erro atualizarStatusApartamento: ' + e.message);
    return { sucesso: false, erro: e.message };
  }
}

/**
 * CRIAR OU ATUALIZAR CONTRATO (usado pelo modal)
 * dados: { apto, inquilino, valor, dataEntrada (yyyy-mm-dd), prazoMeses }
 */
function criarOuAtualizarContratoDashboard(dados) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const aba = ss.getSheetByName(CONFIG_CONTRATOS.abaContratos);
    if (!aba) throw new Error('Aba Contratos não encontrada');

    const valores = aba.getDataRange().getValues();
    // procurar apartamento
    for (let i = 1; i < valores.length; i++) {
      const a = (valores[i][COL_CONTRATOS.apto - 1] || '').toString();
      if (a === String(dados.apto)) {
        const linhaIndex = i + 1;
        // atualiza campos principais
        aba.getRange(linhaIndex, COL_CONTRATOS.inquilino).setValue((dados.inquilino || '').toString().toUpperCase());
        aba.getRange(linhaIndex, COL_CONTRATOS.valorAluguel).setValue(dados.valor || '');
        if (dados.dataEntrada) {
          const dt = new Date(dados.dataEntrada);
          if (!isNaN(dt.getTime())) aba.getRange(linhaIndex, COL_CONTRATOS.dataEntrada).setValue(dt);
        }
        if (dados.prazoMeses) aba.getRange(linhaIndex, COL_CONTRATOS.prazoMeses).setValue(Number(dados.prazoMeses));
        // marca como ocupado
        aba.getRange(linhaIndex, COL_CONTRATOS.status).setValue('Ocupado');

        // registrar auditoria
        try {
          if (typeof registrarAuditoriaEnvio === 'function') {
            registrarAuditoriaEnvio(dados.apto, dados.inquilino, 'CONTRATO ATUALIZADO PELO DASHBOARD');
          }
        } catch (e) { Logger.log('Aviso auditoria: '+e.message); }

        return { sucesso: true, atualizado: true };
      }
    }

    // se não achou, acrescenta nova linha ao final com estrutura mínima
    const novaLinha = [];
    const totalCols = aba.getLastColumn();
    for (let c = 0; c < totalCols; c++) novaLinha.push('');
    novaLinha[COL_CONTRATOS.apto - 1] = String(dados.apto);
    novaLinha[COL_CONTRATOS.inquilino - 1] = (dados.inquilino || '').toString().toUpperCase();
    novaLinha[COL_CONTRATOS.valorAluguel - 1] = dados.valor || '';
    if (dados.dataEntrada) {
      const dt = new Date(dados.dataEntrada);
      if (!isNaN(dt.getTime())) novaLinha[COL_CONTRATOS.dataEntrada - 1] = dt;
    }
    if (dados.prazoMeses) novaLinha[COL_CONTRATOS.prazoMeses - 1] = Number(dados.prazoMeses);
    novaLinha[COL_CONTRATOS.status - 1] = 'Ocupado';

    aba.appendRow(novaLinha);

    try {
      if (typeof registrarAuditoriaEnvio === 'function') {
        registrarAuditoriaEnvio(dados.apto, dados.inquilino, 'CONTRATO CRIADO PELO DASHBOARD');
      }
    } catch (e) { Logger.log('Aviso auditoria: '+e.message); }

    return { sucesso: true, criado: true };
  } catch (e) {
    Logger.log('Erro criarOuAtualizarContratoDashboard: ' + e.message);
    return { sucesso: false, erro: e.message };
  }
}

/**
 * ABRIR PASTA DO APARTAMENTO (retorna URL se achar linkPasta na linha)
 */
function abrirPastaDoApartamento(apto) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const aba = ss.getSheetByName(CONFIG_CONTRATOS.abaContratos);
    const dados = aba.getDataRange().getValues();
    for (let i = 1; i < dados.length; i++) {
      const a = (dados[i][COL_CONTRATOS.apto - 1] || '').toString();
      if (a === String(apto)) {
        const link = dados[i][COL_CONTRATOS.linkPasta - 1] || '';
        if (link && link.toString().includes('folders')) return link;
        return '';
      }
    }
    return '';
  } catch (e) {
    Logger.log('Erro abrirPastaDoApartamento: ' + e.message);
    return '';
  }
}

/**
 * ABRIR PLANILHA (retorna URL)
 */
function abrirPlanilha() {
  return SpreadsheetApp.getActiveSpreadsheet().getUrl();
}

/**
 * ABRIR PAINEL (chamado pelo menu)
 */
function abrirPainelDashboard() {
  const html = HtmlService.createHtmlOutputFromFile('painel_base250')
    .setWidth(1200)
    .setHeight(800);
  SpreadsheetApp.getUi().showModelessDialog(html, 'BASE250 — Painel');
}

/**
 * FUNÇÃO QUE ADICIONA ITEM AO MENU (chame isso dentro do seu onOpen principal)
 */
function menuDashboard_onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('BASE250')
      .addItem('🏢 Abrir Painel Administrativo','abrirPainelAdministrativo')
      .addItem('📊 Abrir Painel Unificado','abrirPainelDashboard')
      .addItem('🚀 Abrir Painel Integrado','abrirPainelIntegrado')
      .addSeparator()
      .addItem('📋 Abrir Planilha','abrirPlanilha')
      .addToUi();
  } catch (e) {
    Logger.log('menuDashboard_onOpen error: ' + e.message);
  }
}