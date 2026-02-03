// =====================================================
// BASE250 - SISTEMA COMPLETO DE GESTÃO DE IMÓVEIS
// Ordem: M00 → M01 → M02 → ... → M10 → INTEGRAÇÃO
// =====================================================

// =====================================================
// ▼▼▼ MÓDULO 0: CONFIGURAÇÕES GLOBAIS ▼▼▼
// =====================================================

const CONFIG = {
  adminEmail: 'eng.diogoj@gmail.com',
  proprietarioEmail: 'floripamoso@gmail.com',
  
  proprietario: {
    nome: 'JUCEMAR JOÃO DA SILVA',
    cpf: '399.328.349-04',
    estadoCivil: "CASADO",
    profissao: "COMERCIANTE",
    endereco: "Servidão Joaquim Soares, nº 250, Florianópolis/SC",
    telefone: '(48) 99935-2627',
    pix: "48999352627",
    banco: "Banco do Brasil",
    agencia: "16-7",
    conta: "151113-0"
  }
};

const CONFIG_EMAIL = {
  logoId: '1uSaRNGhOzYcWbhs-4Irj01EadhmVBNAw',
  assinaturaRodape: 'BASE250 – Residencial Itacorubi'
};

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

const COL_CONTRATOS = {
  apto: 1,
  inquilino: 2,
  valorAluguel: 3,
  avanco: 4,
  status: 5,
  linhaForm: 6,
  linkPasta: 7,
  dataEntrada: 8,
  prazoMeses: 9,
  dataFim: 10,
  genero: 11,
  telefone: 12,
  email: 13,
  nacionalidade: 14,
  estadoCivil: 15,
  profissao: 16,
  cpf: 17,
  endereco: 18,
  dataNascimento: 19,
  dataEmissao: 20,
  caucao: 21,
  celescUnidade: 22,
  celescUC: 23
};

const COL_LINKS = {
  apto: 1,
  inquilino: 2,
  linhaFormResponse: 3,
  linkPastaContrato: 4,
  linkFoto3x4: 5,
  linkDocumentoRG: 6,
  linkContratoPDF: 7,
  linkContratoAssinado: 8,
  linkDeclaracao: 9
};

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

const CONFIG_DECLARACAO = {
  templateId: '1qpTnT_MFXFlcU0tDXdudvbLm6fCnIznvRYnVN2rCtcQ',
  abaContratos: 'Contratos'
};

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
// ▼▼▼ MÓDULO 3: IMPORTAÇÃO FORMS ▼▼▼
// =====================================================

function menuImportarDoForms() {
  const ui = SpreadsheetApp.getUi();

  const rApto = ui.prompt(
    '📥 Importar dados do Forms',
    'Digite os 3 dígitos do apartamento:',
    ui.ButtonSet.OK_CANCEL
  );
  if (rApto.getSelectedButton() !== ui.Button.OK) return;

  const apto = rApto.getResponseText().trim();
  if (!/^\d{3}$/.test(apto) && !/^Studio\s*\d{3}$/i.test(apto)) {
    ui.alert('Erro', 'Apartamento inválido. Use 3 dígitos (ex: 101) ou Studio 201', ui.ButtonSet.OK);
    return;
  }

  const rLinha = ui.prompt(
    '📥 Importar dados do Forms',
    'Digite o número da LINHA da aba Form_Responses:',
    ui.ButtonSet.OK_CANCEL
  );
  if (rLinha.getSelectedButton() !== ui.Button.OK) return;

  const linhaForms = Number(rLinha.getResponseText());
  if (!linhaForms || linhaForms < 2) {
    ui.alert('Erro', 'Linha inválida. O mínimo é 2.', ui.ButtonSet.OK);
    return;
  }

  const rTipo = ui.prompt(
    'Tipo de operação',
    'Digite:\n1 = Novo Inquilino\n2 = Revisão',
    ui.ButtonSet.OK_CANCEL
  );
  if (rTipo.getSelectedButton() !== ui.Button.OK) return;

  const tipoFluxo = rTipo.getResponseText().trim();
  if (!['1','2'].includes(tipoFluxo)) {
    ui.alert('Erro', 'Informe 1 ou 2.', ui.ButtonSet.OK);
    return;
  }

  const isNovo = tipoFluxo === '1';

  try {
    importarLinhaFormsParaContrato(apto, linhaForms, isNovo);
    
    ui.alert(
      '✅ Sucesso',
      `Apartamento ${apto} atualizado com dados da linha ${linhaForms}.`,
      ui.ButtonSet.OK
    );
  } catch (err) {
    ui.alert(
      '❌ Erro Inesperado',
      `Erro: ${err.message}\n\nVerifique o log para mais detalhes.`,
      ui.ButtonSet.OK
    );
    Logger.log(`❌ Erro na importação: ${err.message}`);
  }
}

function menuDiagnosticarForms() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const abaForms = ss.getSheetByName(CONFIG_FORMS.abaForms);
  
  if (!abaForms) {
    ui.alert('Erro', 'Aba Form_Responses não encontrada.', ui.ButtonSet.OK);
    return;
  }
  
  const cabForms = abaForms.getRange(1, 1, 1, abaForms.getLastColumn()).getValues()[0];
  
  let diagnostico = '🔍 DIAGNÓSTICO DOS CABEÇALHOS DO FORMS\n';
  diagnostico += '═══════════════════════════════════════════════════\n\n';
  
  diagnostico += '📋 CABEÇALHOS ENCONTRADOS NA ABA Form_Responses:\n';
  diagnostico += '───────────────────────────────────────────────────\n';
  
  cabForms.forEach((cab, idx) => {
    const colLetra = String.fromCharCode(65 + idx);
    diagnostico += `${colLetra}. "${cab}"\n`;
  });
  
  diagnostico += '\n═══════════════════════════════════════════════════\n';
  diagnostico += '🔗 MAPEAMENTO CONFIGURADO (CONFIG_FORMS.mapa):\n';
  diagnostico += '───────────────────────────────────────────────────\n';
  
  const camposEncontrados = [];
  const camposNaoEncontrados = [];
  
  for (const [campo, titulo] of Object.entries(CONFIG_FORMS.mapa)) {
    const idx = cabForms.indexOf(titulo);
    const idxFlexivel = buscarCabecalhoFlexivel(cabForms, titulo);
    
    if (idx !== -1) {
      const colLetra = String.fromCharCode(65 + idx);
      camposEncontrados.push(`✅ ${campo}: "${titulo}" → Coluna ${colLetra}`);
    } else if (idxFlexivel !== -1) {
      const colLetra = String.fromCharCode(65 + idxFlexivel);
      const encontrado = cabForms[idxFlexivel];
      camposEncontrados.push(`⚠️ ${campo}: "${titulo}" → Encontrado similar: "${encontrado}" (Coluna ${colLetra})`);
    } else {
      camposNaoEncontrados.push(`❌ ${campo}: "${titulo}" → NÃO ENCONTRADO`);
    }
  }
  
  camposEncontrados.forEach(c => diagnostico += c + '\n');
  
  if (camposNaoEncontrados.length > 0) {
    diagnostico += '\n⚠️ CAMPOS NÃO ENCONTRADOS:\n';
    diagnostico += '───────────────────────────────────────────────────\n';
    camposNaoEncontrados.forEach(c => diagnostico += c + '\n');
  }
  
  diagnostico += '\n═══════════════════════════════════════════════════\n';
  
  if (camposNaoEncontrados.length > 0) {
    diagnostico += '\n💡 RECOMENDAÇÃO:\n';
    diagnostico += 'Os campos não encontrados podem ter nomes diferentes no Forms.\n';
    diagnostico += 'Compare os nomes esperados com os cabeçalhos encontrados acima.\n';
  } else {
    diagnostico += '\n✅ Todos os campos do mapeamento foram encontrados!\n';
  }
  
  ui.alert('🔍 Diagnóstico do Forms', diagnostico, ui.ButtonSet.OK);
  Logger.log(diagnostico);
}

function buscarCabecalhoFlexivel(cabecalhos, titulo) {
  const normalizar = (str) => {
    if (!str) return '';
    return str.toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };
  
  const tituloNorm = normalizar(titulo);
  
  for (let i = 0; i < cabecalhos.length; i++) {
    const cabNorm = normalizar(cabecalhos[i]);
    if (cabNorm === tituloNorm) {
      return i;
    }
  }
  
  for (let i = 0; i < cabecalhos.length; i++) {
    const cabNorm = normalizar(cabecalhos[i]);
    if (cabNorm.includes(tituloNorm) || tituloNorm.includes(cabNorm)) {
      return i;
    }
  }
  
  return -1;
}

function importarLinhaFormsParaContrato(apto, linhaForms, isNovo) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const abaForms = ss.getSheetByName(CONFIG_FORMS.abaForms);
  const abaContratos = ss.getSheetByName(CONFIG_CONTRATOS.abaContratos);
  const abaLinks = ss.getSheetByName(CONFIG_CONTRATOS.abaLinks);

  if (!abaForms || !abaContratos || !abaLinks) {
    throw new Error('Abas Form_Responses, Contratos ou Links não encontradas.');
  }

  const cabForms = abaForms.getRange(1, 1, 1, abaForms.getLastColumn()).getValues()[0];
  const dadosForms = abaForms.getRange(linhaForms, 1, 1, cabForms.length).getValues()[0];

  const ler = (campo) => {
    const titulo = CONFIG_FORMS.mapa[campo];
    if (!titulo) return '';
    
    let idx = cabForms.indexOf(titulo);
    
    if (idx === -1) {
      idx = buscarCabecalhoFlexivel(cabForms, titulo);
      if (idx !== -1) {
        Logger.log(`⚠️ Campo "${campo}": usado cabeçalho similar "${cabForms[idx]}" ao invés de "${titulo}"`);
      }
    }
    
    if (idx === -1) {
      Logger.log(`❌ Campo "${campo}": cabeçalho "${titulo}" NÃO ENCONTRADO`);
      return '';
    }
    
    const valor = dadosForms[idx];
    Logger.log(`✅ Campo "${campo}": encontrado na coluna ${idx + 1}, valor: "${valor}"`);
    return valor;
  };

  const dados = {
    nome: ler('nome')?.toString().trim(),
    nacionalidade: ler('nacionalidade'),
    estadoCivil: ler('estadoCivil'),
    profissao: ler('profissao'),
    cpf: ler('cpf')?.toString().replace(/\D/g, ''),
    endereco: ler('endereco'),
    dataNascimento: ler('dataNascimento'),
    telefone: ler('telefone'),
    email: ler('email')?.toString().trim().toLowerCase(),
    dataEntrada: ler('dataEntrada'),
    linkDocsForms: ler('linkDocsForms'),
    linkFotoForms: ler('linkFotoForms')
  };

  Logger.log('═══════════════════════════════════════════════════');
  Logger.log('📋 DADOS LIDOS DO FORMS:');
  Logger.log('───────────────────────────────────────────────────');
  for (const [chave, valor] of Object.entries(dados)) {
    Logger.log(`${chave}: "${valor || '(vazio)'}"`);
  }
  Logger.log('═══════════════════════════════════════════════════');

  const valores = abaContratos.getDataRange().getValues();

  let linhaContrato = -1;
  for (let i = 1; i < valores.length; i++) {
    if ((valores[i][0] || '').toString().includes(apto)) {
      linhaContrato = i + 1;
      break;
    }
  }

  if (linhaContrato === -1) {
    throw new Error('Apartamento não encontrado na aba Contratos.');
  }

  const backup = {
    linha: linhaContrato,
    inquilino: abaContratos.getRange(linhaContrato, COL_CONTRATOS.inquilino).getValue(),
    nacionalidade: abaContratos.getRange(linhaContrato, COL_CONTRATOS.nacionalidade).getValue(),
    estadoCivil: abaContratos.getRange(linhaContrato, COL_CONTRATOS.estadoCivil).getValue(),
    profissao: abaContratos.getRange(linhaContrato, COL_CONTRATOS.profissao).getValue(),
    cpf: abaContratos.getRange(linhaContrato, COL_CONTRATOS.cpf).getValue(),
    dataNascimento: abaContratos.getRange(linhaContrato, COL_CONTRATOS.dataNascimento).getValue(),
    endereco: abaContratos.getRange(linhaContrato, COL_CONTRATOS.endereco).getValue(),
    telefone: abaContratos.getRange(linhaContrato, COL_CONTRATOS.telefone).getValue(),
    email: abaContratos.getRange(linhaContrato, COL_CONTRATOS.email).getValue(),
    dataEntrada: abaContratos.getRange(linhaContrato, COL_CONTRATOS.dataEntrada).getValue(),
    linkPasta: abaContratos.getRange(linhaContrato, COL_CONTRATOS.linkPasta).getValue(),
    linhaForm: abaContratos.getRange(linhaContrato, COL_CONTRATOS.linhaForm).getValue()
  };
  
  const backupLinks = {
    linkFoto3x4: abaLinks.getRange(linhaContrato, COL_LINKS.linkFoto3x4).getValue(),
    linkDocumentoRG: abaLinks.getRange(linhaContrato, COL_LINKS.linkDocumentoRG).getValue()
  };
  
  Logger.log(`✅ Backup criado para linha ${linhaContrato}`);

  if (!isNovo) {
    const relatorioValidacao = validarDadosCompletos(dados, valores[linhaContrato - 1]);
    
    if (relatorioValidacao.temErros) {
      ui.alert(
        '⚠️ Revisão - Dados Incompletos',
        relatorioValidacao.mensagem,
        ui.ButtonSet.OK
      );
      
      const continuar = ui.alert(
        'Continuar?',
        'Deseja continuar a revisão mesmo com dados incompletos?',
        ui.ButtonSet.YES_NO
      );
      
      if (continuar !== ui.Button.YES) {
        throw new Error('Revisão cancelada pelo usuário.');
      }
    } else {
      ui.alert(
        '✅ Revisão - Dados Completos',
        relatorioValidacao.mensagem,
        ui.ButtonSet.OK
      );
    }
  }

  const pastaExistente = valores[linhaContrato - 1][COL_CONTRATOS.linkPasta - 1];
  let linkPastaContrato;
  let pastaContrato;

  try {
    if (pastaExistente && pastaExistente.includes('/folders/')) {
      linkPastaContrato = pastaExistente;
      const pastaId = linkPastaContrato.split('/folders/')[1].split('?')[0];
      pastaContrato = DriveApp.getFolderById(pastaId);
      Logger.log(`✅ Pasta já existe: ${linkPastaContrato}`);
    } else {
      const raiz = DriveApp.getFolderById(CONFIG_CONTRATOS.pastaRaizId);

      const nomePastaApto = `${apto}`;
      const pastaApto = raiz.getFoldersByName(nomePastaApto).hasNext()
        ? raiz.getFoldersByName(nomePastaApto).next()
        : raiz.createFolder(nomePastaApto);

      const hoje = new Date();
      const anoMes = Utilities.formatDate(hoje, 'GMT-3', 'yyyy.MM');
      const nomeInquilinoNorm = normalizarNomeArquivo(dados.nome);
      const nomePastaContrato = `${anoMes} - ${nomeInquilinoNorm}`;
      
      pastaContrato = pastaApto.getFoldersByName(nomePastaContrato).hasNext()
        ? pastaApto.getFoldersByName(nomePastaContrato).next()
        : pastaApto.createFolder(nomePastaContrato);

      linkPastaContrato = pastaContrato.getUrl();
      Logger.log(`✅ Pasta criada: ${linkPastaContrato}`);
    }
  } catch (errPasta) {
    const resposta = ui.alert(
      '⚠️ Erro ao criar/acessar pasta',
      `Erro: ${errPasta.message}\n\n` +
      `O que deseja fazer?\n` +
      `• SIM = Abortar operação (nenhuma alteração será feita)\n` +
      `• NÃO = Continuar sem criar pasta`,
      ui.ButtonSet.YES_NO
    );
    
    if (resposta === ui.Button.YES) {
      throw new Error('Operação abortada pelo usuário.');
    }
    
    linkPastaContrato = pastaExistente || '';
    pastaContrato = null;
  }

  let linkFoto3x4 = '';
  let linkDocumento = '';

  if (dados.linkFotoForms && pastaContrato) {
    try {
      linkFoto3x4 = baixarArquivoForms(
        dados.linkFotoForms,
        pastaContrato,
        'FOTO',
        apto,
        dados.nome
      );
      Logger.log(`✅ Foto baixada: ${linkFoto3x4}`);
    } catch (e) {
      Logger.log(`⚠️ Erro ao baixar foto: ${e.message}`);
    }
  }

  if (dados.linkDocsForms && pastaContrato) {
    try {
      linkDocumento = baixarArquivoForms(
        dados.linkDocsForms,
        pastaContrato,
        'DOC_RG',
        apto,
        dados.nome
      );
      Logger.log(`✅ Documento baixado: ${linkDocumento}`);
    } catch (e) {
      Logger.log(`⚠️ Erro ao baixar documento: ${e.message}`);
    }
  }

  try {
    if (dados.nome) {
      abaContratos.getRange(linhaContrato, COL_CONTRATOS.inquilino).setValue(dados.nome.toUpperCase());
    }
    if (dados.nacionalidade) {
      abaContratos.getRange(linhaContrato, COL_CONTRATOS.nacionalidade).setValue(dados.nacionalidade.toString().toUpperCase());
    }
    if (dados.estadoCivil) {
      abaContratos.getRange(linhaContrato, COL_CONTRATOS.estadoCivil).setValue(dados.estadoCivil.toString().toUpperCase());
    }
    if (dados.profissao) {
      abaContratos.getRange(linhaContrato, COL_CONTRATOS.profissao).setValue(dados.profissao.toString().toUpperCase());
    }
    if (dados.cpf) {
      abaContratos.getRange(linhaContrato, COL_CONTRATOS.cpf).setValue(formatarCPF(dados.cpf));
    }
    if (dados.dataNascimento) {
      abaContratos.getRange(linhaContrato, COL_CONTRATOS.dataNascimento).setValue(dados.dataNascimento);
    }
    if (dados.endereco) {
      abaContratos.getRange(linhaContrato, COL_CONTRATOS.endereco).setValue(dados.endereco.toString().toUpperCase());
    }
    if (dados.telefone) {
      abaContratos.getRange(linhaContrato, COL_CONTRATOS.telefone).setValue(formatarTelefone(dados.telefone));
    }
    if (dados.email) {
      abaContratos.getRange(linhaContrato, COL_CONTRATOS.email).setValue(dados.email);
    }
    if (dados.dataEntrada) {
      abaContratos.getRange(linhaContrato, COL_CONTRATOS.dataEntrada).setValue(dados.dataEntrada);
    }
    if (linkPastaContrato) {
      abaContratos.getRange(linhaContrato, COL_CONTRATOS.linkPasta).setValue(linkPastaContrato);
    }
    
    abaContratos.getRange(linhaContrato, COL_CONTRATOS.linhaForm).setValue(linhaForms);

    if (linkFoto3x4) {
      abaLinks.getRange(linhaContrato, COL_LINKS.linkFoto3x4).setValue(linkFoto3x4);
    }
    if (linkDocumento) {
      abaLinks.getRange(linhaContrato, COL_LINKS.linkDocumentoRG).setValue(linkDocumento);
    }
    if (linkPastaContrato) {
      abaLinks.getRange(linhaContrato, COL_LINKS.linkPastaContrato).setValue(linkPastaContrato);
    }

    Logger.log(`✅ Apartamento ${apto} atualizado!`);
    
  } catch (errSalvar) {
    const resposta = ui.alert(
      '⚠️ Erro ao Salvar Dados',
      `Erro encontrado: ${errSalvar.message}\n\n` +
      `O que deseja fazer?\n` +
      `• SIM = DESCARTAR alterações e RESTAURAR dados originais\n` +
      `• NÃO = MANTER dados parciais e corrigir manualmente`,
      ui.ButtonSet.YES_NO
    );
    
    if (resposta === ui.Button.YES) {
      try {
        Logger.log('🔄 Iniciando restauração do backup...');
        
        abaContratos.getRange(linhaContrato, COL_CONTRATOS.inquilino).setValue(backup.inquilino);
        abaContratos.getRange(linhaContrato, COL_CONTRATOS.nacionalidade).setValue(backup.nacionalidade);
        abaContratos.getRange(linhaContrato, COL_CONTRATOS.estadoCivil).setValue(backup.estadoCivil);
        abaContratos.getRange(linhaContrato, COL_CONTRATOS.profissao).setValue(backup.profissao);
        abaContratos.getRange(linhaContrato, COL_CONTRATOS.cpf).setValue(backup.cpf);
        abaContratos.getRange(linhaContrato, COL_CONTRATOS.dataNascimento).setValue(backup.dataNascimento);
        abaContratos.getRange(linhaContrato, COL_CONTRATOS.endereco).setValue(backup.endereco);
        abaContratos.getRange(linhaContrato, COL_CONTRATOS.telefone).setValue(backup.telefone);
        abaContratos.getRange(linhaContrato, COL_CONTRATOS.email).setValue(backup.email);
        abaContratos.getRange(linhaContrato, COL_CONTRATOS.dataEntrada).setValue(backup.dataEntrada);
        abaContratos.getRange(linhaContrato, COL_CONTRATOS.linkPasta).setValue(backup.linkPasta);
        abaContratos.getRange(linhaContrato, COL_CONTRATOS.linhaForm).setValue(backup.linhaForm);
        
        abaLinks.getRange(linhaContrato, COL_LINKS.linkFoto3x4).setValue(backupLinks.linkFoto3x4);
        abaLinks.getRange(linhaContrato, COL_LINKS.linkDocumentoRG).setValue(backupLinks.linkDocumentoRG);
        
        Logger.log('✅ Backup restaurado com sucesso!');
        
        ui.alert(
          '🔄 Dados Restaurados',
          'Os dados anteriores foram restaurados.\n\n' +
          'Verifique a planilha e tente novamente.',
          ui.ButtonSet.OK
        );
        
      } catch (errRestore) {
        ui.alert(
          '❌ Erro na Restauração',
          `Não foi possível restaurar os dados: ${errRestore.message}\n\n` +
          'Revise manualmente a planilha.',
          ui.ButtonSet.OK
        );
        Logger.log(`❌ Erro ao restaurar backup: ${errRestore.message}`);
      }
      
      throw new Error('Operação revertida pelo usuário.');
      
    } else {
      ui.alert(
        '💾 Dados Parciais Mantidos',
        `Os dados parcialmente salvos foram mantidos.\n\n` +
        `Revise as colunas do apartamento ${apto} e corrija conforme necessário.`,
        ui.ButtonSet.OK
      );
      
      Logger.log(`⚠️ Dados parciais mantidos para Apto ${apto}`);
    }
  }
}

