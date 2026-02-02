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

/**
 * CRIAR MENU NO SHEETS
 */
function onOpen(e) {
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('🚀 BASE250')
    .addItem('📱 Abrir Painel Integrado', 'abrirPainelIntegrado')
    .addToUi();
}

/**
 * ABRIR PAINEL
 */
function abrirPainelIntegrado() {
  const html = HtmlService.createHtmlOutputFromFile('painel-completo-base250-INTEGRADO');
  SpreadsheetApp.getUi().showModelessDialog(html, '🚀 BASE250 - Painel Integrado');
}
