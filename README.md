# BASE250 - Sistema de Gestão de Imóveis

## 🏢 Visão Geral

BASE250 é um sistema completo de gestão de imóveis desenvolvido com Google Apps Script, integrado ao Google Sheets, Google Forms e Google Drive. O sistema automatiza o processo de locação de apartamentos, desde a coleta de dados até a geração de contratos e comunicação com inquilinos.

## 📋 Índice

- [Características](#-características)
- [Versões Disponíveis](#-versões-disponíveis)
- [Instalação](#-instalação)
- [Configuração](#️-configuração)
- [Uso](#-uso)
- [Documentação](#-documentação)
- [Contribuindo](#-contribuindo)
- [Suporte](#-suporte)
- [Licença](#-licença)

## ✨ Características

### Funcionalidades Principais

- ✅ **Sincronização Automática de Formulários**
  - Importação automática de dados do Google Forms
  - Validação de dados em tempo real
  - Detecção flexível de cabeçalhos

- ✅ **Gestão de Contratos**
  - Geração automática de contratos em PDF
  - Templates personalizáveis
  - Nomenclatura padronizada de arquivos

- ✅ **Dashboard Administrativo**
  - Interface web responsiva
  - Visualização de estatísticas
  - CRUD completo de inquilinos

- ✅ **Gestão de Documentos**
  - Organização automática no Google Drive
  - Download e upload de anexos
  - Links centralizados

- ✅ **Comunicação Automatizada**
  - Envio de emails personalizados
  - Templates de WhatsApp
  - Notificações de status

- ✅ **Declarações de Residência**
  - Geração automática
  - Formato padronizado
  - Assinatura digital

## 📦 Versões Disponíveis

### V1 (INTEGRACAO_HTML_GAS.gs) - Versão Original
- ⚠️ **Status:** Funcional mas com problemas de qualidade
- 📊 **Tamanho:** ~6,305 linhas
- 🔴 **Problemas conhecidos:**
  - Funções duplicadas (~30% do código)
  - Dados sensíveis hardcoded
  - Performance limitada
  - Falta de documentação

### V2 (INTEGRACAO_HTML_GAS_V2.gs) - Versão Refatorada ⭐ RECOMENDADA
- ✅ **Status:** Produção ready (starter implementation)
- 📊 **Tamanho:** ~1,000 linhas (módulos base)
- ✅ **Melhorias:**
  - Zero duplicação de código
  - Dados sensíveis em Script Properties
  - Cache para melhor performance
  - Documentação JSDoc completa
  - Tratamento de erros robusto
  - Estilo de código consistente

## 🚀 Instalação

### Pré-requisitos

- Conta Google (Gmail)
- Google Sheets
- Google Forms (opcional)
- Google Drive

### Passos de Instalação

1. **Criar ou abrir planilha Google Sheets**
   ```
   https://sheets.google.com → Novo → Planilha em branco
   Nome sugerido: "BASE250 - Gestão de Imóveis"
   ```

2. **Criar abas necessárias**
   - Contratos
   - Links
   - Saídas
   - Auditoria
   - Form_Responses (se usar Google Forms)

3. **Abrir Editor de Apps Script**
   ```
   Extensões → Apps Script
   ```

4. **Adicionar código V2 (recomendado)**
   ```javascript
   // Criar arquivo: INTEGRACAO_HTML_GAS.gs
   // Copiar conteúdo de INTEGRACAO_HTML_GAS_V2.gs
   // Salvar (Ctrl+S ou Cmd+S)
   ```

5. **Adicionar arquivos HTML**
   ```
   - admin.html (Dashboard administrativo)
   - painel_base250.html (Painel principal)
   - painel-completo-base250.html (Painel completo)
   ```

6. **Configurar Script Properties** (IMPORTANTE para V2)
   ```
   Apps Script → Projeto → Configurações → Propriedades do script
   ```
   
   Propriedades obrigatórias:
   - `ADMIN_EMAIL`
   - `PROPRIETARIO_NOME`
   - `PROPRIETARIO_CPF`
   - `PROPRIETARIO_TELEFONE`
   - ... (ver lista completa em MIGRATION_GUIDE.md)

7. **Configurar triggers**
   ```
   Apps Script → Gatilhos → Adicionar gatilho
   Função: onFormSubmit
   Tipo de evento: Ao enviar formulário
   ```

## ⚙️ Configuração

### Configuração Básica

1. **IDs de Pastas do Drive**
   ```javascript
   // Em CONFIG_CONTRATOS
   pastaRaizId: 'SEU_ID_AQUI'
   pastaDocumentosId: 'SEU_ID_AQUI'
   pastaFotosId: 'SEU_ID_AQUI'
   ```

2. **Templates de Documentos**
   ```javascript
   // IDs dos templates no Google Docs
   templateContratoId: 'SEU_ID_AQUI'
   templateDeclaracaoId: 'SEU_ID_AQUI'
   ```

3. **Mapeamento de Colunas**
   ```javascript
   // Ajustar COL_CONTRATOS se necessário
   // Veja estrutura recomendada na documentação
   ```

### Configuração Avançada

Para configurações detalhadas, consulte:
- `IMPLEMENTATION_NOTES.md` - Notas de implementação
- `MIGRATION_GUIDE.md` - Guia de migração V1→V2
- `REVIEW_INTEGRACAO_HTML_GAS.md` - Review completo do código

## 💡 Uso

### Fluxo Básico de Trabalho

1. **Coletar dados do inquilino**
   ```
   Google Forms → Preenchimento → Envio automático
   ```

2. **Importar dados para planilha**
   ```
   Menu BASE250 → Importar do Forms
   Ou automático via trigger onFormSubmit
   ```

3. **Gerar contrato**
   ```
   Menu BASE250 → Gerar Contrato
   Selecionar apartamento → Confirmar
   ```

4. **Enviar contrato**
   ```
   Menu BASE250 → Enviar Contrato por Email
   ```

5. **Gerenciar via Dashboard**
   ```
   Menu BASE250 → Abrir Painel Administrativo
   ```

### Funções Principais do Menu

- 📋 **Resumo** - Visão geral dos apartamentos
- 📥 **Importar do Forms** - Importar dados de inquilino
- 📄 **Gerar Contrato** - Criar contrato a partir do template
- 📧 **Enviar Contrato** - Enviar por email
- 📝 **Gerar Declaração** - Declaração de residência
- 🏢 **Abrir Painel** - Dashboard administrativo

## 📚 Documentação

### Documentos Disponíveis

1. **REVIEW_INTEGRACAO_HTML_GAS.md**
   - Review completo do código V1
   - Identificação de problemas
   - Recomendações de melhoria
   - Score: 5.5/10

2. **MIGRATION_GUIDE.md**
   - Guia passo a passo V1→V2
   - Cronograma de migração (5 semanas)
   - Troubleshooting
   - Rollback procedures

3. **IMPLEMENTATION_NOTES.md**
   - Notas de implementação
   - Arquitetura modular
   - Features implementadas
   - Checklist de testes

### Arquitetura

O sistema é dividido em 11 módulos:

```
M00 - CONFIG      → Configurações globais
M01 - UTILS       → Utilitários (formatação, validação)
M02 - FILES       → Gestão de arquivos no Drive
M03 - FORMS       → Integração com Google Forms
M04 - MENU        → Sistema de menus
M05 - CONTRACT    → Geração de contratos
M06 - DECLARATION → Geração de declarações
M07 - EMAIL_TPL   → Templates de email
M08 - EMAIL_SEND  → Envio de emails
M09 - WHATSAPP    → Integração WhatsApp
M10 - TERMINATION → Encerramento de contratos
```

## 🔒 Segurança

### Boas Práticas Implementadas (V2)

- ✅ Dados sensíveis em Script Properties (não no código)
- ✅ Validação de entrada em todas as funções
- ✅ Tratamento de erros robusto
- ✅ Logs de auditoria
- ✅ Sanitização de nomes de arquivos

### Recomendações de Segurança

1. **NUNCA** commitar dados sensíveis no código
2. Usar Script Properties para credenciais
3. Revisar logs de auditoria regularmente
4. Manter backup atualizado
5. Testar em ambiente dev antes de produção

## 💰 Domínio Personalizado e HTTPS

### Custos Opcionais para Profissionalizar o Sistema

O BASE250 funciona gratuitamente com Google Apps Script, mas você pode adicionar um domínio personalizado e HTTPS para maior profissionalismo:

#### Estimativa de Custos

| Item | Custo | Provedor Recomendado |
|------|-------|---------------------|
| **Domínio .com.br** | R$ 40/ano | [Registro.br](https://registro.br/) (oficial) |
| **SSL/HTTPS** | **Gratuito** | [Let's Encrypt](https://letsencrypt.org/) ou [Cloudflare](https://www.cloudflare.com/) |
| **Hospedagem** | **Gratuito** | Google Apps Script (continua gratuito) |
| **CDN + Proteção DDoS** | **Gratuito** | Cloudflare (plano Free) |

**Total anual: R$ 40,00** (apenas o domínio)

#### Benefícios

- ✅ URL profissional (ex: `https://app.base250.com.br`)
- ✅ Certificado SSL/TLS gratuito
- ✅ Proteção contra DDoS
- ✅ CDN global para melhor performance
- ✅ Maior credibilidade com usuários

#### Guia Completo

Para instruções detalhadas de implementação, custos e configuração, consulte:
📘 **[COST_ESTIMATES.md](./COST_ESTIMATES.md)** - Guia completo de custos e implementação de domínio + HTTPS

## 🐛 Troubleshooting

### Problemas Comuns

**Erro: "Permissão negada"**
```javascript
// Solução: Reautorizar script
Executar qualquer função → Revisar permissões → Permitir
```

**Erro: "getScriptProperty is not defined"**
```javascript
// Solução: Verificar se V2 está carregado
Apps Script → Arquivos → Verificar INTEGRACAO_HTML_GAS_V2.gs
```

**Performance lenta**
```javascript
// Solução: Limpar cache
CacheManager.clearAll();
```

## 🤝 Contribuindo

### Como Contribuir

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

### Guidelines de Código

- Seguir padrões da V2
- Adicionar documentação JSDoc
- Incluir tratamento de erros
- Testar antes de submeter
- Sem dados sensíveis no código

## 📞 Suporte

### Canais de Suporte

- **Email:** suporte@base250.com.br
- **Issues:** GitHub Issues
- **Documentação:** Ver arquivos .md no repositório

### FAQ

**P: Qual versão devo usar?**
R: Use V2 para novos projetos. Para projetos existentes em V1, siga o MIGRATION_GUIDE.md.

**P: Como faço backup?**
R: Google Sheets → Arquivo → Fazer cópia. Apps Script → Exportar como ZIP.

**P: Posso usar com múltiplos imóveis?**
R: Sim, o sistema é modular e pode ser adaptado.

**P: Há custos?**
R: O sistema BASE250 usa ferramentas gratuitas do Google. Custos opcionais:
- Domínio .com.br: R$ 40/ano (via Registro.br)
- HTTPS: Gratuito (Let's Encrypt ou Cloudflare)
- Veja detalhes completos em [COST_ESTIMATES.md](./COST_ESTIMATES.md)

## 📊 Status do Projeto

- ✅ V1: Funcional (com issues conhecidos)
- ✅ V2: Lançado com segurança aprimorada
- 🔄 Migração: Documentada e pronta para execução
- 📝 Documentação: Completa

## 🗓️ Roadmap

### Próximas Versões

**V2.1 (Q1 2026)**
- [x] Completar todos os módulos
- [x] Remover PII do código fonte
- [x] Input sanitization
- [x] Access control
- [x] Audit logs
- [ ] Testes automatizados
- [ ] CI/CD pipeline

**V2.2 (Q2 2026)**
- [ ] Interface mobile responsiva
- [ ] Notificações push
- [ ] Integração WhatsApp Business API

**V3.0 (Q3 2026)**
- [ ] Multi-tenancy support
- [ ] Analytics dashboard
- [ ] API REST

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Equipe BASE250** - Desenvolvimento

## 🙏 Agradecimentos

- Google Apps Script Community
- BASE250 Residencial Itacorubi
- Todos os contribuidores

---

## 📌 Links Rápidos

- [Review Completo](./REVIEW_INTEGRACAO_HTML_GAS.md)
- [Guia de Migração](./MIGRATION_GUIDE.md)
- [Notas de Implementação](./IMPLEMENTATION_NOTES.md)
- [Estimativa de Custos - Domínio e HTTPS](./COST_ESTIMATES.md) 💰
- [Código V1](./INTEGRACAO_HTML_GAS.gs)
- [Código V2](./INTEGRACAO_HTML_GAS_V2.gs) ⭐

---

**© 2026 BASE250 - Sistema de Gestão de Imóveis**

*Desenvolvido com ❤️ usando Google Apps Script*