function baixarArquivoForms(urlForms, pastaContrato, prefixo, apto, nomeInquilino) {
  const fileId = extrairIdDoDrive(urlForms);
  if (!fileId) {
    throw new Error('Não foi possível extrair ID do arquivo');
  }

  const arquivo = DriveApp.getFileById(fileId);
  const blob = arquivo.getBlob();
  const extensao = arquivo.getName().split('.').pop();

  const nomeNormalizado = normalizarNomeArquivo(nomeInquilino);
  const dataISOStr = Utilities.formatDate(new Date(), 'GMT-3', 'yyyy-MM-dd');
  const nomeArquivo = `${prefixo}_${apto}_${nomeNormalizado}_${dataISOStr}.${extensao}`;

  const novoArquivo = pastaContrato.createFile(blob.setName(nomeArquivo));
  
  return novoArquivo.getUrl();
}

// =====================================================
// ▼▼▼ MÓDULO

// =====================================================
// BASE250 | MÓDULO 1 – UTILITÁRIOS
// ARQUIVO: V4_M01.R3-BASE250_Utils
// REVISÃO: REV_03 – 29/01/2026 / 10:10
// =====================================================
// RESPONSABILIDADE:
// - Disponibilizar funções utilitárias reutilizáveis
// - Executar validações e formatações padronizadas
// - Apoiar tecnicamente os demais módulos
//
// CHANGELOG V4_M01.R3:
// - ✅ Adicionadas funções auxiliares faltantes
// - ✅ Removidas duplicações com MOD 6
// - ✅ Adicionada escapeRegex(), resolverGenero(), dataISO()
// - ✅ PRONTO PARA TODOS OS MÓDULOS
// =====================================================

// =====================================================
// VALIDAÇÃO DE DADOS COMPLETOS
// =====================================================
function validarDadosCompletos(dadosImportados, linhaContrato) {
  const erros = [];
  const avisos = [];
  
  // Verificar campos obrigatórios dos dados importados
  if (!dadosImportados.nome || dadosImportados.nome.length < 3) {
    erros.push('❌ Nome inválido ou muito curto');
  }
  
  // Remover formatação antes de validar
  const cpfNumeros = (dadosImportados.cpf || '').toString().replace(/\D/g, '');
  if (!cpfNumeros || cpfNumeros.length !== 11) {
    erros.push('❌ CPF inválido (deve ter 11 dígitos)');
  }
  
  if (!dadosImportados.email || !dadosImportados.email.includes('@')) {
    erros.push('❌ E-mail inválido');
  }
  
  if (!dadosImportados.telefone || dadosImportados.telefone.length < 10) {
    avisos.push('⚠️ Telefone não informado ou incompleto');
  }
  
  if (!dadosImportados.endereco || dadosImportados.endereco.length < 10) {
    avisos.push('⚠️ Endereço não informado ou incompleto');
  }
  
  if (!dadosImportados.nacionalidade) {
    avisos.push('⚠️ Nacionalidade não informada');
  }
  
  if (!dadosImportados.estadoCivil) {
    avisos.push('⚠️ Estado civil não informado');
  }
  
  if (!dadosImportados.profissao) {
    avisos.push('⚠️ Profissão não informada');
  }
  
  // Verificar se já existe pasta (coluna I da linha do contrato)
  if (linhaContrato && linhaContrato[8] && linhaContrato[8].includes('/folders/')) {
    avisos.push('ℹ️ Pasta do contrato já existe');
  }
  
  // Montar relatório
  const temErros = erros.length > 0;
  const temAvisos = avisos.length > 0;
  
  let mensagem = '';
  
  if (temErros) {
    mensagem += '─────────────────────────────────────\n';
    mensagem += '❌ ERROS ENCONTRADOS:\n';
    mensagem += '─────────────────────────────────────\n';
    mensagem += erros.join('\n') + '\n\n';
  }
  
  if (temAvisos) {
    mensagem += '─────────────────────────────────────\n';
    mensagem += '⚠️ AVISOS:\n';
    mensagem += '─────────────────────────────────────\n';
    mensagem += avisos.join('\n') + '\n\n';
  }
  
  if (!temErros && !temAvisos) {
    mensagem = '✅ Todos os dados estão completos e validados!';
  }
  
  return {
    temErros: temErros,
    temAvisos: temAvisos,
    erros: erros,
    avisos: avisos,
    mensagem: mensagem.trim()
  };
}

// =====================================================
// NORMALIZAR NOME PARA ARQUIVO
// =====================================================
function normalizarNomeArquivo(texto) {
  if (!texto) return 'Sem_Nome';
  
  return texto
    .toString()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-zA-Z0-9\s]/g, '')  // Remove caracteres especiais
    .replace(/\s+/g, '_')             // Substitui espaços por _
    .substring(0, 50);                // Limita a 50 caracteres
}

// =====================================================
// FORMATAR CPF (XXX.XXX.XXX-XX)
// =====================================================
function formatarCPF(cpf) {
  if (!cpf) return '';
  
  const nums = cpf.toString().replace(/\D/g, '');
  
  if (nums.length !== 11) return cpf;
  
  return `${nums.substring(0,3)}.${nums.substring(3,6)}.${nums.substring(6,9)}-${nums.substring(9,11)}`;
}

// =====================================================
// FORMATAR TELEFONE (XX) XXXXX-XXXX
// =====================================================
function formatarTelefone(tel) {
  if (!tel) return '';
  
  const nums = tel.toString().replace(/\D/g, '');
  
  if (nums.length === 11) {
    return `(${nums.substring(0,2)}) ${nums.substring(2,7)}-${nums.substring(7,11)}`;
  }
  
  if (nums.length === 10) {
    return `(${nums.substring(0,2)}) ${nums.substring(2,6)}-${nums.substring(6,10)}`;
  }
  
  return tel;
}

// =====================================================
// EXTRAIR ID DO DRIVE DE UMA URL
// =====================================================
function extrairIdDoDrive(url) {
  if (!url) return null;
  
  // https://drive.google.com/file/d/ID_AQUI/view
  // https://drive.google.com/open?id=ID_AQUI
  // https://drive.google.com/folders/ID_AQUI
  
  const padroes = [
    /\/d\/([a-zA-Z0-9_-]+)/,           // /d/ID
    /\/folders\/([a-zA-Z0-9_-]+)/,    // /folders/ID
    /[?&]id=([a-zA-Z0-9_-]+)/         // ?id=ID
  ];
  
  for (const padrao of padroes) {
    const match = url.match(padrao);
    if (match) return match[1];
  }
  
  return null;
}

// =====================================================
// VALIDAR DATA (NÃO PERMITE 31/02, 30/02, ETC)
// =====================================================
function validarData(data) {
  if (!data) return false;
  
  let d;
  
  if (data instanceof Date) {
    d = data;
  } else if (typeof data === 'string') {
    // Tentar parsear DD/MM/YYYY
    const partes = data.split('/');
    if (partes.length === 3) {
      const dia = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10) - 1; // JS mês começa em 0
      const ano = parseInt(partes[2], 10);
      d = new Date(ano, mes, dia);
    } else {
      d = new Date(data);
    }
  } else {
    return false;
  }
  
  // Verificar se é válida
  if (isNaN(d.getTime())) return false;
  
  // Verificar se a data criada corresponde aos valores fornecidos
  // (evita 31/02 virar 03/03)
  if (typeof data === 'string' && data.includes('/')) {
    const partes = data.split('/');
    if (partes.length === 3) {
      const dia = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10);
      const ano = parseInt(partes[2], 10);
      
      if (d.getDate() !== dia || 
          d.getMonth() + 1 !== mes || 
          d.getFullYear() !== ano) {
        return false;
      }
    }
  }
  
  return true;
}

// =====================================================
// FORMATAR DATA PARA DD/MM/YYYY
// =====================================================
function formatarData(data) {
  if (!data) return '';
  
  let d;
  
  if (data instanceof Date) {
    d = data;
  } else {
    d = new Date(data);
  }
  
  if (isNaN(d.getTime())) return data;
  
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  
  return `${dia}/${mes}/${ano}`;
}

// =====================================================
// DATA EM FORMATO ISO (YYYY-MM-DD) ✅ ADICIONADO
// =====================================================
function dataISO(data) {
  if (!data) data = new Date();
  
  let d;
  if (data instanceof Date) {
    d = data;
  } else {
    d = new Date(data);
  }
  
  if (isNaN(d.getTime())) return '';
  
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  
  return `${ano}-${mes}-${dia}`;
}

// =====================================================
// ADICIONAR MESES A UMA DATA
// =====================================================
function adicionarMeses(data, meses) {
  const d = new Date(data);
  d.setMonth(d.getMonth() + meses);
  return d;
}

// =====================================================
// NÚMERO POR EXTENSO (ATÉ 9999)
// =====================================================
function numeroParaExtenso(num) {
  const n = Math.floor(Number(num));
  
  if (isNaN(n) || n < 0) return 'zero';
  if (n === 0) return 'zero';
  
  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const especiais = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
  
  if (n === 100) return 'cem';
  if (n === 1000) return 'hum mil';
  
  let resultado = '';
  
  // Milhares
  if (n >= 1000) {
    const mil = Math.floor(n / 1000);
    if (mil === 1) {
      resultado += 'hum mil';
    } else {
      resultado += unidades[mil] + ' mil';
    }
    
    const resto = n % 1000;
    if (resto > 0) {
      resultado += ' e ';
    }
  }
  
  // Centenas
  const resto1000 = n % 1000;
  if (resto1000 >= 100) {
    const cen = Math.floor(resto1000 / 100);
    resultado += centenas[cen];
    
    const resto100 = resto1000 % 100;
    if (resto100 > 0) {
      resultado += ' e ';
    }
  }
  
  // Dezenas e unidades
  const resto100 = n % 100;
  if (resto100 >= 10 && resto100 < 20) {
    resultado += especiais[resto100 - 10];
  } else {
    const dez = Math.floor(resto100 / 10);
    const uni = resto100 % 10;
    
    if (dez > 0) {
      resultado += dezenas[dez];
      if (uni > 0) {
        resultado += ' e ';
      }
    }
    
    if (uni > 0) {
      resultado += unidades[uni];
    }
  }
  
  return resultado.trim();
}

// =====================================================
// VALOR POR EXTENSO (R$)
// =====================================================
function valorParaExtenso(valor) {
  const n = Math.floor(Number(valor));
  
  if (isNaN(n) || n < 0) return 'zero reais';
  
  const extenso = numeroParaExtenso(n);
  
  if (n === 1) {
    return extenso + ' real';
  } else {
    return extenso + ' reais';
  }
}

// =====================================================
// LOGS COM TIMESTAMP
// =====================================================
function log(mensagem) {
  const agora = new Date();
  const timestamp = Utilities.formatDate(agora, 'GMT-3', 'yyyy-MM-dd HH:mm:ss');
  Logger.log(`[${timestamp}] ${mensagem}`);
}

// =====================================================
// DETECTAR GÊNERO PELO ESTADO CIVIL ✅ SEM DUPLICAÇÃO
// =====================================================
function detectarGenero(estadoCivil) {
  if (!estadoCivil) return 'o(a)';
  
  const texto = estadoCivil.toString().toLowerCase();
  
  // Feminino
  if (texto.includes('solteira') || 
      texto.includes('casada') || 
      texto.includes('divorciada') || 
      texto.includes('viúva')) {
    return 'a';
  }
  
  // Masculino
  if (texto.includes('solteiro') || 
      texto.includes('casado') || 
      texto.includes('divorciado') || 
      texto.includes('viúvo')) {
    return 'o';
  }
  
  return 'o(a)';
}

// =====================================================
// RESOLVER GÊNERO (COMPLETO) ✅ ADICIONADO SEM DUPLICAÇÃO
// =====================================================
function resolverGenero(d) {
  const genero = (d.genero || '').toString().toLowerCase();
  
  if (genero.includes('f') || genero.includes('feminino')) {
    return 'feminino';
  } else if (genero.includes('m') || genero.includes('masculino')) {
    return 'masculino';
  }
  
  // Se não conseguir do gênero, tenta pelo estado civil
  return detectarGenero(d.estadoCivil) === 'a' ? 'feminino' : 'masculino';
}

// =====================================================
// ESCAPE REGEX (PARA SUBSTITUIÇÃO DE PLACEHOLDERS)
// =====================================================
function escapeRegex(texto) {
  if (!texto) return '';
  return texto.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// =====================================================
// DATA POR EXTENSO (ex: "29 de janeiro de 2026")
// =====================================================
function dataPorExtenso(data) {
  if (!data) data = new Date();
  
  let d;
  if (data instanceof Date) {
    d = data;
  } else {
    d = new Date(data);
  }
  
  if (isNaN(d.getTime())) return '';
  
  const dias = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
                 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  
  const dia = d.getDate();
  const mes = meses[d.getMonth()];
  const ano = d.getFullYear();
  
  return `${dia} de ${mes} de ${ano}`;
}

// =====================================================
// BASE250 | MÓDULO 2 – GESTÃO DE ARQUIVOS
// ARQUIVO: V4_M02.R7-BASE250_GestaoArquivos
// REVISÃO: REV_07 – 02/02/2026 / 14:00
// =====================================================
// RESPONSABILIDADE:
// - Criar, mover e organizar arquivos e pastas
// - Padronizar nomes e estruturas no Drive
// - Garantir rastreabilidade de documentos
// - Gerenciar links da aba Links (colunas E-I)
//
// CHANGELOG V4_M02.R7:
// - ✅ CORREÇÃO: menuResumo() conta apenas apartamentos válidos
// - ✅ CORREÇÃO: Ignora linhas vazias ou sem apartamento
// - ✅ CORREÇÃO: Função renomear usa padrão automaticamente
// =====================================================

// =====================================================
// 📊 RESUMO
// ✅ R7: CORRIGIDO para contar apenas apartamentos válidos
// =====================================================
function menuResumo() {
  const ui = SpreadsheetApp.getUi();
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const aba = planilha.getSheetByName(CONFIG_CONTRATOS.abaContratos);
  
  if (!aba) {
    ui.alert('Erro', 'Aba Contratos não encontrada.', ui.ButtonSet.OK);
    return;
  }
  
  const dados = aba.getDataRange().getValues();
  
  let ocupados = 0;
  let disponiveis = 0;
  let semStatus = 0;
  let totalApartamentos = 0;
  
  // ✅ R7: Contar apenas linhas com apartamento válido
  for (let i = 1; i < dados.length; i++) {
    const apto = dados[i][COL_CONTRATOS.apto - 1];
    
    // ✅ R7: Ignorar linhas vazias ou sem apartamento válido
    if (!apto || apto.toString().trim() === '') {
      continue;
    }
    
    // ✅ R7: Verificar se é um apartamento válido (3 dígitos ou Studio)
    const aptoStr = apto.toString().trim();
    if (!/^\d{3}$/.test(aptoStr) && !/^Studio\s*\d{3}$/i.test(aptoStr)) {
      continue;
    }
    
    totalApartamentos++;
    
    const status = dados[i][COL_CONTRATOS.status - 1];
    
    if (status === 'Ocupado') {
      ocupados++;
    } else if (status === 'Disponível') {
      disponiveis++;
    } else {
      semStatus++;
    }
  }
  
  ui.alert(
    '📊 Resumo - BASE250',
    '✅ Ocupados: ' + ocupados + '\n' +
    '🔓 Disponíveis: ' + disponiveis + '\n' +
    '❓ Sem status: ' + semStatus + '\n\n' +
    'Total de apartamentos: ' + totalApartamentos,
    ui.ButtonSet.OK
  );
}

// =====================================================
// 📋 LISTAR ARQUIVOS DE UM APARTAMENTO
// =====================================================
function menuListarArquivosApto() {
  const ui = SpreadsheetApp.getUi();
  
  const r = ui.prompt(
    '📄 Listar Arquivos',
    'Digite os 3 dígitos do apartamento:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (r.getSelectedButton() !== ui.Button.OK) return;
  
  const apto = r.getResponseText().trim();
  if (!/^\d{3}$/.test(apto)) {
    ui.alert('Erro', 'Digite exatamente 3 dígitos.', ui.ButtonSet.OK);
    return;
  }
  
  const dados = obterDadosApartamento(apto);
  if (!dados || !dados.linkPasta) {
    ui.alert('Erro', 'Apartamento não encontrado ou sem pasta vinculada.', ui.ButtonSet.OK);
    return;
  }
  
  try {
    const pastaId = dados.linkPasta.split('/folders/')[1].split('?')[0];
    const pasta = DriveApp.getFolderById(pastaId);
    
    let lista = `📁 Pasta: ${pasta.getName()}\n`;
    lista += `🔗 Link: ${pasta.getUrl()}\n\n`;
    lista += '📄 ARQUIVOS:\n';
    lista += '═════════════════════════════════════════\n';
    
    const arquivos = pasta.getFiles();
    let count = 0;
    
    while (arquivos.hasNext()) {
      const arquivo = arquivos.next();
      const nome = arquivo.getName();
      const tamanho = (arquivo.getSize() / 1024).toFixed(1) + ' KB';
      const tipo = identificarTipoArquivo(arquivo);
      
      lista += `${tipo} ${nome}\n`;
      lista += `   Tamanho: ${tamanho}\n`;
      lista += `   Link: ${arquivo.getUrl()}\n\n`;
      count++;
    }
    
    if (count === 0) {
      lista += 'Nenhum arquivo encontrado.\n';
    } else {
      lista += `\nTotal: ${count} arquivo(s)`;
    }
    
    ui.alert('📋 Arquivos do Apartamento ' + apto, lista, ui.ButtonSet.OK);
    
  } catch (e) {
    ui.alert('Erro', 'Erro ao acessar a pasta: ' + e.message, ui.ButtonSet.OK);
  }
}


// =====================================================
// ✏️ RENOMEAR CONTRATO
// ✅ R7: Usa padrão automaticamente
// =====================================================
function menuRenomearContrato() {
  renomearArquivoContratoPadrao(false);
}

function menuRenomearContratoAssinado() {
  renomearArquivoContratoPadrao(true);
}


// =====================================================
// ✏️ RENOMEAR CONTRATO COM PADRÃO AUTOMÁTICO
// ✅ R7: Segue o padrão definido automaticamente
// =====================================================
function renomearArquivoContratoPadrao(assinado) {
  const ui = SpreadsheetApp.getUi();
  const tipoStr = assinado ? 'Contrato Assinado' : 'Contrato';
  
  const r = ui.prompt(
    `✏️ Renomear ${tipoStr}`,
    'Digite os 3 dígitos do apartamento:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (r.getSelectedButton() !== ui.Button.OK) return;
  
  const apto = r.getResponseText().trim();
  if (!/^\d{3}$/.test(apto)) {
    ui.alert('Erro', 'Digite exatamente 3 dígitos.', ui.ButtonSet.OK);
    return;
  }
  
  const dados = obterDadosApartamento(apto);
  
  if (!dados || !dados.linkPasta) {
    ui.alert('Erro', 'Apartamento não encontrado ou sem pasta vinculada.', ui.ButtonSet.OK);
    return;
  }
  
  if (!dados.inquilino) {
    ui.alert('Erro', 'Apartamento não possui inquilino cadastrado.', ui.ButtonSet.OK);
    return;
  }
  
  try {
    const pastaId = dados.linkPasta.split('/folders/')[1].split('?')[0];
    const pasta = DriveApp.getFolderById(pastaId);
    
    // BUSCAR ARQUIVOS SUPORTADOS (PDF, DOC)
    const arquivos = pasta.getFiles();
    const candidatos = [];
    
    while (arquivos.hasNext()) {
      const arq = arquivos.next();
      const mime = arq.getMimeType().toLowerCase();
      
      // Aceita PDF e DOC
      if (mime.includes('pdf') || mime.includes('document')) {
        candidatos.push(arq);
      }
    }
    
    if (candidatos.length === 0) {
      ui.alert('Erro', 'Nenhum arquivo PDF ou DOC encontrado nesta pasta.', ui.ButtonSet.OK);
      return;
    }
    
    let arquivo;
    if (candidatos.length === 1) {
      arquivo = candidatos[0];
    } else {
      // Mostrar lista para escolher
      let opcoes = `📋 Arquivos disponíveis na pasta do Apto ${apto}:\n`;
      opcoes += '═════════════════════════════════════════\n\n';
      
      candidatos.forEach((arq, idx) => {
        const tipo = identificarTipoArquivo(arq);
        const tamanho = (arq.getSize() / 1024).toFixed(1) + ' KB';
        const dataModif = Utilities.formatDate(
          arq.getLastUpdated(),
          'GMT-3',
          'dd/MM/yyyy HH:mm'
        );
        
        opcoes += `${idx + 1}. ${tipo} ${arq.getName()}\n`;
        opcoes += `   • Tamanho: ${tamanho}\n`;
        opcoes += `   • Modificado: ${dataModif}\n\n`;
      });
      
      opcoes += '═════════════════════════════════════════\n';
      opcoes += `Total: ${candidatos.length} arquivo(s)\n\n`;
      opcoes += '💡 Digite o número do arquivo que deseja renomear:';
      
      const rEscolha = ui.prompt(
        `✏️ Escolher ${tipoStr}`,
        opcoes,
        ui.ButtonSet.OK_CANCEL
      );
      
      if (rEscolha.getSelectedButton() !== ui.Button.OK) return;
      
      const indice = Number(rEscolha.getResponseText()) - 1;
      
      if (isNaN(indice) || indice < 0 || indice >= candidatos.length) {
        ui.alert('Erro', 'Número inválido.', ui.ButtonSet.OK);
        return;
      }
      
      arquivo = candidatos[indice];
    }
    
    // ✅ R7: GERAR NOME NO PADRÃO AUTOMATICAMENTE
    const nomeNormalizado = normalizarNomeArquivo(dados.inquilino);
    const dataEmissaoISO = dataISO(new Date());
    const extensao = arquivo.getName().split('.').pop().toLowerCase();
    
    let novoNome;
    if (assinado) {
      novoNome = `CONTRATO_ASS_${apto}_${nomeNormalizado}_${dataEmissaoISO}.${extensao}`;
    } else {
      novoNome = `CONTRATO_${apto}_${nomeNormalizado}_${dataEmissaoISO}.${extensao}`;
    }
    
    // ✅ R7: Mostrar apenas confirmação, sem pedir para digitar
    const confirmar = ui.alert(
      'Confirmar Renomeação',
      `Arquivo atual:\n"${arquivo.getName()}"\n\n` +
      `Será renomeado para:\n"${novoNome}"\n\n` +
      `Padrão: ${assinado ? 'CONTRATO_ASS' : 'CONTRATO'}_APTO_NOME_DATA.extensão\n\n` +
      `Confirma a renomeação?`,
      ui.ButtonSet.YES_NO
    );
    
    if (confirmar !== ui.Button.YES) {
      ui.alert('Cancelado', 'Renomeação cancelada pelo usuário.', ui.ButtonSet.OK);
      return;
    }
    
    arquivo.setName(novoNome);
    
    ui.alert('✅ Sucesso', `Arquivo renomeado para:\n\n${novoNome}`, ui.ButtonSet.OK);
    
  } catch (e) {
    ui.alert('Erro', 'Erro ao renomear: ' + e.message, ui.ButtonSet.OK);
  }
}


// =====================================================
// ✏️ RENOMEAR DECLARAÇÃO
// ✅ R7: Usa padrão automaticamente
// =====================================================
function menuRenomearDeclaracao() {
  const ui = SpreadsheetApp.getUi();
  
  const r = ui.prompt(
    '✏️ Renomear Declaração',
    'Digite os 3 dígitos do apartamento:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (r.getSelectedButton() !== ui.Button.OK) return;
  
  const apto = r.getResponseText().trim();
  if (!/^\d{3}$/.test(apto)) {
    ui.alert('Erro', 'Digite exatamente 3 dígitos.', ui.ButtonSet.OK);
    return;
  }
  
  const dados = obterDadosApartamento(apto);
  
  if (!dados || !dados.linkPasta) {
    ui.alert('Erro', 'Apartamento não encontrado ou sem pasta vinculada.', ui.ButtonSet.OK);
    return;
  }
  
  try {
    const pastaId = dados.linkPasta.split('/folders/')[1].split('?')[0];
    const pasta = DriveApp.getFolderById(pastaId);
    
    const arquivos = pasta.getFiles();
    const candidatos = [];
    
    while (arquivos.hasNext()) {
      const arq = arquivos.next();
      const mime = arq.getMimeType().toLowerCase();
      
      if (mime.includes('pdf') || mime.includes('document')) {
        candidatos.push(arq);
      }
    }
    
    if (candidatos.length === 0) {
      ui.alert('Erro', 'Nenhum arquivo PDF ou DOC encontrado nesta pasta.', ui.ButtonSet.OK);
      return;
    }
    
    let arquivo;
    if (candidatos.length === 1) {
      arquivo = candidatos[0];
    } else {
      let opcoes = `📋 Arquivos disponíveis:\n`;
      opcoes += '═════════════════════════════════════════\n\n';
      
      candidatos.forEach((arq, idx) => {
        const tipo = identificarTipoArquivo(arq);
        opcoes += `${idx + 1}. ${tipo} ${arq.getName()}\n`;
      });
      
      opcoes += '\n💡 Digite o número do arquivo:';
      
      const rEscolha = ui.prompt(
        '✏️ Escolher Declaração',
        opcoes,
        ui.ButtonSet.OK_CANCEL
      );
      
      if (rEscolha.getSelectedButton() !== ui.Button.OK) return;
      
      const indice = Number(rEscolha.getResponseText()) - 1;
      
      if (isNaN(indice) || indice < 0 || indice >= candidatos.length) {
        ui.alert('Erro', 'Número inválido.', ui.ButtonSet.OK);
        return;
      }
      
      arquivo = candidatos[indice];
    }
    
    // ✅ R7: GERAR NOME NO PADRÃO AUTOMATICAMENTE
    const nomeNormalizado = normalizarNomeArquivo(dados.inquilino);
    const mesAno = Utilities.formatDate(new Date(), 'GMT-3', 'yyyy-MM');
    const extensao = arquivo.getName().split('.').pop().toLowerCase();
    
    const novoNome = `DECLARACAO_${apto}_${nomeNormalizado}_${mesAno}.${extensao}`;
    
    const confirmar = ui.alert(
      'Confirmar Renomeação',
      `Arquivo atual:\n"${arquivo.getName()}"\n\n` +
      `Será renomeado para:\n"${novoNome}"\n\n` +
      `Confirma?`,
      ui.ButtonSet.YES_NO
    );
    
    if (confirmar !== ui.Button.YES) {
      ui.alert('Cancelado', 'Renomeação cancelada.', ui.ButtonSet.OK);
      return;
    }
    
    arquivo.setName(novoNome);
    
    ui.alert('✅ Sucesso', `Declaração renomeada para:\n${novoNome}`, ui.ButtonSet.OK);
    
  } catch (e) {
    ui.alert('Erro', 'Erro ao renomear: ' + e.message, ui.ButtonSet.OK);
  }
}


// =====================================================
// ✏️ RENOMEAR FOTO (APENAS IMAGENS)
// =====================================================
function menuRenomearFoto() {
  const ui = SpreadsheetApp.getUi();
  
  const r = ui.prompt(
    '📸 Renomear Foto',
    'Digite os 3 dígitos do apartamento:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (r.getSelectedButton() !== ui.Button.OK) return;
  
  const apto = r.getResponseText().trim();
  if (!/^\d{3}$/.test(apto)) {
    ui.alert('Erro', 'Digite exatamente 3 dígitos.', ui.ButtonSet.OK);
    return;
  }
  
  const dados = obterDadosApartamento(apto);
  
  if (!dados || !dados.linkPasta) {
    ui.alert('Erro', 'Apartamento não encontrado ou sem pasta vinculada.', ui.ButtonSet.OK);
    return;
  }
  
  try {
    const pastaId = dados.linkPasta.split('/folders/')[1].split('?')[0];
    const pasta = DriveApp.getFolderById(pastaId);
    
    const nomeNormalizado = normalizarNomeArquivo(dados.inquilino);
    const dataEmissaoISO = dataISO(new Date());
    
    const arquivos = pasta.getFiles();
    const lista = [];
    
    // FILTRAR APENAS IMAGENS (PNG, JPEG, JPG)
    while (arquivos.hasNext()) {
      const arq = arquivos.next();
      const mime = arq.getMimeType().toLowerCase();
      
      if (mime.includes('image/png') || 
          mime.includes('image/jpeg') || 
          mime.includes('image/jpg')) {
        lista.push(arq);
      }
    }
    
    if (lista.length === 0) {
      ui.alert('Erro', 'Nenhuma imagem (PNG, JPEG, JPG) encontrada nesta pasta.', ui.ButtonSet.OK);
      return;
    }
    
    let opcoes = 'Imagens disponíveis:\n\n';
    lista.forEach((arq, idx) => {
      const tipo = identificarTipoArquivo(arq);
      opcoes += `${idx + 1}. ${tipo} ${arq.getName()}\n`;
    });
    
    const rEscolha = ui.prompt(
      '📸 Escolher Foto',
      opcoes + '\nDigite o número da imagem:',
      ui.ButtonSet.OK_CANCEL
    );
    
    if (rEscolha.getSelectedButton() !== ui.Button.OK) return;
    
    const indice = Number(rEscolha.getResponseText()) - 1;
    
    if (indice < 0 || indice >= lista.length) {
      ui.alert('Erro', 'Número inválido.', ui.ButtonSet.OK);
      return;
    }
    
    const arquivo = lista[indice];
    const extensao = arquivo.getName().split('.').pop().toLowerCase();
    const novoNome = `FOTO_${apto}_${nomeNormalizado}_${dataEmissaoISO}.${extensao}`;
    
    // Mostrar preview
    const confirmar = ui.alert(
      'Confirmar Renomeação',
      `Arquivo atual:\n"${arquivo.getName()}"\n\n` +
      `Será renomeado para:\n"${novoNome}"\n\n` +
      `Confirma a renomeação?`,
      ui.ButtonSet.YES_NO
    );
    
    if (confirmar !== ui.Button.YES) {
      ui.alert('Cancelado', 'Renomeação cancelada pelo usuário.', ui.ButtonSet.OK);
      return;
    }
    
    arquivo.setName(novoNome);
    
    ui.alert('✅ Sucesso', `Foto renomeada para:\n${novoNome}`, ui.ButtonSet.OK);
    
  } catch (e) {
    ui.alert('Erro', 'Erro ao renomear: ' + e.message, ui.ButtonSet.OK);
  }
}


// =====================================================
// ✏️ RENOMEAR DOCUMENTO
// =====================================================
function menuRenomearDocumento() {
  const ui = SpreadsheetApp.getUi();
  
  const r = ui.prompt(
    '📄 Renomear Documento',
    'Digite os 3 dígitos do apartamento:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (r.getSelectedButton() !== ui.Button.OK) return;
  
  const apto = r.getResponseText().trim();
  if (!/^\d{3}$/.test(apto)) {
    ui.alert('Erro', 'Digite exatamente 3 dígitos.', ui.ButtonSet.OK);
    return;
  }
  
  const dados = obterDadosApartamento(apto);
  
  if (!dados || !dados.linkPasta) {
    ui.alert('Erro', 'Apartamento não encontrado ou sem pasta vinculada.', ui.ButtonSet.OK);
    return;
  }
  
  const rTipo = ui.prompt(
    '📄 Tipo de Documento',
    'Descreva o tipo (ex: RG-FRENTE, RG-VERSO, CPF, CNH):',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (rTipo.getSelectedButton() !== ui.Button.OK) return;
  
  const tipo = rTipo.getResponseText().trim().toUpperCase();
  
  try {
    const pastaId = dados.linkPasta.split('/folders/')[1].split('?')[0];
    const pasta = DriveApp.getFolderById(pastaId);
    
    const nomeNormalizado = normalizarNomeArquivo(dados.inquilino);
    const dataEmissaoISO = dataISO(new Date());
    
    const arquivos = pasta.getFiles();
    const lista = [];
    
    while (arquivos.hasNext()) {
      const arq = arquivos.next();
      lista.push(arq);
    }
    
    if (lista.length === 0) {
      ui.alert('Erro', 'Nenhum arquivo encontrado nesta pasta.', ui.ButtonSet.OK);
      return;
    }
    
    let opcoes = 'Arquivos disponíveis:\n\n';
    lista.forEach((arq, idx) => {
      const tipoArq = identificarTipoArquivo(arq);
      opcoes += `${idx + 1}. ${tipoArq} ${arq.getName()}\n`;
    });
    
    const rEscolha = ui.prompt(
      '📄 Escolher Arquivo',
      opcoes + '\nDigite o número do arquivo:',
      ui.ButtonSet.OK_CANCEL
    );
    
    if (rEscolha.getSelectedButton() !== ui.Button.OK) return;
    
    const indice = Number(rEscolha.getResponseText()) - 1;
    
    if (indice < 0 || indice >= lista.length) {
      ui.alert('Erro', 'Número inválido.', ui.ButtonSet.OK);
      return;
    }
    
    const arquivo = lista[indice];
    const extensao = arquivo.getName().split('.').pop().toLowerCase();
    const novoNome = `DOC_${tipo}_${apto}_${nomeNormalizado}_${dataEmissaoISO}.${extensao}`;
    
    // Mostrar preview
    const confirmar = ui.alert(
      'Confirmar Renomeação',
      `Arquivo atual:\n"${arquivo.getName()}"\n\n` +
      `Será renomeado para:\n"${novoNome}"\n\n` +
      `Confirma a renomeação?`,
      ui.ButtonSet.YES_NO
    );
    
    if (confirmar !== ui.Button.YES) {
      ui.alert('Cancelado', 'Renomeação cancelada pelo usuário.', ui.ButtonSet.OK);
      return;
    }
    
    arquivo.setName(novoNome);
    
    ui.alert('✅ Sucesso', `Documento renomeado para:\n${novoNome}`, ui.ButtonSet.OK);
    
  } catch (e) {
    ui.alert('Erro', 'Erro ao renomear: ' + e.message, ui.ButtonSet.OK);
  }
}


// =====================================================
// 📁 RENOMEAR PASTA
// =====================================================
function menuRenomearPasta() {
  const ui = SpreadsheetApp.getUi();
  
  // 1. SOLICITAR APARTAMENTO
  const rApto = ui.prompt(
    '📁 Renomear Pasta',
    'Digite os 3 dígitos do apartamento:\n\n' +
    '(Será buscado na pasta raiz do Drive)',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (rApto.getSelectedButton() !== ui.Button.OK) return;
  
  const apto = rApto.getResponseText().trim();
  if (!/^\d{3}$/.test(apto)) {
    ui.alert('Erro', 'Digite exatamente 3 dígitos.', ui.ButtonSet.OK);
    return;
  }
  
  try {
    // 2. IR NA PASTA RAIZ
    const pastaRaiz = DriveApp.getFolderById(CONFIG_CONTRATOS.pastaRaizId);
    
    // 3. BUSCAR PASTA DO APARTAMENTO
    const pastasApto = pastaRaiz.getFoldersByName(apto);
    
    if (!pastasApto.hasNext()) {
      ui.alert(
        'Erro',
        `Pasta "${apto}" não encontrada na pasta raiz.\n\n` +
        `Verifique se existe uma pasta com nome "${apto}" em:\n` +
        `${pastaRaiz.getName()}`,
        ui.ButtonSet.OK
      );
      return;
    }
    
    const pastaApto = pastasApto.next();
    
    // 4. LISTAR SUBPASTAS
    const subpastas = pastaApto.getFolders();
    const listaPastas = [];
    
    while (subpastas.hasNext()) {
      const subpasta = subpastas.next();
      listaPastas.push({
        pasta: subpasta,
        nome: subpasta.getName(),
        dataModif: subpasta.getLastUpdated()
      });
    }
    
    // 5. SE NÃO HOUVER SUBPASTAS
    if (listaPastas.length === 0) {
      const renomearPrincipal = ui.alert(
        '📁 Sem Subpastas',
        `A pasta "${apto}" não possui subpastas.\n\n` +
        `Deseja renomear a própria pasta "${pastaApto.getName()}"?`,
        ui.ButtonSet.YES_NO
      );
      
      if (renomearPrincipal === ui.Button.YES) {
        const rNovo = ui.prompt(
          '📁 Novo Nome',
          `Nome atual: ${pastaApto.getName()}\n\nDigite o novo nome:`,
          ui.ButtonSet.OK_CANCEL
        );
        
        if (rNovo.getSelectedButton() === ui.Button.OK) {
          const novoNome = rNovo.getResponseText().trim();
          if (novoNome) {
            const nomeAntigo = pastaApto.getName();
            pastaApto.setName(novoNome);
            ui.alert('✅ Sucesso', `Pasta renomeada de:\n"${nomeAntigo}"\n\nPara:\n"${novoNome}"`, ui.ButtonSet.OK);
          }
        }
      }
      return;
    }
    
    // 6. MOSTRAR LISTA DE SUBPASTAS
    let opcoes = `📁 PASTAS DO APARTAMENTO ${apto}\n`;
    opcoes += '═════════════════════════════════════════\n\n';
    
    listaPastas.forEach((item, idx) => {
      const dataStr = Utilities.formatDate(item.dataModif, 'GMT-3', 'dd/MM/yyyy');
      opcoes += `${idx + 1}. 📁 ${item.nome}\n`;
      opcoes += `   Modificado: ${dataStr}\n\n`;
    });
    
    opcoes += '═════════════════════════════════════════\n';
    opcoes += `Total: ${listaPastas.length} pasta(s)\n\n`;
    opcoes += 'Digite o número da pasta que deseja renomear:';
    
    const rEscolha = ui.prompt(
      '📁 Escolher Pasta',
      opcoes,
      ui.ButtonSet.OK_CANCEL
    );
    
    if (rEscolha.getSelectedButton() !== ui.Button.OK) return;
    
    const indice = Number(rEscolha.getResponseText()) - 1;
    
    if (isNaN(indice) || indice < 0 || indice >= listaPastas.length) {
      ui.alert('Erro', 'Número inválido.', ui.ButtonSet.OK);
      return;
    }
    
    const pastaEscolhida = listaPastas[indice].pasta;
    const nomeAtual = pastaEscolhida.getName();
    
    // 7. SOLICITAR NOVO NOME
    const rNovo = ui.prompt(
      '📁 Novo Nome',
      `Nome atual: ${nomeAtual}\n\nDigite o novo nome:`,
      ui.ButtonSet.OK_CANCEL
    );
    
    if (rNovo.getSelectedButton() !== ui.Button.OK) return;
    
    const novoNome = rNovo.getResponseText().trim();
    
    if (!novoNome) {
      ui.alert('Erro', 'Nome não pode ser vazio.', ui.ButtonSet.OK);
      return;
    }
    
    // 8. CONFIRMAR
    const confirmar = ui.alert(
      'Confirmar Renomeação',
      `Pasta atual:\n"${nomeAtual}"\n\n` +
      `Será renomeada para:\n"${novoNome}"\n\n` +
      `Confirma a renomeação?`,
      ui.ButtonSet.YES_NO
    );
    
    if (confirmar !== ui.Button.YES) {
      ui.alert('Cancelado', 'Renomeação cancelada.', ui.ButtonSet.OK);
      return;
    }
    
    // 9. RENOMEAR
    pastaEscolhida.setName(novoNome);
    
    ui.alert(
      '✅ Sucesso',
      `Pasta renomeada de:\n"${nomeAtual}"\n\nPara:\n"${novoNome}"`,
      ui.ButtonSet.OK
    );
    
    Logger.log(`✅ Pasta renomeada: ${nomeAtual} → ${novoNome}`);
    
  } catch (e) {
    ui.alert('Erro', 'Erro ao renomear pasta: ' + e.message, ui.ButtonSet.OK);
    Logger.log(`❌ Erro ao renomear pasta: ${e.message}`);
  }
}


// =====================================================
// 🔗 GERENCIAR LINKS (COLUNAS E-I)
// =====================================================
function menuGerenciarLinks() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. SOLICITAR APARTAMENTO
  const rApto = ui.prompt(
    '🔗 Gerenciar Links',
    'Digite os 3 dígitos do apartamento:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (rApto.getSelectedButton() !== ui.Button.OK) return;
  
  const apto = rApto.getResponseText().trim();
  if (!/^\d{3}$/.test(apto)) {
    ui.alert('Erro', 'Digite exatamente 3 dígitos.', ui.ButtonSet.OK);
    return;
  }
  
  // 2. BUSCAR DADOS DO APARTAMENTO
  const abaContratos = ss.getSheetByName(CONFIG_CONTRATOS.abaContratos);
  const abaLinks = ss.getSheetByName(CONFIG_CONTRATOS.abaLinks);
  
  if (!abaContratos || !abaLinks) {
    ui.alert('Erro', 'Abas Contratos ou Links não encontradas.', ui.ButtonSet.OK);
    return;
  }
  
  const dadosContratos = abaContratos.getDataRange().getValues();
  let linhaContrato = -1;
  let linkPasta = null;
  
  for (let i = 1; i < dadosContratos.length; i++) {
    if ((dadosContratos[i][0] || '').toString().includes(apto)) {
      linhaContrato = i + 1;
      linkPasta = dadosContratos[i][COL_CONTRATOS.linkPasta - 1];
      break;
    }
  }
  
  if (linhaContrato === -1) {
    ui.alert('Erro', 'Apartamento não encontrado.', ui.ButtonSet.OK);
    return;
  }
  
  if (!linkPasta || !linkPasta.includes('/folders/')) {
    ui.alert('Erro', 'Apartamento não possui pasta vinculada (coluna G).', ui.ButtonSet.OK);
    return;
  }
  
  // 3. LISTAR ARQUIVOS DA PASTA
  try {
    const pastaId = linkPasta.split('/folders/')[1].split('?')[0];
    const pasta = DriveApp.getFolderById(pastaId);
    const arquivos = pasta.getFiles();
    const listaArquivos = [];
    
    while (arquivos.hasNext()) {
      const arq = arquivos.next();
      listaArquivos.push({
        nome: arq.getName(),
        url: arq.getUrl(),
        tipo: identificarTipoArquivo(arq)
      });
    }
    
    if (listaArquivos.length === 0) {
      ui.alert('Erro', 'Nenhum arquivo encontrado na pasta.', ui.ButtonSet.OK);
      return;
    }
    
    // 4. MOSTRAR LISTA DE ARQUIVOS E COLUNAS
    let mensagem = `📋 ARQUIVOS DO APTO ${apto}\n`;
    mensagem += '═════════════════════════════════════════\n\n';
    
    listaArquivos.forEach((arq, idx) => {
      mensagem += `${idx + 1}. ${arq.tipo} ${arq.nome}\n`;
    });
    
    mensagem += '\n═════════════════════════════════════════\n';
    mensagem += '🔑 COLUNAS DISPONÍVEIS (Aba Links):\n';
    mensagem += '─────────────────────────────────────────\n';
    mensagem += 'E = Foto 3x4\n';
    mensagem += 'F = Documento RG/CPF\n';
    mensagem += 'G = Contrato PDF\n';
    mensagem += 'H = Contrato Assinado\n';
    mensagem += 'I = Declaração\n';
    mensagem += '─────────────────────────────────────────\n\n';
    mensagem += '💡 SINTAXE: LetraNumero, LetraNumero\n';
    mensagem += 'Exemplo: E1, F2, G3\n\n';
    mensagem += 'Digite suas escolhas:';
    
    const rEscolhas = ui.prompt(
      '🔗 Associar Arquivos',
      mensagem,
      ui.ButtonSet.OK_CANCEL
    );
    
    if (rEscolhas.getSelectedButton() !== ui.Button.OK) return;
    
    const entrada = rEscolhas.getResponseText().trim().toUpperCase();
    
    if (!entrada) {
      ui.alert('Cancelado', 'Nenhuma associação informada.', ui.ButtonSet.OK);
      return;
    }
    
    // 5. PROCESSAR ESCOLHAS
    const escolhas = entrada.split(',').map(e => e.trim());
    const associacoes = [];
    const colunasValidas = { 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9 };
    const nomeColunas = {
      'E': 'Foto 3x4',
      'F': 'Documento RG/CPF', 
      'G': 'Contrato PDF',
      'H': 'Contrato Assinado',
      'I': 'Declaração'
    };
    
    for (const escolha of escolhas) {
      const match = escolha.match(/^([E-I])(\d+)$/);
      
      if (!match) {
        ui.alert('Erro', `Formato inválido: "${escolha}"\n\nUse: LetraNumero (ex: E1, F2)`, ui.ButtonSet.OK);
        return;
      }
      
      const letra = match[1];
      const numero = parseInt(match[2]);
      
      if (!colunasValidas[letra]) {
        ui.alert('Erro', `Coluna inválida: "${letra}"\n\nUse apenas: E, F, G, H, I`, ui.ButtonSet.OK);
        return;
      }
      
      if (numero < 1 || numero > listaArquivos.length) {
        ui.alert('Erro', `Número inválido: "${numero}"\n\nEscolha entre 1 e ${listaArquivos.length}`, ui.ButtonSet.OK);
        return;
      }
      
      associacoes.push({
        coluna: colunasValidas[letra],
        colunaLetra: letra,
        colunaNome: nomeColunas[letra],
        arquivoIdx: numero - 1,
        arquivoNome: listaArquivos[numero - 1].nome,
        arquivoUrl: listaArquivos[numero - 1].url
      });
    }
    
    // 6. MOSTRAR RESUMO E CONFIRMAR
    let resumo = '📋 RESUMO DAS ASSOCIAÇÕES\n';
    resumo += '═════════════════════════════════════════\n\n';
    
    associacoes.forEach(a => {
      resumo += `✅ Coluna ${a.colunaLetra} (${a.colunaNome})\n`;
      resumo += `   → ${a.arquivoNome}\n\n`;
    });
    
    resumo += '═════════════════════════════════════════\n';
    resumo += 'Confirmar associações?';
    
    const confirmar = ui.alert('Confirmar', resumo, ui.ButtonSet.YES_NO);
    
    if (confirmar !== ui.Button.YES) {
      ui.alert('Cancelado', 'Associações canceladas.', ui.ButtonSet.OK);
      return;
    }
    
    // 7. SALVAR NA ABA LINKS
    associacoes.forEach(a => {
      abaLinks.getRange(linhaContrato, a.coluna).setValue(a.arquivoUrl);
    });
    
    ui.alert(
      '✅ Links Atualizados!',
      `${associacoes.length} link(s) associado(s) com sucesso na aba Links.`,
      ui.ButtonSet.OK
    );
    
    Logger.log(`✅ Links atualizados para Apto ${apto}: ${associacoes.length} associação(ões)`);
    
  } catch (e) {
    ui.alert('Erro', 'Erro ao gerenciar links: ' + e.message, ui.ButtonSet.OK);
  }
}


// =====================================================
// 🔧 FUNÇÕES AUXILIARES
// =====================================================

function obterDadosApartamento(apto) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName(CONFIG_CONTRATOS.abaContratos);
  const dados = aba.getDataRange().getValues();
  
  for (let i = 1; i < dados.length; i++) {
    if ((dados[i][0] || '').toString().includes(apto)) {
      return {
        apto: dados[i][0],
        inquilino: dados[i][COL_CONTRATOS.inquilino - 1],
        linkPasta: dados[i][COL_CONTRATOS.linkPasta - 1]
      };
    }
  }
  
  return null;
}

// =====================================================
// 🔧 IDENTIFICAR TIPO DE ARQUIVO
// =====================================================
function identificarTipoArquivo(arquivo) {
  const nome = arquivo.getName().toUpperCase();
  const mime = arquivo.getMimeType().toLowerCase();
  
  // Por nome padronizado
  if (nome.includes('CONTRATO_ASS')) return '✅ Contrato Assinado';
  if (nome.includes('CONTRATO')) return '📄 Contrato';
  if (nome.includes('DECLARACAO')) return '📋 Declaração';
  if (nome.includes('FOTO')) return '📸 Foto';
  if (nome.includes('DOC_')) return '📎 Documento';
  
  // Por MIME type
  if (mime.includes('pdf')) return '📄 PDF';
  if (mime.includes('document')) return '📘 DOC';
  if (mime.includes('image/png')) return '🖼️ PNG';
  if (mime.includes('image/jpeg') || mime.includes('image/jpg')) return '🖼️ JPEG';
  if (mime.includes('image')) return '🖼️ Imagem';
  
  return '📁 Arquivo';
}


// =====================================================
// BASE250 | MÓDULO 4 – MENU PRINCIPAL
// ARQUIVO: V4_M04.R6-BASE250_Menu
// REVISÃO: REV_06 – 01/02/2026 / 23:00
// =====================================================
// RESPONSABILIDADE:
// - Construir o menu principal do sistema
// - Expor acessos aos fluxos disponíveis
// - Centralizar ações do usuário
// ⚠️ NÃO contém lógica de negócio
//
// CHANGELOG V4_M04.R6:
// - ✅ NOVA: Opção "Validar/Padronizar Dados"
// - ✅ NOVA: Opção "Diagnosticar Cabeçalhos Forms"
// - ✅ Mantido: Todas as outras opções
// =====================================================

function onOpen(e) {
  const ui = SpreadsheetApp.getUi();

  // =====================================================
  // MENU 1 – DOCUMENTOS
  // =====================================================
  ui.createMenu('🏢 Base 250 | Documentos')
    
    // ─────────────────────────────────────────────────────
    // SUBMENU: DADOS DO CONTRATO
    // ─────────────────────────────────────────────────────
    .addSubMenu(
      ui.createMenu('📝 Dados do Contrato')
        .addItem('📝 Preencher/Editar Dados', 'menuPreencherDadosContrato')
        .addItem('✅ Validar e Padronizar', 'menuValidarPadronizarDados')
    )
    
    .addSeparator()
    
    // ─────────────────────────────────────────────────────
    // GERAÇÃO DE DOCUMENTOS
    // ─────────────────────────────────────────────────────
    .addItem('📄 Gerar Contrato', 'menuGerarContrato')
    .addItem('📄 Revisar / Atualizar Contrato', 'menuAtualizarContrato')
    .addSeparator()
    .addItem('🧾 Gerar Declaração', 'menuDeclaracaoResidencia')
    .addItem('📄🧾 Contrato + Declaração', 'menuContratoMaisDeclaracao')
    
    .addSeparator()
    
    // ─────────────────────────────────────────────────────
    // IMPORTAÇÃO DO FORMS
    // ─────────────────────────────────────────────────────
    .addSubMenu(
      ui.createMenu('📥 Importação Forms')
        .addItem('📥 Importar dados do Forms', 'menuImportarDoForms')
        .addItem('🔍 Diagnosticar Cabeçalhos', 'menuDiagnosticarForms')
    )
    
    .addSeparator()
    
    .addItem('📊 Ver Resumo', 'menuResumo')
    
    .addSeparator()
    
    // ─────────────────────────────────────────────────────
    // SUBMENU: LISTAR ARQUIVOS
    // ─────────────────────────────────────────────────────
    .addSubMenu(
      ui.createMenu('📋 Listar Arquivos')
        .addItem('📁 De um apartamento', 'menuListarArquivosApto')
        .addSeparator()
        .addItem('🏘️ Todos os apartamentos', 'menuListarTodosApartamentos')
        .addItem('📄 Pasta Documentos', 'menuListarPastaDocumentos')
        .addItem('📸 Pasta Fotos', 'menuListarPastaFotos')
        .addSeparator()
        .addItem('🗂️ TUDO completo', 'menuListarTudoCompleto')
    )
    
    .addSeparator()
    
    // ─────────────────────────────────────────────────────
    // SUBMENU: RENOMEAR / LINKS
    // ─────────────────────────────────────────────────────
    .addSubMenu(
      ui.createMenu('✏️ Renomear / Links')
        .addItem('📁 Renomear Pasta', 'menuRenomearPasta')
        .addSeparator()
        .addItem('📄 Renomear Contrato', 'menuRenomearContrato')
        .addItem('✅ Renomear Contrato Assinado', 'menuRenomearContratoAssinado')
        .addItem('🧾 Renomear Declaração', 'menuRenomearDeclaracao')
        .addItem('📸 Renomear Foto', 'menuRenomearFoto')
        .addItem('📄 Renomear Documento', 'menuRenomearDocumento')
        .addSeparator()
        .addItem('🔗 Gerenciar Links (E-I)', 'menuGerenciarLinks')
    )
    
    .addSeparator()
    .addItem('📚 Encerrar Contrato', 'menuEncerrarContrato')
    
    .addToUi();

  // =====================================================
  // MENU 2 – MENSAGENS
  // =====================================================
  ui.createMenu('📨 Base 250 | Mensagens')
    .addItem('📧 E-mail 1 | Enviar Contrato p/ assinatura', 'menuEnviarContratoEmail')
    .addItem('✅ E-mail 2 | Confirmar Contrato Assinado', 'menuEnviarContratoAssinadoEmail')
    .addItem('🏢 E-mail 3 | Boas-vindas / orientações', 'menuEnviarBoasVindas')
    .addItem('📄 E-mail 4 | Contrato final assinado pelo proprietário', 'menuEnviarContratoFinalEmail')
    .addItem('🧾 E-mail 5 | Declaração de residência', 'menuEnviarDeclaracaoEmail')
    .addSeparator()
    .addSubMenu(
      ui.createMenu('📲 Enviar WhatsApp')
        .addItem('📄 Contrato enviado', 'menuWhatsContratoEnviado')
        .addItem('✅ Contrato assinado', 'menuWhatsContratoAssinado')
        .addItem('🏢 Boas-vindas', 'menuWhatsBoasVindas')
    )
    .addSeparator()
    .addItem('🔍 Buscar Apartamento', 'menuBuscarApto')
    .addItem('⚙️ Sobre', 'menuSobre')
    .addItem('📋 Ver Auditoria', 'menuAbrirAuditoria')
    .addToUi();
}


// =====================================================
// AÇÕES DO MENU (APENAS DISPATCH)
// =====================================================

// Geração normal (status deve ser "Disponível")
function menuGerarContrato() {
  fluxoContrato({ modo: 'GERAR' });
}

// Atualização de contrato existente (ignora status)
function menuAtualizarContrato() {
  fluxoContrato({ modo: 'REGERAR' });
}

// Contrato + Declaração
function menuContratoMaisDeclaracao() {
  const ui = SpreadsheetApp.getUi();
  
  const r = ui.prompt(
    '📄🧾 Contrato + Declaração',
    'Digite os 3 dígitos do apartamento:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (r.getSelectedButton() !== ui.Button.OK) return;
  
  const apto = r.getResponseText().trim();
  
  try {
    // Gerar contrato
    fluxoContrato({ modo: 'GERAR' });
    
    // Aguardar 2 segundos
    Utilities.sleep(2000);
    
    // Gerar declaração
    menuDeclaracaoResidencia();
    
    ui.alert(
      '✅ Concluído',
      'Contrato e Declaração gerados com sucesso!',
      ui.ButtonSet.OK
    );
  } catch (e) {
    ui.alert('Erro', e.message, ui.ButtonSet.OK);
  }
}

// Atalho para auditoria
function menuAbrirAuditoria() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const aba = ss.getSheetByName(CONFIG_CONTRATOS.abaAuditoria);

  if (!aba) {
    ui.alert(
      'Auditoria',
      'Aba de auditoria ainda não existe.',
      ui.ButtonSet.OK
    );
    return;
  }

  ss.setActiveSheet(aba);
}

// Buscar apartamento
function menuBuscarApto() {
  const ui = SpreadsheetApp.getUi();
  
  const r = ui.prompt(
    '🔍 Buscar Apartamento',
    'Digite os 3 dígitos do apartamento:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (r.getSelectedButton() !== ui.Button.OK) return;
  
  const apto = r.getResponseText().trim();
  const dados = obterDadosApartamento(apto);
  
  if (!dados) {
    ui.alert('Erro', 'Apartamento não encontrado.', ui.ButtonSet.OK);
    return;
  }
  
  let info = `🏢 Apartamento: ${dados.apto}\n`;
  info += `👤 Inquilino: ${dados.inquilino || '(vazio)'}\n\n`;
  info += `📁 Pasta: ${dados.linkPasta ? '✅ Sim' : '❌ Não'}\n`;
  
  ui.alert('🔍 Dados do Apartamento', info, ui.ButtonSet.OK);
}

// Sobre
function menuSobre() {
  const ui = SpreadsheetApp.getUi();
  
  ui.alert(
    '⚙️ Base 250 - Sistema de Gestão',
    'Versão: 4.0 (Rev_06)\n' +
    'Data: 02/02/2026\n\n' +
    'Sistema modular de gestão de contratos de locação\n' +
    'Desenvolvido para: Base 250 - Residencial Itacorubi\n\n' +
    '📧 Suporte: eng.diogoj@gmail.com',
    ui.ButtonSet.OK
  );
}


// =====================================================
// BASE250 | MÓDULO 5 – FLUXO DE CONTRATO
// ARQUIVO: V4_M05.R9-BASE250_Contrato
// REVISÃO: REV_09 – 02/02/2026 / 14:00
// =====================================================
// RESPONSABILIDADE:
// - ETAPA 1: Preenchimento interativo de dados
// - ETAPA 2: Validação e padronização
// - ETAPA 3: Geração de contrato
// - Tratamento de erro com backup
//
// CHANGELOG V4_M05.R9:
// - ✅ CORREÇÃO: Datas formatadas como dd/mm/aaaa (não mostra hora)
// - ✅ CORREÇÃO: Valores decimais com VÍRGULA (não ponto)
// - ✅ CORREÇÃO: {{LOCATARIO_TIT}} agora mostra LOCATÁRIO ou LOCATÁRIA
// - ✅ CORREÇÃO: Separador decimal brasileiro em todo o sistema
// - ✅ MELHORIA: Interface de preenchimento com instruções claras
// =====================================================


// =====================================================
// 📋 MAPEAMENTO DE CAMPOS (B-U)
// =====================================================
const CAMPOS_EDITAVEIS = [
  { coluna: 2,  nome: 'Inquilino',         chave: 'inquilino',      tipo: 'TEXTO_MAIUSCULA' },
  { coluna: 3,  nome: 'Valor Aluguel',     chave: 'valorAluguel',   tipo: 'NUMERO' },
  // Colunas 4 e 5 são fórmulas, não editáveis
  { coluna: 6,  nome: 'LINHA (Form)',      chave: 'linhaForm',      tipo: 'NUMERO' },
  { coluna: 7,  nome: 'Link Pasta',        chave: 'linkPasta',      tipo: 'URL' },
  { coluna: 8,  nome: 'Data Entrada',      chave: 'dataEntrada',    tipo: 'DATA' },
  { coluna: 9,  nome: 'Prazo Meses',       chave: 'prazoMeses',     tipo: 'NUMERO' },
  // Coluna 10 é fórmula
  { coluna: 11, nome: 'Gênero',            chave: 'genero',         tipo: 'TEXTO_MAIUSCULA' },
  { coluna: 12, nome: 'Telefone',          chave: 'telefone',       tipo: 'TELEFONE' },
  { coluna: 13, nome: 'Email',             chave: 'email',          tipo: 'EMAIL' },
  { coluna: 14, nome: 'Nacionalidade',     chave: 'nacionalidade',  tipo: 'TEXTO_MAIUSCULA' },
  { coluna: 15, nome: 'Estado Civil',      chave: 'estadoCivil',    tipo: 'TEXTO_MAIUSCULA' },
  { coluna: 16, nome: 'Profissão',         chave: 'profissao',      tipo: 'TEXTO_MAIUSCULA' },
  { coluna: 17, nome: 'CPF',               chave: 'cpf',            tipo: 'CPF' },
  { coluna: 18, nome: 'Endereço',          chave: 'endereco',       tipo: 'TEXTO_MAIUSCULA' },
  { coluna: 19, nome: 'Data Nascimento',   chave: 'dataNascimento', tipo: 'DATA' },
  { coluna: 20, nome: 'Data Emissão',      chave: 'dataEmissao',    tipo: 'DATA' },
  { coluna: 21, nome: 'Caução',            chave: 'caucao',         tipo: 'NUMERO' }
];


// =====================================================
// 🔧 FUNÇÃO AUXILIAR: FORMATAR VALOR PARA EXIBIÇÃO
// ✅ R9: Usa vírgula como separador decimal
// =====================================================
function formatarValorExibicao(valor, tipo) {
  if (valor === null || valor === undefined || valor === '') {
    return '(vazio)';
  }
  
  switch (tipo) {
    case 'DATA':
      // ✅ R9: Formatar data como dd/mm/aaaa
      if (valor instanceof Date) {
        const dia = String(valor.getDate()).padStart(2, '0');
        const mes = String(valor.getMonth() + 1).padStart(2, '0');
        const ano = valor.getFullYear();
        return `${dia}/${mes}/${ano}`;
      }
      // Se já for string no formato correto, retorna
      if (typeof valor === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
        return valor;
      }
      // Tenta converter
      const d = new Date(valor);
      if (!isNaN(d.getTime())) {
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        return `${dia}/${mes}/${ano}`;
      }
      return valor.toString();
      
    case 'NUMERO':
      // ✅ R9: Usar vírgula como separador decimal
      const num = parseFloat(valor);
      if (!isNaN(num)) {
        return num.toFixed(2).replace('.', ',');
      }
      return valor.toString();
      
    default:
      return valor.toString();
  }
}


// =====================================================
// 🔧 FUNÇÃO AUXILIAR: FORMATAR VALOR MONETÁRIO (BR)
// ✅ R9: Sempre usa vírgula como separador decimal
// =====================================================
function formatarValorMonetarioBR(valor) {
  const num = Number(valor);
  if (isNaN(num)) return '0,00';
  return num.toFixed(2).replace('.', ',');
}


// =====================================================
// 1. ETAPA 1 - PREENCHIMENTO INTERATIVO
// ✅ R9: Datas formatadas corretamente, valores com vírgula
// =====================================================
function menuPreencherDadosContrato() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName(CONFIG_CONTRATOS.abaContratos);
  
  // 1. SOLICITAR APARTAMENTO
  const rApto = ui.prompt(
    '📝 Preencher Dados do Contrato',
    'Digite os 3 dígitos do apartamento:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (rApto.getSelectedButton() !== ui.Button.OK) return;
  
  const apto = rApto.getResponseText().trim();
  if (!/^\d{3}$/.test(apto)) {
    ui.alert('Erro', 'Digite exatamente 3 dígitos.', ui.ButtonSet.OK);
    return;
  }
  
  // Localizar linha do apartamento
  const dados = aba.getDataRange().getValues();
  let linha = -1;
  
  for (let i = 1; i < dados.length; i++) {
    if ((dados[i][0] || '').toString().includes(apto)) {
      linha = i + 1;
      break;
    }
  }
  
  if (linha === -1) {
    ui.alert('Erro', 'Apartamento não encontrado.', ui.ButtonSet.OK);
    return;
  }
  
  // 2. LER DADOS ATUAIS
  const dadosLinha = dados[linha - 1];
  
  // ✅ R8: CRIAR BACKUP ANTES DE COMEÇAR
  const backup = {};
  CAMPOS_EDITAVEIS.forEach(campo => {
    backup[campo.chave] = aba.getRange(linha, campo.coluna).getValue();
  });
  Logger.log(`✅ Backup criado para linha ${linha}`);
  
  // 3. CONSTRUIR LISTA DE DADOS COM FORMATAÇÃO CORRETA
  function construirListaDados(alteracoesPendentes) {
    let lista = `📋 DADOS ATUAIS DO APARTAMENTO ${apto}\n`;
    lista += '═══════════════════════════════════════════════════\n\n';
    
    CAMPOS_EDITAVEIS.forEach((campo, idx) => {
      const valor = dadosLinha[campo.coluna - 1];
      const letra = String.fromCharCode(64 + campo.coluna);
      
      let valorExibicao;
      if (alteracoesPendentes && alteracoesPendentes[campo.chave] !== undefined) {
        valorExibicao = `${alteracoesPendentes[campo.chave]} ✏️ (alterado)`;
      } else {
        // ✅ R9: Formatar valor conforme tipo
        valorExibicao = formatarValorExibicao(valor, campo.tipo);
      }
      
      lista += `${idx + 1}. [${letra}] ${campo.nome}: ${valorExibicao}\n`;
    });
    
    lista += '\n═══════════════════════════════════════════════════\n';
    lista += '\n💡 COMO EDITAR:\n';
    lista += '• Digite o NÚMERO do campo para editar (ex: 1)\n';
    lista += '• Digite "SALVAR" para SALVAR e sair\n';
    lista += '• Digite "CANC" para CANCELAR sem salvar\n';
    
    return lista;
  }
  
  // 4. LOOP DE EDIÇÃO
  const alteracoes = {};
  let continuar = true;
  let listaDados = construirListaDados(null);
  
  while (continuar) {
    const rEscolha = ui.prompt(
      '📝 Editar Dados',
      listaDados,
      ui.ButtonSet.OK_CANCEL
    );
    
    if (rEscolha.getSelectedButton() !== ui.Button.OK) {
      continuar = false;
      break;
    }
    
    const escolha = rEscolha.getResponseText().trim().toUpperCase();
    
    // CANCELAR
    if (escolha === 'CANC' || escolha === 'C') {
      ui.alert('Cancelado', 'Nenhuma alteração foi salva.', ui.ButtonSet.OK);
      return;
    }
    
    // SALVAR
    if (escolha === 'SALVAR' || escolha === 'S' || escolha === '0') {
      continuar = false;
      break;
    }
    
    // EDITAR CAMPO
    const numCampo = parseInt(escolha);
    if (isNaN(numCampo) || numCampo < 1 || numCampo > CAMPOS_EDITAVEIS.length) {
      ui.alert('Erro', `Digite um número de 1 a ${CAMPOS_EDITAVEIS.length}, ou "SALVAR" / "CANC".`, ui.ButtonSet.OK);
      continue;
    }
    
    const campo = CAMPOS_EDITAVEIS[numCampo - 1];
    const valorAtual = alteracoes[campo.chave] !== undefined 
      ? alteracoes[campo.chave] 
      : formatarValorExibicao(dadosLinha[campo.coluna - 1], campo.tipo);
    
    // Instruções específicas por tipo
    let instrucoes = '';
    switch (campo.tipo) {
      case 'DATA':
        instrucoes = '\n\n📅 Formato: dd/mm/aaaa (ex: 15/03/2026)';
        break;
      case 'NUMERO':
        instrucoes = '\n\n💰 Use vírgula para decimais (ex: 1200,00)';
        break;
      case 'CPF':
        instrucoes = '\n\n🆔 Formato: 000.000.000-00 ou só números';
        break;
      case 'TELEFONE':
        instrucoes = '\n\n📞 Formato: (00) 00000-0000';
        break;
    }
    
    const rNovoValor = ui.prompt(
      `✏️ Editar: ${campo.nome}`,
      `Valor atual: ${valorAtual}${instrucoes}\n\n` +
      `Digite o novo valor:\n` +
      `(Deixe em branco para manter o valor atual)`,
      ui.ButtonSet.OK_CANCEL
    );
    
    if (rNovoValor.getSelectedButton() !== ui.Button.OK) continue;
    
    const novoValor = rNovoValor.getResponseText().trim();
    
    // Se digitou algo, guarda a alteração
    if (novoValor !== '') {
      alteracoes[campo.chave] = novoValor;
      
      // Reconstruir lista com alterações pendentes
      listaDados = construirListaDados(alteracoes);
    }
  }
  
  // 5. VERIFICAR SE HOUVE ALTERAÇÕES
  if (Object.keys(alteracoes).length === 0) {
    ui.alert('ℹ️ Info', 'Nenhuma alteração foi feita.', ui.ButtonSet.OK);
    return;
  }
  
  // 6. MOSTRAR RESUMO E CONFIRMAR
  let resumo = '📋 RESUMO DAS ALTERAÇÕES\n';
  resumo += '═══════════════════════════════════════════════════\n\n';
  
  for (const [chave, valor] of Object.entries(alteracoes)) {
    const campo = CAMPOS_EDITAVEIS.find(c => c.chave === chave);
    const valorAnterior = formatarValorExibicao(dadosLinha[campo.coluna - 1], campo.tipo);
    resumo += `${campo.nome}:\n`;
    resumo += `  Antes: ${valorAnterior}\n`;
    resumo += `  Depois: ${valor}\n\n`;
  }
  
  resumo += '═══════════════════════════════════════════════════\n';
  resumo += 'Confirmar alterações?';
  
  const confirmar = ui.alert('Confirmar', resumo, ui.ButtonSet.YES_NO);
  
  if (confirmar !== ui.Button.YES) {
    ui.alert('Cancelado', 'Nenhuma alteração foi salva.', ui.ButtonSet.OK);
    return;
  }
  
  // 7. SALVAR ALTERAÇÕES COM TRATAMENTO DE ERRO
  try {
    for (const [chave, valor] of Object.entries(alteracoes)) {
      const campo = CAMPOS_EDITAVEIS.find(c => c.chave === chave);
      
      // Aplicar formatação conforme tipo
      let valorFormatado = valor;
      
      switch (campo.tipo) {
        case 'TEXTO_MAIUSCULA':
          valorFormatado = valor.toString().toUpperCase();
          break;
        case 'EMAIL':
          valorFormatado = valor.toString().toLowerCase();
          break;
        case 'CPF':
          valorFormatado = formatarCPFContrato(valor);
          break;
        case 'TELEFONE':
          valorFormatado = formatarTelefoneContrato(valor);
          break;
        case 'NUMERO':
          // ✅ R9: Aceita vírgula como separador decimal
          valorFormatado = parseFloat(valor.toString().replace(',', '.')) || 0;
          break;
        case 'DATA':
          // Manter como string se já estiver no formato correto
          valorFormatado = valor;
          break;
        default:
          valorFormatado = valor;
      }
      
      aba.getRange(linha, campo.coluna).setValue(valorFormatado);
    }
    
    ui.alert(
      '✅ Dados Salvos!',
      `${Object.keys(alteracoes).length} campo(s) atualizado(s) com sucesso!\n\n` +
      'Próximos passos:\n' +
      '• Use "Validar/Padronizar" para verificar formatação\n' +
      '• Use "Gerar Contrato" quando estiver pronto',
      ui.ButtonSet.OK
    );
    
    Logger.log(`✅ Alterações salvas para Apto ${apto}: ${Object.keys(alteracoes).length} campo(s)`);
    
  } catch (err) {
    // ERRO: Perguntar se quer restaurar
    const resposta = ui.alert(
      '⚠️ Erro ao Salvar',
      `Erro: ${err.message}\n\n` +
      `Deseja restaurar os dados anteriores?`,
      ui.ButtonSet.YES_NO
    );
    
    if (resposta === ui.Button.YES) {
      try {
        CAMPOS_EDITAVEIS.forEach(campo => {
          aba.getRange(linha, campo.coluna).setValue(backup[campo.chave]);
        });
        ui.alert('✅ Restaurado', 'Dados anteriores restaurados.', ui.ButtonSet.OK);
      } catch (e) {
        ui.alert('❌ Erro', 'Não foi possível restaurar. Verifique manualmente.', ui.ButtonSet.OK);
      }
    }
  }
}


// =====================================================
// 2. VALIDAR E PADRONIZAR DADOS
// =====================================================
function menuValidarPadronizarDados() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName(CONFIG_CONTRATOS.abaContratos);
  
  // 1. SOLICITAR APARTAMENTO
  const rApto = ui.prompt(
    '✅ Validar e Padronizar Dados',
    'Digite os 3 dígitos do apartamento:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (rApto.getSelectedButton() !== ui.Button.OK) return;
  
  const apto = rApto.getResponseText().trim();
  if (!/^\d{3}$/.test(apto)) {
    ui.alert('Erro', 'Digite exatamente 3 dígitos.', ui.ButtonSet.OK);
    return;
  }
  
  // Localizar linha
  const dados = aba.getDataRange().getValues();
  let linha = -1;
  
  for (let i = 1; i < dados.length; i++) {
    if ((dados[i][0] || '').toString().includes(apto)) {
      linha = i + 1;
      break;
    }
  }
  
  if (linha === -1) {
    ui.alert('Erro', 'Apartamento não encontrado.', ui.ButtonSet.OK);
    return;
  }
  
  const dadosLinha = dados[linha - 1];
  
  // 2. VALIDAR CAMPOS
  const erros = [];
  const avisos = [];
  const correcoes = [];
  
  // VALIDAR NOME (B)
  const nome = dadosLinha[COL_CONTRATOS.inquilino - 1];
  if (!nome || nome.toString().trim().length < 3) {
    erros.push('❌ Nome: Vazio ou muito curto');
  } else if (nome !== nome.toString().toUpperCase()) {
    correcoes.push({
      coluna: COL_CONTRATOS.inquilino,
      nome: 'Nome',
      antes: nome,
      depois: nome.toString().toUpperCase()
    });
  }
  
  // VALIDAR CPF (Q)
  const cpf = dadosLinha[COL_CONTRATOS.cpf - 1];
  if (!cpf) {
    erros.push('❌ CPF: Não preenchido');
  } else {
    const cpfNumeros = cpf.toString().replace(/\D/g, '');
    if (cpfNumeros.length !== 11) {
      erros.push('❌ CPF: Deve ter 11 dígitos');
    } else if (!validarCPFContrato(cpfNumeros)) {
      erros.push('❌ CPF: Número inválido');
    } else {
      const cpfFormatado = formatarCPFContrato(cpfNumeros);
      if (cpf !== cpfFormatado) {
        correcoes.push({
          coluna: COL_CONTRATOS.cpf,
          nome: 'CPF',
          antes: cpf,
          depois: cpfFormatado
        });
      }
    }
  }
  
  // VALIDAR EMAIL (M)
  const email = dadosLinha[COL_CONTRATOS.email - 1];
  if (!email || !email.toString().includes('@')) {
    erros.push('❌ Email: Inválido ou não preenchido');
  } else if (email !== email.toString().toLowerCase()) {
    correcoes.push({
      coluna: COL_CONTRATOS.email,
      nome: 'Email',
      antes: email,
      depois: email.toString().toLowerCase()
    });
  }
  
  // VALIDAR TELEFONE (L)
  const telefone = dadosLinha[COL_CONTRATOS.telefone - 1];
  if (!telefone) {
    avisos.push('⚠️ Telefone: Não preenchido');
  } else {
    const telFormatado = formatarTelefoneContrato(telefone);
    if (telefone !== telFormatado) {
      correcoes.push({
        coluna: COL_CONTRATOS.telefone,
        nome: 'Telefone',
        antes: telefone,
        depois: telFormatado
      });
    }
  }
  
  // VALIDAR NACIONALIDADE (N)
  const nacionalidade = dadosLinha[COL_CONTRATOS.nacionalidade - 1];
  if (!nacionalidade) {
    avisos.push('⚠️ Nacionalidade: Não preenchida');
  } else if (nacionalidade !== nacionalidade.toString().toUpperCase()) {
    correcoes.push({
      coluna: COL_CONTRATOS.nacionalidade,
      nome: 'Nacionalidade',
      antes: nacionalidade,
      depois: nacionalidade.toString().toUpperCase()
    });
  }
  
  // VALIDAR ESTADO CIVIL (O)
  const estadoCivil = dadosLinha[COL_CONTRATOS.estadoCivil - 1];
  if (!estadoCivil) {
    avisos.push('⚠️ Estado Civil: Não preenchido');
  } else if (estadoCivil !== estadoCivil.toString().toUpperCase()) {
    correcoes.push({
      coluna: COL_CONTRATOS.estadoCivil,
      nome: 'Estado Civil',
      antes: estadoCivil,
      depois: estadoCivil.toString().toUpperCase()
    });
  }
  
  // VALIDAR PROFISSÃO (P)
  const profissao = dadosLinha[COL_CONTRATOS.profissao - 1];
  if (!profissao) {
    avisos.push('⚠️ Profissão: Não preenchida');
  } else if (profissao !== profissao.toString().toUpperCase()) {
    correcoes.push({
      coluna: COL_CONTRATOS.profissao,
      nome: 'Profissão',
      antes: profissao,
      depois: profissao.toString().toUpperCase()
    });
  }
  
  // VALIDAR ENDEREÇO (R)
  const endereco = dadosLinha[COL_CONTRATOS.endereco - 1];
  if (!endereco || endereco.toString().length < 10) {
    avisos.push('⚠️ Endereço: Não preenchido ou muito curto');
  } else if (endereco !== endereco.toString().toUpperCase()) {
    correcoes.push({
      coluna: COL_CONTRATOS.endereco,
      nome: 'Endereço',
      antes: endereco,
      depois: endereco.toString().toUpperCase()
    });
  }
  
  // VALIDAR GÊNERO (K)
  const genero = dadosLinha[COL_CONTRATOS.genero - 1];
  if (!genero) {
    erros.push('❌ Gênero: Não preenchido (necessário para contrato)');
  } else {
    const generoUpper = genero.toString().toUpperCase();
    if (generoUpper !== 'MASCULINO' && generoUpper !== 'FEMININO') {
      avisos.push('⚠️ Gênero: Deve ser MASCULINO ou FEMININO');
    }
  }
  
  // VALIDAR VALOR ALUGUEL (C)
  const valorAluguel = dadosLinha[COL_CONTRATOS.valorAluguel - 1];
  if (!valorAluguel || Number(valorAluguel) <= 0) {
    erros.push('❌ Valor Aluguel: Não preenchido ou inválido');
  }
  
  // VALIDAR CAUÇÃO (U)
  const caucao = dadosLinha[COL_CONTRATOS.caucao - 1];
  if (caucao === '' || caucao === null || caucao === undefined) {
    avisos.push('⚠️ Caução: Não preenchida');
  }
  
  // VALIDAR DATA ENTRADA (H)
  const dataEntrada = dadosLinha[COL_CONTRATOS.dataEntrada - 1];
  if (!dataEntrada) {
    erros.push('❌ Data Entrada: Não preenchida');
  }
  
  // VALIDAR PRAZO (I)
  const prazoMeses = dadosLinha[COL_CONTRATOS.prazoMeses - 1];
  if (!prazoMeses || Number(prazoMeses) <= 0) {
    erros.push('❌ Prazo Meses: Não preenchido ou inválido');
  }
  
  // 3. MONTAR RESULTADO
  let resultado = `📋 RESULTADO DA VALIDAÇÃO - APTO ${apto}\n`;
  resultado += '═══════════════════════════════════════════════════\n\n';
  
  if (erros.length > 0) {
    resultado += '❌ ERROS (devem ser corrigidos):\n';
    resultado += '───────────────────────────────────────────────────\n';
    erros.forEach(e => resultado += e + '\n');
    resultado += '\n';
  }
  
  if (avisos.length > 0) {
    resultado += '⚠️ AVISOS:\n';
    resultado += '───────────────────────────────────────────────────\n';
    avisos.forEach(a => resultado += a + '\n');
    resultado += '\n';
  }
  
  if (correcoes.length > 0) {
    resultado += '🔧 CORREÇÕES DISPONÍVEIS:\n';
    resultado += '───────────────────────────────────────────────────\n';
    correcoes.forEach(c => {
      resultado += `${c.nome}: "${c.antes}" → "${c.depois}"\n`;
    });
    resultado += '\n';
  }
  
  if (erros.length === 0 && avisos.length === 0 && correcoes.length === 0) {
    resultado += '✅ Todos os dados estão corretos e padronizados!\n';
    ui.alert('✅ Validação Concluída', resultado, ui.ButtonSet.OK);
    return;
  }
  
  // 4. SE TEM CORREÇÕES, PERGUNTAR SE APLICA
  if (correcoes.length > 0) {
    resultado += '═══════════════════════════════════════════════════\n';
    resultado += `Deseja aplicar as ${correcoes.length} correção(ões) automáticas?`;
    
    const aplicar = ui.alert('Validação', resultado, ui.ButtonSet.YES_NO);
    
    if (aplicar === ui.Button.YES) {
      try {
        correcoes.forEach(c => {
          aba.getRange(linha, c.coluna).setValue(c.depois);
        });
        
        ui.alert(
          '✅ Correções Aplicadas',
          `${correcoes.length} campo(s) padronizado(s) com sucesso!`,
          ui.ButtonSet.OK
        );
      } catch (e) {
        ui.alert('Erro', 'Erro ao aplicar correções: ' + e.message, ui.ButtonSet.OK);
      }
    }
  } else {
    ui.alert('Validação', resultado, ui.ButtonSet.OK);
  }
}


// =====================================================
// 3. FLUXO DE CONTRATO
// =====================================================
function fluxoContrato(opcoes) {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName(CONFIG_CONTRATOS.abaContratos);
  const abaLinks = ss.getSheetByName(CONFIG_CONTRATOS.abaLinks);
  
  const modo = opcoes.modo || 'GERAR';
  
  // 1. SOLICITAR APARTAMENTO
  const rApto = ui.prompt(
    modo === 'REGERAR' ? '📄 Revisar Contrato' : '📄 Gerar Contrato',
    'Digite os 3 dígitos do apartamento:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (rApto.getSelectedButton() !== ui.Button.OK) return;
  
  const apto = rApto.getResponseText().trim();
  if (!/^\d{3}$/.test(apto)) {
    ui.alert('Erro', 'Digite exatamente 3 dígitos.', ui.ButtonSet.OK);
    return;
  }
  
  // Localizar linha
  const dados = aba.getDataRange().getValues();
  let linha = -1;
  
  for (let i = 1; i < dados.length; i++) {
    if ((dados[i][0] || '').toString().includes(apto)) {
      linha = i;
      break;
    }
  }
  
  if (linha === -1) {
    ui.alert('Erro', 'Apartamento não encontrado.', ui.ButtonSet.OK);
    return;
  }
  
  const dadosLinha = dados[linha];
  
  // 2. VALIDAR DADOS COMPLETOS
  const camposVazios = [];
  
  CAMPOS_OBRIGATORIOS.forEach((colIdx) => {
    if (!dadosLinha[colIdx - 1] || dadosLinha[colIdx - 1] === '') {
      camposVazios.push(colIdx);
    }
  });
  
  if (camposVazios.length > 0) {
    ui.alert(
      '❌ Dados Incompletos',
      `Faltam ${camposVazios.length} campo(s) obrigatório(s).\n\n` +
      'Complete os dados antes de gerar o contrato.\n' +
      'Use: Menu → 📝 Preencher Dados do Contrato',
      ui.ButtonSet.OK
    );
    return;
  }
  
  // 3. GERAR CONTRATO
  try {
    Logger.log('Iniciando geração de contrato para apartamento ' + apto);
    
    const resultado = gerarDocumentoContrato(apto, dadosLinha);
    
    // Atualizar aba Links com link do PDF
    abaLinks.getRange(linha + 1, COL_LINKS.linkContratoPDF).setValue(resultado.linkPdf);
    
    ui.alert(
      '✅ Contrato Gerado!',
      `Contrato do apartamento ${apto} gerado com sucesso!\n\n` +
      `📄 DOC: ${resultado.linkDoc}\n` +
      `📕 PDF: ${resultado.linkPdf}`,
      ui.ButtonSet.OK
    );
    
  } catch (e) {
    const resposta = ui.alert(
      '❌ Erro ao Gerar Contrato',
      `Erro encontrado:\n${e.message}\n\n` +
      `Possíveis causas:\n` +
      `• Pasta do contrato não existe\n` +
      `• Template não encontrado\n` +
      `• Permissões insuficientes no Drive\n\n` +
      `Deseja revisar os dados do apartamento?`,
      ui.ButtonSet.YES_NO
    );
    
    if (resposta === ui.Button.YES) {
      ui.alert(
        '📋 Verificar',
        `Apartamento ${apto}:\n\n` +
        `1. Confirme que a coluna G tem link da pasta\n` +
        `2. Verifique se a pasta existe no Drive\n` +
        `3. Confirme que o template está acessível\n\n` +
        `Template ID: ${CONFIG_CONTRATOS.templateContratoId}`,
        ui.ButtonSet.OK
      );
    }
  }
}


// =====================================================
// 4. GERAR DOCUMENTO
// =====================================================
function gerarDocumentoContrato(apto, dadosLinha) {
  const template = DriveApp.getFileById(CONFIG_CONTRATOS.templateContratoId);
  const linkPasta = dadosLinha[COL_CONTRATOS.linkPasta - 1];
  
  if (!linkPasta) {
    throw new Error('Pasta do contrato não encontrada (Coluna G vazia)');
  }
  
  const pastaId = linkPasta.split('/folders/')[1].split('?')[0];
  const pasta = DriveApp.getFolderById(pastaId);
  
  // Gerar nome do arquivo
  const nomeNormalizado = normalizarNomeArquivo(dadosLinha[COL_CONTRATOS.inquilino - 1]);
  const dataISOStr = Utilities.formatDate(new Date(), 'GMT-3', 'yyyy-MM-dd');
  const nomeArquivo = `CONTRATO_${apto}_${nomeNormalizado}_${dataISOStr}`;
  
  // Copiar template
  const docFile = template.makeCopy(nomeArquivo, pasta);
  const doc = DocumentApp.openById(docFile.getId());
  const body = doc.getBody();
  
  // Montar placeholders
  const mapa = montarMapaPlaceholders(apto, dadosLinha);
  
  // Substituir placeholders
  Object.entries(mapa).forEach(([k, v]) => {
    body.replaceText(escapeRegexContrato(k), String(v ?? ''));
  });
  
  doc.saveAndClose();
  
  // Gerar PDF
  Utilities.sleep(1200);
  const pdfBlob = DriveApp.getFileById(docFile.getId())
    .getAs(MimeType.PDF)
    .setName(nomeArquivo + '.pdf');
  
  // Salvar PDF direto na pasta principal
  const pdfFile = pasta.createFile(pdfBlob);
  
  return {
    linkDoc: docFile.getUrl(),
    linkPdf: pdfFile.getUrl()
  };
}


// =====================================================
// 5. PLACEHOLDERS
// ✅ R9: LOCATARIO_TIT agora mostra "LOCATÁRIO" ou "LOCATÁRIA"
// ✅ R9: Valores monetários com vírgula
// =====================================================
function montarMapaPlaceholders(apto, dadosLinha) {
  const genero = dadosLinha[COL_CONTRATOS.genero - 1];
  const portador = genero === 'FEMININO' ? 'portadora' : 'portador';
  const artigo = genero === 'FEMININO' ? 'a' : 'o';
  const artigoMaius = genero === 'FEMININO' ? 'A' : 'O';
  const ao = genero === 'FEMININO' ? 'à' : 'ao';
  
  // ✅ R9: LOCATARIO_TIT deve ser "LOCATÁRIO" ou "LOCATÁRIA"
  const locatarioTit = genero === 'FEMININO' ? 'LOCATÁRIA' : 'LOCATÁRIO';
  
  const valorAluguel = Number(dadosLinha[COL_CONTRATOS.valorAluguel - 1]);
  const valorCaucao = Number(dadosLinha[COL_CONTRATOS.caucao - 1]);
  const prazoMeses = Number(dadosLinha[COL_CONTRATOS.prazoMeses - 1]);
  
  return {
    '{{LOCATARIO_NOME}}': dadosLinha[COL_CONTRATOS.inquilino - 1],
    '{{NACIONALIDADE}}': dadosLinha[COL_CONTRATOS.nacionalidade - 1],
    '{{ESTADO_CIVIL}}': dadosLinha[COL_CONTRATOS.estadoCivil - 1],
    '{{PROFISSAO}}': dadosLinha[COL_CONTRATOS.profissao - 1],
    '{{LOCATARIO_PORTADOR}}': portador,
    '{{LOCATARIO_CPF}}': dadosLinha[COL_CONTRATOS.cpf - 1],
    '{{ENDERECO_COMPLETO}}': dadosLinha[COL_CONTRATOS.endereco - 1],
    // ✅ R9: CORRIGIDO - Agora mostra "LOCATÁRIO" ou "LOCATÁRIA"
    '{{LOCATARIO_TIT}}': locatarioTit,
    '{{APARTAMENTO}}': apto,
    '{{PRAZO}}': prazoMeses,
    '{{PRAZO_EXTENSO}}': numeroParaExtenso(prazoMeses),
    '{{DATA_ENTRADA}}': formatarData(dadosLinha[COL_CONTRATOS.dataEntrada - 1]),
    '{{DATA_SAIDA}}': formatarData(dadosLinha[COL_CONTRATOS.dataFim - 1]),
    '{{LOC_ART}}': artigo,
    // ✅ R9: Valores com vírgula como separador decimal
    '{{VALOR_ALUGUEL}}': formatarValorMonetarioBR(valorAluguel),
    '{{VALOR_EXTENSO}}': valorParaExtenso(valorAluguel),
    '{{LOC_ART_MAIUS}}': artigoMaius,
    '{{LOCATARIO_AO}}': ao,
    '{{VALOR_CAUCAO}}': formatarValorMonetarioBR(valorCaucao),
    '{{VALOR_CAUCAO_EXTENSO}}': valorParaExtenso(valorCaucao),
    '{{DATA_EXTENSO}}': dataPorExtensoContrato(new Date())
  };
}


// =====================================================
// 6. FUNÇÕES AUXILIARES
// =====================================================
function formatarCPFContrato(cpf) {
  if (!cpf) return '';
  const numeros = cpf.toString().replace(/\D/g, '');
  if (numeros.length === 11) {
    return `${numeros.substring(0, 3)}.${numeros.substring(3, 6)}.${numeros.substring(6, 9)}-${numeros.substring(9)}`;
  }
  return cpf;
}

function formatarTelefoneContrato(tel) {
  if (!tel) return '';
  const nums = tel.toString().replace(/\D/g, '');
  if (nums.length === 11) {
    return `(${nums.substring(0,2)}) ${nums.substring(2,7)}-${nums.substring(7,11)}`;
  }
  if (nums.length === 10) {
    return `(${nums.substring(0,2)}) ${nums.substring(2,6)}-${nums.substring(6,10)}`;
  }
  return tel;
}

function validarCPFContrato(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = soma % 11;
  let digitoVerificador1 = resto < 2 ? 0 : 11 - resto;
  if (parseInt(cpf.charAt(9)) !== digitoVerificador1) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = soma % 11;
  let digitoVerificador2 = resto < 2 ? 0 : 11 - resto;
  if (parseInt(cpf.charAt(10)) !== digitoVerificador2) return false;
  
  return true;
}

function escapeRegexContrato(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function dataPorExtensoContrato(data) {
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
                 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const dia = data.getDate();
  const mes = meses[data.getMonth()];
  const ano = data.getFullYear();
  return `${dia} de ${mes} de ${ano}`;
}

// =====================================================
// BASE250 | MÓDULO 6 – DECLARAÇÃO DE RESIDÊNCIA
// ARQUIVO: V4_M06.R4-BASE250_Declaracao
// REVISÃO: REV_04 – 02/02/2026 / 14:00
// =====================================================
// RESPONSABILIDADE:
// - Gerar declarações de residência
// - Padronizar textos e dados pessoais
// - Integrar com fluxo contratual
// ⚠️ Não cria pasta
// ⚠️ Não altera status
//
// CHANGELOG V4_M06.R4:
// - ✅ CORREÇÃO CRÍTICA: Mapeamento de colunas corrigido
// - ✅ CORREÇÃO: linkPasta agora usa COL_CONTRATOS.linkPasta
// - ✅ CORREÇÃO: Erro "split" não ocorre mais
// - ✅ Datas formatadas como dd/mm/aaaa
// =====================================================

// =====================================================
// MENU – GERAR DECLARAÇÃO
// =====================================================
function menuDeclaracaoResidencia() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName(CONFIG_CONTRATOS.abaContratos);

  if (!aba) {
    ui.alert('Erro', 'Aba Contratos não encontrada.', ui.ButtonSet.OK);
    return;
  }

  const r = ui.prompt(
    '📋 Declaração de Residência',
    'Digite os 3 dígitos do apartamento:',
    ui.ButtonSet.OK_CANCEL
  );
  if (r.getSelectedButton() !== ui.Button.OK) return;

  const digitos = r.getResponseText().trim();
  if (!/^\d{3}$/.test(digitos)) {
    ui.alert('Erro', 'Digite exatamente 3 dígitos.', ui.ButtonSet.OK);
    return;
  }

  const dados = aba.getDataRange().getValues();
  let d = null;
  let linha = null;

  for (let i = 1; i < dados.length; i++) {
    if ((dados[i][0] || '').toString().includes(digitos)) {
      // ✅ R4: CORREÇÃO - Usar COL_CONTRATOS para mapeamento correto
      d = {
        apto: dados[i][COL_CONTRATOS.apto - 1],           // A
        inquilino: dados[i][COL_CONTRATOS.inquilino - 1], // B
        valorAluguel: dados[i][COL_CONTRATOS.valorAluguel - 1], // C
        dataInicio: dados[i][COL_CONTRATOS.dataEntrada - 1],    // H
        prazo: dados[i][COL_CONTRATOS.prazoMeses - 1],          // I
        
        // ✅ R4: CORREÇÃO CRÍTICA - linkPasta na coluna G, não coluna I
        linkPasta: dados[i][COL_CONTRATOS.linkPasta - 1],       // G
        
        // DADOS PESSOAIS
        genero: dados[i][COL_CONTRATOS.genero - 1],             // K
        telefone: dados[i][COL_CONTRATOS.telefone - 1],         // L
        email: dados[i][COL_CONTRATOS.email - 1],               // M
        nacionalidade: dados[i][COL_CONTRATOS.nacionalidade - 1], // N
        estadoCivil: dados[i][COL_CONTRATOS.estadoCivil - 1],   // O
        profissao: dados[i][COL_CONTRATOS.profissao - 1],       // P
        cpf: dados[i][COL_CONTRATOS.cpf - 1],                   // Q
        endereco: dados[i][COL_CONTRATOS.endereco - 1],         // R
        dataNascimento: dados[i][COL_CONTRATOS.dataNascimento - 1], // S
        
        // CELESC
        celescUnidade: dados[i][COL_CONTRATOS.celescUnidade - 1], // V
        celescUC: dados[i][COL_CONTRATOS.celescUC - 1]           // W
      };

      linha = i + 1;
      break;
    }
  }

  if (!d || !d.inquilino) {
    ui.alert('Erro', 'Apartamento não encontrado ou sem inquilino.', ui.ButtonSet.OK);
    return;
  }

  // ✅ R4: Verificação melhorada do link da pasta
  if (!d.linkPasta) {
    ui.alert(
      'Erro', 
      `Apartamento ${digitos} não possui pasta vinculada.\n\n` +
      `Coluna G (Link Pasta) está vazia.\n\n` +
      `Primeiro faça a importação do Forms ou crie a pasta manualmente.`,
      ui.ButtonSet.OK
    );
    return;
  }
  
  // Verificar se o link é válido
  if (!d.linkPasta.toString().includes('/folders/')) {
    ui.alert(
      'Erro', 
      `Link da pasta inválido para o apartamento ${digitos}.\n\n` +
      `Valor encontrado: ${d.linkPasta}\n\n` +
      `O link deve conter "/folders/"`,
      ui.ButtonSet.OK
    );
    return;
  }

  try {
    gerarDeclaracaoResidencia(d);
    ui.alert('✅ Sucesso', 'Declaração gerada, salva e enviada por e-mail.', ui.ButtonSet.OK);
  } catch (e) {
    ui.alert('❌ Erro', 'Erro ao gerar declaração: ' + e.message, ui.ButtonSet.OK);
    Logger.log('❌ Erro declaração: ' + e.message);
    Logger.log('Stack: ' + e.stack);
  }
}

// =====================================================
// GERAR DECLARAÇÃO (DOC + PDF)
// =====================================================
function gerarDeclaracaoResidencia(d) {
  const template = DriveApp.getFileById(CONFIG_DECLARACAO.templateId);

  // ✅ R4: Tratamento de erro melhorado
  if (!d.linkPasta) {
    throw new Error('Link da pasta não encontrado (Coluna G vazia)');
  }
  
  // Extrair ID da pasta
  let pastaId;
  try {
    pastaId = d.linkPasta.split('/folders/')[1].split('?')[0];
  } catch (e) {
    throw new Error(`Não foi possível extrair ID da pasta do link: ${d.linkPasta}`);
  }
  
  const pasta = DriveApp.getFolderById(pastaId);

  // Mês/Ano da emissão
  const mesAno = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    'yyyy-MM'
  );

  const nomeInquilinoNorm = normalizarNomeArquivo(d.inquilino);
  const nomeArquivo = `DECLARACAO_${d.apto}_${nomeInquilinoNorm}_${mesAno}`;

  // Copiar template
  const docFile = template.makeCopy(nomeArquivo, pasta);
  const doc = DocumentApp.openById(docFile.getId());
  const body = doc.getBody();

  // Placeholders
  const mapa = montarMapaPlaceholdersDeclaracao(d);

  // Substituir
  Object.entries(mapa).forEach(([k, v]) => {
    try {
      body.replaceText(escapeRegex(k), String(v ?? ''));
    } catch (e) {
      Logger.log(`⚠️ Erro ao substituir ${k}: ${e.message}`);
    }
  });

  doc.saveAndClose();

  // Gerar PDF
  Utilities.sleep(1200);
  const pdfBlob = DriveApp.getFileById(docFile.getId())
    .getAs(MimeType.PDF)
    .setName(nomeArquivo + '.pdf');

  pasta.createFile(pdfBlob);

  // Enviar email (se tiver email do inquilino)
  if (d.email) {
    try {
      enviarEmailDeclaracaoDireto(
        d.inquilino,
        d.email,
        d.apto,
        pdfBlob
      );
    } catch (e) {
      Logger.log(`⚠️ Erro ao enviar email: ${e.message}`);
    }
  }

  Logger.log(`✅ Declaração gerada para ${d.inquilino}`);
  
  return docFile.getUrl();
}

// =====================================================
// PLACEHOLDERS
// ✅ R4: Datas formatadas corretamente
// =====================================================
function montarMapaPlaceholdersDeclaracao(d) {
  const genero = resolverGenero(d);
  const portador = genero === 'feminino' ? 'portadora' : 'portador';
  const artigo = genero === 'feminino' ? 'a' : 'o';

  return {
    '{{LOCATARIO_PORTADOR}}': portador,
    '{{LOCATARIO_ARTIGO}}': artigo,
    '{{LOCATARIO_NOME}}': (d.inquilino || '').toUpperCase(),
    '{{LOCATARIO_CPF}}': formatarCPF(d.cpf || ''),
    '{{NACIONALIDADE}}': (d.nacionalidade || '').toUpperCase(),
    '{{ESTADO_CIVIL}}': (d.estadoCivil || '').toUpperCase(),
    '{{PROFISSAO}}': (d.profissao || '').toUpperCase(),
    '{{APARTAMENTO}}': d.apto || '',
    // ✅ R4: Datas formatadas como dd/mm/aaaa
    '{{DATA_ENTRADA}}': formatarData(d.dataInicio || new Date()),
    '{{DATA_SAIDA}}': formatarData(adicionarMeses(d.dataInicio || new Date(), d.prazo || 12)),
    '{{CELESC_UNIDADE}}': d.celescUnidade || '',
    '{{CELESC_UC}}': d.celescUC || '',
    '{{DATA_EXTENSO}}': dataPorExtenso(new Date())
  };
}

// =====================================================
// FUNÇÃO AUXILIAR: RESOLVER GÊNERO
// =====================================================
function resolverGeneroDeclaracao(d) {
  const genero = (d.genero || '').toString().toLowerCase();
  
  if (genero.includes('f') || genero.includes('feminino')) {
    return 'feminino';
  } else if (genero.includes('m') || genero.includes('masculino')) {
    return 'masculino';
  }
  
  // Se não conseguir do gênero, tenta pelo estado civil
  const estadoCivil = (d.estadoCivil || '').toString().toLowerCase();
  if (estadoCivil.includes('solteira') || 
      estadoCivil.includes('casada') || 
      estadoCivil.includes('divorciada') || 
      estadoCivil.includes('viúva')) {
    return 'feminino';
  }
  
  return 'masculino';
}

// =====================================================
// ✅ HISTÓRICO DE REVISÕES
// =====================================================
// REV_04: 02/02/2026 14:00 - CORREÇÃO CRÍTICA
// - ✅ CORREÇÃO: Mapeamento de colunas corrigido
// - ✅ CORREÇÃO: linkPasta agora usa COL_CONTRATOS.linkPasta (coluna G)
// - ✅ CORREÇÃO: Erro "Cannot read properties of undefined (reading 'split')" resolvido
// - ✅ Mensagens de erro mais descritivas
// - ✅ Verificação do formato do link da pasta
//
// REV_03: 29/01/2026 - CORRIGIDO COMPLETO
// REV_02: 18/01/2026 - Reorganização modular
// REV_01: 17/01/2026 - Criação inicial
// =====================================================

// © 2026 BASE250 - Sistema de Gestão de Imóveis
// Todos os direitos reservados
// =====================================================
// BASE250 | MÓDULO 7 – EMAIL TEMPLATES
// ARQUIVO: V4_M07.R2-BASE250_EmailTemplates
// REVISÃO: REV_02 – 28/01/2026 / 17:00
// =====================================================
// RESPONSABILIDADE:
// - Definir templates de e-mail
// - Padronizar comunicações
// - Reutilizar conteúdos
// - Assunto + corpo dos e-mails (texto e HTML)
// - Logo inline via CID (cid:logoBASE250)
//
// ⚠️ O ID da logo está no MÓDULO 0 (CONFIG_EMAIL.logoId)
// Aqui apenas referenciamos via CID
// ⚠️ NENHUMA lógica de envio
// =====================================================



// -----------------------------------------------------
// FUNÇÃO AUXILIAR - HTML DO LOGO (CID INLINE)
// -----------------------------------------------------
function getLogoHtml() {
  return `
<div style="text-align: center; margin-bottom: 20px;">
  <img src="cid:logoBASE250" alt="BASE250" style="max-width: 300px; height: auto;" />
</div>
`;
}


// -----------------------------------------------------
// EMAIL 1 — CONTRATO PARA ASSINATURA
// -----------------------------------------------------
function emailTemplateContrato(d) {
  const logoHtml = getLogoHtml();
  
  return {
    assunto: '📄 Contrato de Locação – BASE250',
    
    corpo: `
🏢 Olá ${d.nome},

Agradecemos o seu cadastro para locação no **BASE250 – Residencial Itacorubi**.

━━━━━━━━━━━━━━━━━━━━━━
🗂️ DADOS DO IMÓVEL
━━━━━━━━━━━━━━━━━━━━━━

📌 Apartamento: ${d.apto}
🗂️ Endereço: Servidão Joaquim Soares, 250 – Itacorubi – Florianópolis/SC

━━━━━━━━━━━━━━━━━━━━━━
🗂️ SITUAÇÃO DA DOCUMENTAÇÃO
━━━━━━━━━━━━━━━━━━━━━━

${d.statusDocumentos}

━━━━━━━━━━━━━━━━━━━━━━
🗂️ CONTRATO DE LOCAÇÃO
━━━━━━━━━━━━━━━━━━━━━━

📘 O contrato segue **em anexo neste e-mail**.

➡️ Próximos passos:
1️⃣ Baixe o contrato em PDF  
2️⃣ Assine digitalmente pelo Gov.br  
🌐 https://www.gov.br/pt-br/servicos/assinatura-eletronica  
3️⃣ Envie o contrato assinado para nosso e-mail  

━━━━━━━━━━━━━━━━━━━━━━
🗂️ INFORMAÇÕES IMPORTANTES
━━━━━━━━━━━━━━━━━━━━━━

ℹ️ O imóvel será liberado após o recebimento do contrato assinado.  
ℹ️ Qualquer dúvida pode ser tratada conosco.

━━━━━━━━━━━━━━━━━━━━━━
🗂️ CONTATO
━━━━━━━━━━━━━━━━━━━━━━

☎️ Telefone / WhatsApp: ${d.telefone}

Atenciosamente,  
**${CONFIG.proprietario.nome}**  
**BASE250 – Residencial Itacorubi**
`,
    
    htmlBody: logoHtml + `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #16697a;">🏢 Olá ${d.nome},</h2>
  
  <p>Agradecemos o seu cadastro para locação no <strong>BASE250 – Residencial Itacorubi</strong>.</p>
  
  <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <h3 style="color: #16697a; margin-top: 0;">🗂️ DADOS DO IMÓVEL</h3>
    <p><strong>📌 Apartamento:</strong> ${d.apto}<br>
    <strong>🗂️ Endereço:</strong> Servidão Joaquim Soares, 250 – Itacorubi – Florianópolis/SC</p>
  </div>
  
  <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <h3 style="color: #16697a; margin-top: 0;">🗂️ SITUAÇÃO DA DOCUMENTAÇÃO</h3>
    <p>${d.statusDocumentos}</p>
  </div>
  
  <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <h3 style="color: #16697a; margin-top: 0;">🗂️ CONTRATO DE LOCAÇÃO</h3>
    <p>📘 O contrato segue <strong>em anexo neste e-mail</strong>.</p>
    <p><strong>➡️ Próximos passos:</strong></p>
    <ol>
      <li>Baixe o contrato em PDF</li>
      <li>Assine digitalmente pelo Gov.br<br>
      <a href="https://www.gov.br/pt-br/servicos/assinatura-eletronica">🌐 Clique aqui para acessar</a></li>
      <li>Envie o contrato assinado para nosso e-mail</li>
    </ol>
  </div>
  
  <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
    <h3 style="color: #856404; margin-top: 0;">ℹ️ INFORMAÇÕES IMPORTANTES</h3>
    <p>• O imóvel será liberado após o recebimento do contrato assinado.<br>
    • Qualquer dúvida pode ser tratada conosco.</p>
  </div>
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #16697a;">
    <p><strong>☎️ Contato:</strong><br>
    Telefone / WhatsApp: ${d.telefone}</p>
    <p>Atenciosamente,<br>
    <strong>${CONFIG.proprietario.nome}</strong><br>
    <strong>BASE250 – Residencial Itacorubi</strong></p>
  </div>
</div>
`
  };
}


// -----------------------------------------------------
// EMAIL 2 — CONFIRMAÇÃO CONTRATO ASSINADO
// -----------------------------------------------------
function emailTemplateConfirmacaoContrato(d) {
  const logoHtml = getLogoHtml();
  
  return {
    assunto: '✅ Contrato assinado recebido – BASE250',
    
    corpo: `
🟦 Olá ${d.nome},

Confirmamos o **recebimento do contrato de locação assinado** referente ao imóvel abaixo:

━━━━━━━━━━━━━━━━━━━━━━
🗂️ DADOS DO IMÓVEL
━━━━━━━━━━━━━━━━━━━━━━

📌 Apartamento: ${d.apto}
🗂️ Endereço: Servidão Joaquim Soares, 250 – Itacorubi – Florianópolis/SC

━━━━━━━━━━━━━━━━━━━━━━

O documento será **arquivado e validado internamente**.

Em breve você receberá:
📌 as **orientações finais**, e  
📌 a **via definitiva do contrato assinada pelo proprietário**.

Atenciosamente,  
**${CONFIG.proprietario.nome}**  
**BASE250 – Residencial Itacorubi**
`,
    
    htmlBody: logoHtml + `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #16697a;">✅ Olá ${d.nome},</h2>
  
  <p>Confirmamos o <strong>recebimento do contrato de locação assinado</strong> referente ao imóvel abaixo:</p>
  
  <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <h3 style="color: #16697a; margin-top: 0;">🗂️ DADOS DO IMÓVEL</h3>
    <p><strong>📌 Apartamento:</strong> ${d.apto}<br>
    <strong>🗂️ Endereço:</strong> Servidão Joaquim Soares, 250 – Itacorubi – Florianópolis/SC</p>
  </div>
  
  <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
    <p>O documento será <strong>arquivado e validado internamente</strong>.</p>
    <p>Em breve você receberá:</p>
    <ul>
      <li>📌 as <strong>orientações finais</strong>, e</li>
      <li>📌 a <strong>via definitiva do contrato assinada pelo proprietário</strong>.</li>
    </ul>
  </div>
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #16697a;">
    <p>Atenciosamente,<br>
    <strong>${CONFIG.proprietario.nome}</strong><br>
    <strong>BASE250 – Residencial Itacorubi</strong></p>
  </div>
</div>
`
  };
}


// -----------------------------------------------------
// EMAIL 3 — BOAS-VINDAS / ORIENTAÇÕES
// -----------------------------------------------------
function emailTemplateBoasVindas(d) {
  const logoHtml = getLogoHtml();
  
  return {
    assunto: '🏢 Bem-vindo(a) ao BASE250 – Orientações Finais',
    
    corpo: `
🏢 Olá ${d.nome},

Seja oficialmente **bem-vindo(a) ao BASE250 – Residencial Itacorubi**! 🏠

Seguem as **orientações finais** para sua mudança e entrada no imóvel.

━━━━━━━━━━━━━━━━━━━━━━
🗂️ DADOS DO SEU APARTAMENTO
━━━━━━━━━━━━━━━━━━━━━━

📌 Apartamento: ${d.apto}
🗂️ Endereço: Servidão Joaquim Soares, nº 250 – Itacorubi – Florianópolis/SC

━━━━━━━━━━━━━━━━━━━━━━
🗂️ ENTREGA DE CHAVES
━━━━━━━━━━━━━━━━━━━━━━

🔑 A entrega das chaves será combinada diretamente com você.  
📞 Entre em contato pelo WhatsApp: ${CONFIG.proprietario.telefone}

━━━━━━━━━━━━━━━━━━━━━━
🗂️ INFORMAÇÕES IMPORTANTES
━━━━━━━━━━━━━━━━━━━━━━

💡 **Energia Elétrica (CELESC)**  
• Unidade Consumidora: ${d.celescUC || 'Consultar com proprietário'}  
• Você deve fazer a transferência da titularidade para seu nome  
• Site: https://www.celesc.com.br  

💧 **Água (CASAN)**  
• Entre em contato com a CASAN para transferência  
• Site: https://www.casan.com.br  

🗑️ **Coleta de Lixo**  
• Segunda, Quarta e Sexta (noturno)  
• Disponibilizar o lixo após as 18h  

📦 **Correspondências**  
• Caixa de correio disponível no térreo  

━━━━━━━━━━━━━━━━━━━━━━
🗂️ CONTATO
━━━━━━━━━━━━━━━━━━━━━━

📞 Telefone / WhatsApp: ${CONFIG.proprietario.telefone}  
📧 E-mail: ${CONFIG.proprietarioEmail}

Qualquer dúvida estamos à disposição!

Atenciosamente,  
**${CONFIG.proprietario.nome}**  
**BASE250 – Residencial Itacorubi**
`,
    
    htmlBody: logoHtml + `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #16697a;">🏢 Olá ${d.nome},</h2>
  
  <p>Seja oficialmente <strong>bem-vindo(a) ao BASE250 – Residencial Itacorubi</strong>! 🏠</p>
  
  <p>Seguem as <strong>orientações finais</strong> para sua mudança e entrada no imóvel.</p>
  
  <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <h3 style="color: #16697a; margin-top: 0;">🗂️ DADOS DO SEU APARTAMENTO</h3>
    <p><strong>📌 Apartamento:</strong> ${d.apto}<br>
    <strong>🗂️ Endereço:</strong> Servidão Joaquim Soares, nº 250 – Itacorubi – Florianópolis/SC</p>
  </div>
  
  <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
    <h3 style="color: #856404; margin-top: 0;">🔑 ENTREGA DE CHAVES</h3>
    <p>A entrega das chaves será combinada diretamente com você.<br>
    📞 Entre em contato pelo WhatsApp: <strong>${CONFIG.proprietario.telefone}</strong></p>
  </div>
  
  <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <h3 style="color: #16697a; margin-top: 0;">ℹ️ INFORMAÇÕES IMPORTANTES</h3>
    
    <p><strong>💡 Energia Elétrica (CELESC)</strong></p>
    <ul>
      <li>Unidade Consumidora: ${d.celescUC || 'Consultar com proprietário'}</li>
      <li>Você deve fazer a transferência da titularidade para seu nome</li>
      <li>Site: <a href="https://www.celesc.com.br">www.celesc.com.br</a></li>
    </ul>
    
    <p><strong>💧 Água (CASAN)</strong></p>
    <ul>
      <li>Entre em contato com a CASAN para transferência</li>
      <li>Site: <a href="https://www.casan.com.br">www.casan.com.br</a></li>
    </ul>
    
    <p><strong>🗑️ Coleta de Lixo</strong></p>
    <ul>
      <li>Segunda, Quarta e Sexta (noturno)</li>
      <li>Disponibilizar o lixo após as 18h</li>
    </ul>
    
    <p><strong>📦 Correspondências</strong></p>
    <ul>
      <li>Caixa de correio disponível no térreo</li>
    </ul>
  </div>
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #16697a;">
    <p><strong>📞 Contato:</strong><br>
    Telefone / WhatsApp: ${CONFIG.proprietario.telefone}<br>
    E-mail: ${CONFIG.proprietarioEmail}</p>
    <p>Qualquer dúvida estamos à disposição!</p>
    <p>Atenciosamente,<br>
    <strong>${CONFIG.proprietario.nome}</strong><br>
    <strong>BASE250 – Residencial Itacorubi</strong></p>
  </div>
</div>
`
  };
}


// -----------------------------------------------------
// EMAIL 4 — CONTRATO FINAL ASSINADO PELO PROPRIETÁRIO
// -----------------------------------------------------
function emailTemplateContratoFinal(d) {
  const logoHtml = getLogoHtml();
  
  return {
    assunto: '📄 Contrato Final Assinado – BASE250',
    
    corpo: `
🏢 Olá ${d.nome},

Enviamos a **via definitiva do contrato de locação assinada pelo proprietário**.

━━━━━━━━━━━━━━━━━━━━━━
🗂️ DADOS DO IMÓVEL
━━━━━━━━━━━━━━━━━━━━━━

📌 Apartamento: ${d.apto}
🗂️ Endereço: Servidão Joaquim Soares, 250 – Itacorubi – Florianópolis/SC

━━━━━━━━━━━━━━━━━━━━━━

📘 O contrato final segue **em anexo neste e-mail**.

Este é o documento oficial que vale para todo o período de locação.  
Guarde-o com cuidado para consultas futuras.

Atenciosamente,  
**${CONFIG.proprietario.nome}**  
**BASE250 – Residencial Itacorubi**
`,
    
    htmlBody: logoHtml + `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #16697a;">📄 Olá ${d.nome},</h2>
  
  <p>Enviamos a <strong>via definitiva do contrato de locação assinada pelo proprietário</strong>.</p>
  
  <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <h3 style="color: #16697a; margin-top: 0;">🗂️ DADOS DO IMÓVEL</h3>
    <p><strong>📌 Apartamento:</strong> ${d.apto}<br>
    <strong>🗂️ Endereço:</strong> Servidão Joaquim Soares, 250 – Itacorubi – Florianópolis/SC</p>
  </div>
  
  <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
    <p>📘 O contrato final segue <strong>em anexo neste e-mail</strong>.</p>
    <p>Este é o documento oficial que vale para todo o período de locação.<br>
    Guarde-o com cuidado para consultas futuras.</p>
  </div>
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #16697a;">
    <p>Atenciosamente,<br>
    <strong>${CONFIG.proprietario.nome}</strong><br>
    <strong>BASE250 – Residencial Itacorubi</strong></p>
  </div>
</div>
`
  };
}


// -----------------------------------------------------
// EMAIL 5 — DECLARAÇÃO DE RESIDÊNCIA
// -----------------------------------------------------
function emailTemplateDeclaracao(d) {
  const logoHtml = getLogoHtml();
  
  return {
    assunto: '🧾 Declaração de Residência – BASE250',
    
    corpo: `
🏢 Olá ${d.nome},

Conforme solicitado, segue a **Declaração de Residência** do seu apartamento.

━━━━━━━━━━━━━━━━━━━━━━
🗂️ DADOS DO IMÓVEL
━━━━━━━━━━━━━━━━━━━━━━

📌 Apartamento: ${d.apto}
🗂️ Endereço: Servidão Joaquim Soares, 250 – Itacorubi – Florianópolis/SC

━━━━━━━━━━━━━━━━━━━━━━

🧾 A declaração segue **em anexo neste e-mail** (formato PDF).

Este documento pode ser utilizado para:
✅ Comprovação de residência  
✅ Abertura de contas bancárias  
✅ Cadastros diversos  

Caso precise de nova via ou ajuste, é só avisar!

Atenciosamente,  
**${CONFIG.proprietario.nome}**  
**BASE250 – Residencial Itacorubi**
`,
    
    htmlBody: logoHtml + `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #16697a;">🧾 Olá ${d.nome},</h2>
  
  <p>Conforme solicitado, segue a <strong>Declaração de Residência</strong> do seu apartamento.</p>
  
  <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <h3 style="color: #16697a; margin-top: 0;">🗂️ DADOS DO IMÓVEL</h3>
    <p><strong>📌 Apartamento:</strong> ${d.apto}<br>
    <strong>🗂️ Endereço:</strong> Servidão Joaquim Soares, 250 – Itacorubi – Florianópolis/SC</p>
  </div>
  
  <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
    <p>🧾 A declaração segue <strong>em anexo neste e-mail</strong> (formato PDF).</p>
    <p>Este documento pode ser utilizado para:</p>
    <ul>
      <li>✅ Comprovação de residência</li>
      <li>✅ Abertura de contas bancárias</li>
      <li>✅ Cadastros diversos</li>
    </ul>
    <p>Caso precise de nova via ou ajuste, é só avisar!</p>
  </div>
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #16697a;">
    <p>Atenciosamente,<br>
    <strong>${CONFIG.proprietario.nome}</strong><br>
    <strong>BASE250 – Residencial Itacorubi</strong></p>
  </div>
</div>
`
  };
}


// -----------------------------------------------------
// CONFIGURAÇÃO DO LOGO
// ⚠️ O ID da logo está no MÓDULO 0 (CONFIG_EMAIL.logoId)
// Use: CONFIG_EMAIL.logoId para buscar o arquivo
// -----------------------------------------------------

// -----------------------------------------------------
// OBTER LOGO COMO BLOB (CID)
// -----------------------------------------------------
function getLogoBlob() {
  try {
    const logoFile = DriveApp.getFileById(CONFIG_EMAIL.logoId);
    return logoFile.getBlob().setName('logoBASE250');
  } catch (e) {
    Logger.log('⚠️ Logo não encontrada: ' + e.message);
    return null;
  }
}


// -----------------------------------------------------
// OBTER DADOS DO CONTRATO
// -----------------------------------------------------
function obterDadosContrato(apto) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName(CONFIG_CONTRATOS.abaContratos);
  const dados = aba.getDataRange().getValues();

  for (let i = 1; i < dados.length; i++) {
    if ((dados[i][0] || '').toString().includes(apto)) {
      return {
        apto: dados[i][0],
        nome: dados[i][1],
        linkPasta: dados[i][8],
        email: dados[i][21],
        telefone: dados[i][20],
        docFoto: dados[i][6],
        docId: dados[i][7],
        celescUC: dados[i][23]
      };
    }
  }
  return null;
}


// -----------------------------------------------------
// LOCALIZAR PDF NA PASTA
// -----------------------------------------------------
function localizarPdf(linkPasta, prefixo) {
  if (!linkPasta) return null;

  try {
    const pastaId = linkPasta.split('/folders/')[1].split('?')[0];
    const pasta = DriveApp.getFolderById(pastaId);
    const arquivos = pasta.getFiles();

    while (arquivos.hasNext()) {
      const arq = arquivos.next();
      const nome = arq.getName();

      if (nome.includes(prefixo) && nome.endsWith('.pdf')) {
        return arq.getBlob();
      }
    }
  } catch (e) {
    Logger.log('Erro ao localizar PDF: ' + e.message);
  }

  return null;
}


// -----------------------------------------------------
// MENU → E-MAIL 1 | CONTRATO P/ ASSINATURA
// -----------------------------------------------------
function menuEnviarContratoEmail() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt('📧 Contrato', 'Digite os 3 dígitos do apartamento:', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;

  const d = obterDadosContrato(r.getResponseText().trim());
  if (!d || !d.email) {
    ui.alert('Erro', 'Dados não encontrados.', ui.ButtonSet.OK);
    return;
  }

  const pdf = localizarPdf(d.linkPasta, 'CONTRATO_');
  if (!pdf) {
    ui.alert('Erro', 'Contrato não encontrado.', ui.ButtonSet.OK);
    return;
  }

  const statusDocumentos = montarStatusDocumentos(d);
  const tpl = emailTemplateContrato({
    nome: d.nome,
    apto: d.apto,
    telefone: d.telefone,
    statusDocumentos: statusDocumentos
  });

  const logoBlob = getLogoBlob();

  const emailOptions = {
    to: d.email,
    subject: tpl.assunto,
    htmlBody: tpl.htmlBody,
    body: tpl.corpo,
    attachments: [pdf]
  };

  if (logoBlob) {
    emailOptions.inlineImages = {
      logoBASE250: logoBlob
    };
  }

  MailApp.sendEmail(emailOptions);

  registrarAuditoriaEnvio(d.apto, d.nome, 'EMAIL 1 – CONTRATO');
  ui.alert('Sucesso', 'Contrato enviado.', ui.ButtonSet.OK);
}


// -----------------------------------------------------
// MENU → E-MAIL 2 | CONFIRMAÇÃO CONTRATO ASSINADO
// -----------------------------------------------------
function menuEnviarContratoAssinadoEmail() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt('✅ Confirmação', 'Digite os 3 dígitos do apartamento:', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;

  const d = obterDadosContrato(r.getResponseText().trim());
  if (!d || !d.email) {
    ui.alert('Erro', 'Dados não encontrados.', ui.ButtonSet.OK);
    return;
  }

  const tpl = emailTemplateConfirmacaoContrato({
    nome: d.nome,
    apto: d.apto
  });

  const logoBlob = getLogoBlob();

  const emailOptions = {
    to: d.email,
    subject: tpl.assunto,
    htmlBody: tpl.htmlBody,
    body: tpl.corpo
  };

  if (logoBlob) {
    emailOptions.inlineImages = {
      logoBASE250: logoBlob
    };
  }

  MailApp.sendEmail(emailOptions);

  registrarAuditoriaEnvio(d.apto, d.nome, 'EMAIL 2 – CONFIRMAÇÃO');
  ui.alert('Sucesso', 'Confirmação enviada.', ui.ButtonSet.OK);
}


// -----------------------------------------------------
// MENU → E-MAIL 3 | BOAS-VINDAS
// -----------------------------------------------------
function menuEnviarBoasVindas() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt('🏢 Boas-vindas', 'Digite os 3 dígitos do apartamento:', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;

  const d = obterDadosContrato(r.getResponseText().trim());
  if (!d || !d.email) {
    ui.alert('Erro', 'Dados não encontrados.', ui.ButtonSet.OK);
    return;
  }

  const tpl = emailTemplateBoasVindas({
    nome: d.nome,
    apto: d.apto,
    celescUC: d.celescUC
  });

  const logoBlob = getLogoBlob();

  const emailOptions = {
    to: d.email,
    subject: tpl.assunto,
    htmlBody: tpl.htmlBody,
    body: tpl.corpo
  };

  if (logoBlob) {
    emailOptions.inlineImages = {
      logoBASE250: logoBlob
    };
  }

  MailApp.sendEmail(emailOptions);

  registrarAuditoriaEnvio(d.apto, d.nome, 'EMAIL 3 – BOAS-VINDAS');
  ui.alert('Sucesso', 'Boas-vindas enviadas.', ui.ButtonSet.OK);
}


// -----------------------------------------------------
// MENU → E-MAIL 4 | CONTRATO FINAL
// -----------------------------------------------------
function menuEnviarContratoFinalEmail() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt('📄 Contrato Final', 'Digite os 3 dígitos do apartamento:', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;

  const d = obterDadosContrato(r.getResponseText().trim());
  if (!d || !d.email) {
    ui.alert('Erro', 'Dados não encontrados.', ui.ButtonSet.OK);
    return;
  }

  const pdf = localizarPdf(d.linkPasta, 'CONTRATO_ASS');
  if (!pdf) {
    ui.alert('Erro', 'Contrato assinado não encontrado.', ui.ButtonSet.OK);
    return;
  }

  const tpl = emailTemplateContratoFinal({
    nome: d.nome,
    apto: d.apto
  });

  const logoBlob = getLogoBlob();

  const emailOptions = {
    to: d.email,
    subject: tpl.assunto,
    htmlBody: tpl.htmlBody,
    body: tpl.corpo,
    attachments: [pdf]
  };

  if (logoBlob) {
    emailOptions.inlineImages = {
      logoBASE250: logoBlob
    };
  }

  MailApp.sendEmail(emailOptions);

  registrarAuditoriaEnvio(d.apto, d.nome, 'EMAIL 4 – CONTRATO FINAL');
  ui.alert('Sucesso', 'Contrato final enviado.', ui.ButtonSet.OK);
}


// -----------------------------------------------------
// MENU → E-MAIL 5 | DECLARAÇÃO
// -----------------------------------------------------
function menuEnviarDeclaracaoEmail() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt('🧾 Declaração', 'Digite os 3 dígitos do apartamento:', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;

  const d = obterDadosContrato(r.getResponseText().trim());
  if (!d || !d.email) {
    ui.alert('Erro', 'Dados não encontrados.', ui.ButtonSet.OK);
    return;
  }

  const pdf = localizarPdf(d.linkPasta, 'DECLARACAO_');
  if (!pdf) {
    ui.alert('Erro', 'Declaração não encontrada.', ui.ButtonSet.OK);
    return;
  }

  const tpl = emailTemplateDeclaracao(d);
  const logoBlob = getLogoBlob();

  const emailOptions = {
    to: d.email,
    subject: tpl.assunto,
    htmlBody: tpl.htmlBody,
    body: tpl.corpo,
    attachments: [pdf]
  };

  if (logoBlob) {
    emailOptions.inlineImages = {
      logoBASE250: logoBlob
    };
  }

  MailApp.sendEmail(emailOptions);

  registrarAuditoriaEnvio(d.apto, d.nome, 'EMAIL 5 – DECLARAÇÃO');
  ui.alert('Sucesso', 'Declaração enviada.', ui.ButtonSet.OK);
}


// -----------------------------------------------------
// FUNÇÃO DIRETA PARA ENVIO DE DECLARAÇÃO
// Usada pelo MÓDULO 6 durante geração automática
// -----------------------------------------------------
function enviarEmailDeclaracaoDireto(nome, email, apto, pdfBlob) {
  const d = {
    nome: nome,
    apto: apto
  };

  const tpl = emailTemplateDeclaracao(d);
  const logoBlob = getLogoBlob();

  const emailOptions = {
    to: email,
    subject: tpl.assunto,
    htmlBody: tpl.htmlBody,
    body: tpl.corpo,
    attachments: [pdfBlob]
  };

  if (logoBlob) {
    emailOptions.inlineImages = {
      logoBASE250: logoBlob
    };
  }

  MailApp.sendEmail(emailOptions);

  registrarAuditoriaEnvio(apto, nome, 'EMAIL 5 – DECLARAÇÃO (AUTO)');
}


// -----------------------------------------------------
// AUDITORIA
// -----------------------------------------------------
function registrarAuditoriaEnvio(apto, inquilino, tipo) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let aba = ss.getSheetByName(CONFIG_CONTRATOS.abaAuditoria);

  if (!aba) {
    aba = ss.insertSheet(CONFIG_CONTRATOS.abaAuditoria);
    aba.appendRow(['Data', 'Apto', 'Inquilino', 'Tipo']);
  }

  aba.appendRow([new Date(), apto, inquilino, tipo]);
}


function menuWhatsContratoEnviado() {
  fluxoWhatsApp({ tipo: 'Whats_Contrato_Enviado' });
}

function menuWhatsContratoAssinado() {
  fluxoWhatsApp({ tipo: 'Whats_Contrato_Assinado' });
}

function menuWhatsBoasVindas() {
  fluxoWhatsApp({ tipo: 'Whats_Boas_Vindas' });
}

function menuWhatsDeclaracaoEnviada() {
  fluxoWhatsApp({ tipo: 'Whats_Declaracao_Enviada' });
}


// -----------------------------------------------------
// FLUXO ÚNICO WHATSAPP
// -----------------------------------------------------

function fluxoWhatsApp({ tipo }) {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName(CONFIG_CONTRATOS.abaContratos);

  const r = ui.prompt(
    '📲 Enviar WhatsApp',
    'Digite os 3 dígitos do apartamento:',
    ui.ButtonSet.OK_CANCEL
  );
  if (r.getSelectedButton() !== ui.Button.OK) return;

  const digitos = r.getResponseText().trim();
  const dados = aba.getDataRange().getValues();

  let d = null;

  for (let i = 1; i < dados.length; i++) {
    if ((dados[i][0] || '').toString().includes(digitos)) {
      d = {
        apto: dados[i][0],
        nome: dados[i][1]
      };
      break;
    }
  }

  if (!d) {
    ui.alert('Erro', 'Apartamento não encontrado.');
    return;
  }

  const mensagem = getMensagemWhats(tipo, d);

  if (!mensagem) {
    ui.alert('Erro', 'Tipo de mensagem não reconhecido.');
    return;
  }

  // HOJE: copiar manual
  ui.alert(
    '📲 Mensagem WhatsApp',
    mensagem,
    ui.ButtonSet.OK
  );

  // FUTURO:
  // enviarWhatsAppAPI(d.telefone, mensagem);
}


// -----------------------------------------------------
// TEXTOS OFICIAIS WHATSAPP
// -----------------------------------------------------

function getMensagemWhats(tipo, d) {
  const proprietario = CONFIG.proprietario.nome;
  
  const mapas = {

    Whats_Contrato_Enviado: `
🏢 Olá ${d.nome}!

Enviamos o *contrato de locação do Apto ${d.apto} por e-mail* 📧📄  

👉 Confira sua caixa de entrada (e spam).
Após assinar digitalmente, é só nos devolver o contrato assinado.

Atenciosamente,
*${proprietario}*
BASE250 – Residencial Itacorubi
`.trim(),

    Whats_Contrato_Assinado: `
🟦 Olá ${d.nome}!

Confirmamos o *recebimento do contrato assinado* do Apto ${d.apto} ✅  

Agora seguimos com a validação interna.
Em breve enviamos as próximas orientações.

Atenciosamente,
*${proprietario}*
BASE250 – Residencial Itacorubi
`.trim(),

    Whats_Boas_Vindas: `
🏢 Olá ${d.nome}!

Seja oficialmente *bem-vindo(a) ao BASE250 – Residencial Itacorubi* 🏠  

Em breve combinamos a entrega das chaves e enviamos as orientações finais.
Conte conosco para o que precisar.

Atenciosamente,
*${proprietario}*
BASE250 – Residencial Itacorubi
`.trim(),

    Whats_Declaracao_Enviada: `
🧾 Olá ${d.nome}!

A *Declaração de Residência do Apto ${d.apto}* foi enviada por e-mail 📧  

Se precisar de ajuste ou nova via, é só avisar.

Atenciosamente,
*${proprietario}*
BASE250 – Residencial Itacorubi
`.trim()
  };

  return mapas[tipo];
}


// =====================================================
// BASE250 | MÓDULO 10 – ENCERRAR CONTRATO
// ARQUIVO: V4_M10.R0-BASE250_EncerrarContrato
// REVISÃO: REV_00 – 30/01/2026 / 18:10
// =====================================================
// RESPONSABILIDADE:
// - Encerrar contratos de locação
// - Executar rotinas finais e validações
// - Copiar dados para aba "Saídas"
// - Limpar dados da aba "Contratos"
// - Manter pasta no Drive (não apaga)
// - Manter fórmulas e colunas fixas
// =====================================================

// =====================================================
// MENU → 🔚 ENCERRAR CONTRATO
// =====================================================
function menuEncerrarContrato() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. SOLICITAR APARTAMENTO
  const rApto = ui.prompt(
    '🔚 Encerrar Contrato',
    'Digite os 3 dígitos do apartamento:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (rApto.getSelectedButton() !== ui.Button.OK) return;
  
  const apto = rApto.getResponseText().trim();
  if (!/^\d{3}$/.test(apto)) {
    ui.alert('Erro', 'Digite exatamente 3 dígitos.', ui.ButtonSet.OK);
    return;
  }
  
  // 2. BUSCAR APARTAMENTO
  const abaContratos = ss.getSheetByName(CONFIG_CONTRATOS.abaContratos);
  const dados = abaContratos.getDataRange().getValues();
  
  let linha = -1;
  let dadosLinha = null;
  
  for (let i = 1; i < dados.length; i++) {
    if ((dados[i][0] || '').toString().includes(apto)) {
      linha = i + 1; // +1 porque getRange é 1-indexed
      dadosLinha = dados[i];
      break;
    }
  }
  
  if (linha === -1) {
    ui.alert('Erro', 'Apartamento não encontrado.', ui.ButtonSet.OK);
    return;
  }
  
  // 3. VERIFICAR SE TEM INQUILINO
  const inquilino = dadosLinha[COL_CONTRATOS.inquilino - 1];
  if (!inquilino || inquilino === '') {
    ui.alert('Erro', 'Este apartamento está vazio (sem inquilino).', ui.ButtonSet.OK);
    return;
  }
  
  // 4. SOLICITAR DATA DE SAÍDA
  const rData = ui.prompt(
    '📅 Data de Saída',
    `Apartamento: ${apto}\nInquilino: ${inquilino}\n\n` +
    `Digite a data de saída (dd/MM/yyyy):`,
    ui.ButtonSet.OK_CANCEL
  );
  
  if (rData.getSelectedButton() !== ui.Button.OK) return;
  
  const dataSaida = rData.getResponseText().trim();
  
  // Validar formato dd/MM/yyyy
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataSaida)) {
    ui.alert('Erro', 'Formato de data inválido. Use dd/MM/yyyy', ui.ButtonSet.OK);
    return;
  }
  
  // 5. CONFIRMAÇÃO FINAL
  const confirmar = ui.alert(
    '⚠️ Confirmar Encerramento',
    `APARTAMENTO: ${apto}\n` +
    `INQUILINO: ${inquilino}\n` +
    `DATA SAÍDA: ${dataSaida}\n\n` +
    `Esta ação vai:\n` +
    `✓ Copiar dados para aba "Saídas"\n` +
    `✓ Limpar dados do contrato\n` +
    `✓ Liberar apartamento\n` +
    `✓ Manter pasta no Drive\n\n` +
    `Confirma?`,
    ui.ButtonSet.YES_NO
  );
  
  if (confirmar !== ui.Button.YES) {
    ui.alert('Cancelado', 'Encerramento cancelado.', ui.ButtonSet.OK);
    return;
  }
  
  // 6. EXECUTAR ENCERRAMENTO
  try {
    encerrarContrato(apto, linha, dadosLinha, dataSaida);
    
    ui.alert(
      '✅ Contrato Encerrado!',
      `Apartamento ${apto} encerrado com sucesso!\n\n` +
      `• Dados movidos para aba "Saídas"\n` +
      `• Apartamento liberado\n` +
      `• Status: Disponível`,
      ui.ButtonSet.OK
    );
  } catch (e) {
    ui.alert(
      '❌ Erro ao Encerrar',
      `Erro: ${e.message}`,
      ui.ButtonSet.OK
    );
  }
}


// =====================================================
// CORE – ENCERRAR CONTRATO
// =====================================================
function encerrarContrato(apto, linha, dadosLinha, dataSaida) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const abaContratos = ss.getSheetByName(CONFIG_CONTRATOS.abaContratos);
  let abaSaidas = ss.getSheetByName(CONFIG_CONTRATOS.abaSaidas);
  
  // =====================================================
  // 1️⃣ CRIAR ABA SAÍDAS (se não existir)
  // =====================================================
  if (!abaSaidas) {
    abaSaidas = ss.insertSheet(CONFIG_CONTRATOS.abaSaidas);
    
    // Copiar cabeçalhos da aba Contratos + coluna X
    const cabecalhos = abaContratos.getRange(1, 1, 1, 23).getValues()[0];
    cabecalhos.push('Data Encerramento'); // Coluna X
    abaSaidas.appendRow(cabecalhos);
    
    // Formatar cabeçalhos
    abaSaidas.getRange(1, 1, 1, 24)
      .setBackground('#d32f2f')
      .setFontColor('white')
      .setFontWeight('bold');
    
    Logger.log('✅ Aba "Saídas" criada');
  }
  
  // =====================================================
  // 2️⃣ COPIAR LINHA PARA ABA SAÍDAS
  // =====================================================
  const linhaCopia = [...dadosLinha]; // Clonar array (A-W: 23 colunas)
  linhaCopia.push(dataSaida); // Adicionar data encerramento (coluna X)
  
  abaSaidas.appendRow(linhaCopia);
  Logger.log(`✅ Dados copiados para aba Saídas`);
  
  // =====================================================
  // 3️⃣ LIMPAR DADOS NA ABA CONTRATOS
  // =====================================================
  // MANTÉM: A (Apto), D (Avanço-fórmula), E (Status-fórmula), 
  //         J (Data Fim-fórmula), V (CELESC Unidade), W (Nº UC)
  // ZERA: B, C, F-I, K-U
  
  const colunasLimpar = [
    COL_CONTRATOS.inquilino,       // B
    COL_CONTRATOS.valorAluguel,    // C
    COL_CONTRATOS.linhaForm,       // F
    COL_CONTRATOS.linkPasta,       // G
    COL_CONTRATOS.dataEntrada,     // H
    COL_CONTRATOS.prazoMeses,      // I
    COL_CONTRATOS.genero,          // K
    COL_CONTRATOS.telefone,        // L
    COL_CONTRATOS.email,           // M
    COL_CONTRATOS.nacionalidade,   // N
    COL_CONTRATOS.estadoCivil,     // O
    COL_CONTRATOS.profissao,       // P
    COL_CONTRATOS.cpf,             // Q
    COL_CONTRATOS.endereco,        // R
    COL_CONTRATOS.dataNascimento,  // S
    COL_CONTRATOS.dataEmissao,     // T
    COL_CONTRATOS.caucao           // U
  ];
  
  colunasLimpar.forEach(col => {
    abaContratos.getRange(linha, col).clearContent();
  });
  
  Logger.log(`✅ Dados limpos na aba Contratos (linha ${linha})`);
  
  // =====================================================
  // 4️⃣ LIMPAR ABA LINKS (mesma linha)
  // =====================================================
  const abaLinks = ss.getSheetByName(CONFIG_CONTRATOS.abaLinks);
  if (abaLinks) {
    // Limpar colunas C-I (mantém A e B que são fórmulas)
    for (let col = COL_LINKS.linhaFormResponse; col <= COL_LINKS.linkDeclaracao; col++) {
      abaLinks.getRange(linha, col).clearContent();
    }
    Logger.log(`✅ Links limpos (linha ${linha})`);
  }
  
  // =====================================================
  // 5️⃣ REGISTRAR AUDITORIA
  // =====================================================
  let abaAuditoria = ss.getSheetByName(CONFIG_CONTRATOS.abaAuditoria);
  if (!abaAuditoria) {
    abaAuditoria = ss.insertSheet(CONFIG_CONTRATOS.abaAuditoria);
    abaAuditoria.appendRow(['Data', 'Ação', 'Apto', 'Inquilino', 'Observação']);
  }
  
  const inquilino = dadosLinha[COL_CONTRATOS.inquilino - 1];
  abaAuditoria.appendRow([
    new Date(),
    'ENCERRAMENTO',
    apto,
    inquilino,
    `Contrato encerrado em ${dataSaida}`
  ]);
  
  Logger.log(`✅ Encerramento concluído - Apto ${apto}`);
}

// =====================================================
// BASE250 | INTEGRAÇÃO HTML ↔ GOOGLE SHEETS
// Funções que são chamadas pelo HTML via google.script.run
// =====================================================

/**
 * 1️⃣ EXECUTAR FLUXO COMPLETO
 */
function executarFluxoCompleto(apto, linha, tipo) {
  try {
    const isNovo = tipo === 'novo';
    
    // Chamar função do Módulo 3 (Importação)
    importarLinhaFormsParaContrato(apto, linha, isNovo);
    
    Logger.log(`✅ Fluxo concluído para apto ${apto}`);
    
    return {
      sucesso: true,
      mensagem: 'Fluxo completo executado com sucesso!'
    };
  } catch (erro) {
    Logger.log(`❌ Erro: ${erro.message}`);
    return {
      sucesso: false,
      mensagem: erro.message
    };
  }
}

/**
 * 2️⃣ BUSCAR APARTAMENTO NA PLANILHA
 */
function buscarApartamento(apto) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const aba = ss.getSheetByName(CONFIG_CONTRATOS.abaContratos);
    const dados = aba.getDataRange().getValues();
    
    for (let i = 1; i < dados.length; i++) {
      if ((dados[i][0] || '').toString() === apto) {
        return {
          apto: dados[i][0],
          inquilino: dados[i][COL_CONTRATOS.inquilino - 1] || '-',
          valor: dados[i][COL_CONTRATOS.valorAluguel - 1] || '-',
          dataEntrada: formatarData(dados[i][COL_CONTRATOS.dataEntrada - 1]),
          email: dados[i][COL_CONTRATOS.email - 1] || '-',
          telefone: dados[i][COL_CONTRATOS.telefone - 1] || '-',
          status: dados[i][COL_CONTRATOS.status - 1] || '-',
          linkPasta: dados[i][COL_CONTRATOS.linkPasta - 1] ? true : false
        };
      }
    }
    
    return null;
  } catch (erro) {
    Logger.log(`❌ Erro ao buscar: ${erro.message}`);
    throw new Error(erro.message);
  }
}

/**
 * 3️⃣ OBTER TEMPLATE DE E-MAIL
 */
function obterEmailTemplate(tipo, apto) {
  try {
    const d = buscarApartamento(apto);
    
    if (!d) {
      throw new Error('Apartamento não encontrado');
    }
    
    let tpl;
    switch(tipo) {
      case '1':
        tpl = emailTemplateContrato(d);
        break;
      case '2':
        tpl = emailTemplateConfirmacaoContrato(d);
        break;
      case '3':
        tpl = emailTemplateBoasVindas(d);
        break;
      case '4':
        tpl = emailTemplateContratoFinal(d);
        break;
      case '5':
        tpl = emailTemplateDeclaracao(d);
        break;
      default:
        throw new Error('Tipo de e-mail inválido');
    }
    
    return {
      titulo: `E-mail ${tipo}`,
      assunto: tpl.assunto,
      corpo: tpl.corpo,
      email: d.email
    };
  } catch (erro) {
    Logger.log(`❌ Erro: ${erro.message}`);
    throw new Error(erro.message);
  }
}

/**
 * 4️⃣ ENVIAR E-MAIL INTEGRADO
 */
function enviarEmailIntegrado(tipo, apto) {
  try {
    const d = buscarApartamento(apto);
    
    if (!d || !d.email) {
      throw new Error('E-mail não encontrado');
    }
    
    let tpl;
    switch(tipo) {
      case '1':
        tpl = emailTemplateContrato(d);
        break;
      case '2':
        tpl = emailTemplateConfirmacaoContrato(d);
        break;
      case '3':
        tpl = emailTemplateBoasVindas(d);
        break;
      case '4':
        tpl = emailTemplateContratoFinal(d);
        break;
      case '5':
        tpl = emailTemplateDeclaracao(d);
        break;
      default:
        throw new Error('Tipo inválido');
    }
    
    // Buscar logo
    const logoBlob = getLogoBlob();
    
    // Opções do e-mail
    const emailOptions = {
      to: d.email,
      subject: tpl.assunto,
      htmlBody: tpl.htmlBody,
      body: tpl.corpo
    };
    
    // Adicionar logo inline se disponível
    if (logoBlob) {
      emailOptions.inlineImages = {
        logoBASE250: logoBlob
      };
    }
    
    // Buscar PDF se necessário
    if (tipo === '1' || tipo === '4' || tipo === '5') {
      const pdf = localizarPdf(d.linkPasta, 'CONTRATO_');
      if (pdf) {
        emailOptions.attachments = [pdf];
      }
    }
    
    // Enviar
    MailApp.sendEmail(emailOptions);
    
    // Registrar auditoria
    registrarAuditoriaEnvio(apto, d.inquilino, `EMAIL ${tipo}`);
    
    Logger.log(`✅ E-mail ${tipo} enviado para ${d.email}`);
    
    return {
      sucesso: true,
      email: d.email,
      tipo: `E-mail ${tipo}`
    };
  } catch (erro) {
    Logger.log(`❌ Erro: ${erro.message}`);
    return {
      sucesso: false,
      erro: erro.message
    };
  }
}

/**
 * 5️⃣ GERAR MENSAGEM WHATSAPP
 */
function gerarMensagemWhatsApp(tipo, apto) {
  try {
    const d = buscarApartamento(apto);
    
    if (!d) {
      throw new Error('Apartamento não encontrado');
    }
    
    const mensagens = {
      'contrato': `🏢 Olá ${d.inquilino}!\n\nEnviamos o *contrato de locação do Apto ${apto}* por e-mail 📧\n\nConfira sua caixa de entrada.\n\nAtenciosamente,\nBASE250`,
      'assinado': `✅ Olá ${d.inquilino}!\n\nConfirmamos o *recebimento do contrato assinado* do Apto ${apto}!\n\nEm breve enviamos as próximas orientações.\n\nAtenciosamente,\nBASE250`,
      'boasvindas': `🏢 Olá ${d.inquilino}!\n\nSeja *bem-vindo ao BASE250* 🏠\n\nEm breve combinamos a entrega das chaves!\n\nAtenciosamente,\nBASE250`,
      'declaracao': `🧾 Olá ${d.inquilino}!\n\nA *Declaração de Residência do Apto ${apto}* foi enviada por e-mail 📧\n\nAtenciosamente,\nBASE250`
    };
    
    return {
      sucesso: true,
      mensagem: mensagens[tipo] || 'Mensagem não encontrada'
    };
  } catch (erro) {
    return {
      sucesso: false,
      erro: erro.message
    };
  }
}

/**
 * 6️⃣ VERIFICAR ANTES DE ENCERRAR
 */
function verificarEncerramento(apto) {
  try {
    const d = buscarApartamento(apto);
    
    if (!d) {
      return {
        sucesso: false,
        erro: 'Apartamento não encontrado'
      };
    }
    
    if (!d.inquilino || d.inquilino === '-') {
      return {
        sucesso: false,
        erro: 'Este apartamento já está vazio'
      };
    }
    
    return {
      sucesso: true,
      inquilino: d.inquilino
    };
  } catch (erro) {
    return {
      sucesso: false,
      erro: erro.message
    };
  }
}

/**
 * 7️⃣ ENCERRAR CONTRATO INTEGRADO
 */
function encerrarContratoIntegrado(apto, data, obs) {
  try {
    // Verificação
    const verif = verificarEncerramento(apto);
    if (!verif.sucesso) {
      return verif;
    }
    
    // Localizar linha
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const aba = ss.getSheetByName(CONFIG_CONTRATOS.abaContratos);
    const dados = aba.getDataRange().getValues();
    
    let linha = -1;
    let dadosLinha = null;
    
    for (let i = 1; i < dados.length; i++) {
      if ((dados[i][0] || '').toString() === apto) {
        linha = i + 1;
        dadosLinha = dados[i];
        break;
      }
    }
    
    if (linha === -1) {
      throw new Error('Apartamento não encontrado');
    }
    
    // Chamar função do Módulo 10
    encerrarContrato(apto, linha, dadosLinha, data);
    
    Logger.log(`✅ Contrato ${apto} encerrado`);
    
    return {
      sucesso: true,
      mensagem: 'Contrato encerrado com sucesso'
    };
  } catch (erro) {
    Logger.log(`❌ Erro: ${erro.message}`);
    return {
      sucesso: false,
      erro: erro.message
    };
  }
}

