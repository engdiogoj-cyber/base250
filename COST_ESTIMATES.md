# 💰 Estimativa de Custos - Domínio e HTTPS

## 📋 Visão Geral

Este documento fornece estimativas de custos para registrar um domínio personalizado e implementar HTTPS para o sistema BASE250, focando em opções acessíveis e seguras.

---

## 1. 🌐 Registro de Domínio .com.br

### 1.1 Custos de Registro

#### Registro.br (Provedor Oficial)

**Registro.br** é o provedor oficial e exclusivo para domínios .br no Brasil, gerenciado pelo NIC.br (Núcleo de Informação e Coordenação do Ponto BR).

| Item | Custo | Observações |
|------|-------|-------------|
| **Registro inicial (.com.br)** | R$ 40,00/ano | Preço oficial do Registro.br |
| **Renovação anual** | R$ 40,00/ano | Mesmo valor do registro inicial |
| **Transferência de titularidade** | Gratuito | Sem custos adicionais |
| **Alteração de dados** | Gratuito | Incluindo DNS |

**Total estimado no 1º ano:** R$ 40,00  
**Total estimado anual (renovação):** R$ 40,00

#### Características do Registro.br

✅ **Vantagens:**
- Único provedor autorizado para domínios .br
- Preço fixo e regulamentado
- Interface em português
- Suporte técnico em português
- Segurança e confiabilidade
- Sistema de DNS gratuito

⚠️ **Importante saber:**
- Não é necessário intermediário (revenda)
- Registro direto no site oficial: [registro.br](https://registro.br/)
- Pagamento via PIX, boleto ou cartão de crédito
- Domínio renovável a cada ano
- Aviso de renovação enviado por email 30 dias antes do vencimento

### 1.2 Processo de Registro

#### Passo a Passo

1. **Acessar o site oficial**
   - URL: https://registro.br/
   - Clique em "Registrar domínio"

2. **Verificar disponibilidade**
   - Busque o domínio desejado (ex: base250.com.br)
   - Verifique se está disponível

3. **Criar conta no Registro.br**
   - CPF ou CNPJ do titular
   - Email válido para contato
   - Telefone para verificação

4. **Preencher informações**
   - Dados do titular (pessoa física ou jurídica)
   - Dados administrativos
   - Dados técnicos (opcional - pode usar padrão)

5. **Configurar DNS**
   - Opção 1: Usar DNS do Registro.br (gratuito)
   - Opção 2: Usar DNS de terceiros (ex: Cloudflare)

6. **Realizar pagamento**
   - R$ 40,00 via PIX (recomendado - instantâneo)
   - Boleto bancário (leva 1-3 dias úteis)
   - Cartão de crédito

7. **Ativação**
   - Domínio ativo em até 24 horas
   - Geralmente instantâneo com pagamento via PIX

### 1.3 Alternativas de Domínio

Se .com.br não estiver disponível, considere:

| Domínio | Custo Anual | Provedor |
|---------|-------------|----------|
| **.net.br** | R$ 40,00 | Registro.br |
| **.org.br** | R$ 40,00 | Registro.br |
| **.app.br** | R$ 40,00 | Registro.br |
| **.com** | ~US$ 10-15 (R$ 50-75) | GoDaddy, Namecheap, Google Domains |
| **.app** | ~US$ 12 (R$ 60) | Google Domains, Namecheap |

**Recomendação:** Use .com.br para melhor credibilidade no mercado brasileiro.

---

## 2. 🔒 HTTPS e Certificados SSL

### 2.1 Opções Gratuitas (Recomendado)

#### Let's Encrypt (⭐ Mais Recomendado)

**Let's Encrypt** é uma autoridade certificadora gratuita, automatizada e aberta, operada pela Internet Security Research Group (ISRG).

| Item | Custo | Validade |
|------|-------|----------|
| **Certificado SSL/TLS** | **GRATUITO** | 90 dias (renovável automaticamente) |
| **Renovação automática** | **GRATUITO** | Ilimitada |
| **Wildcard SSL** | **GRATUITO** | 90 dias (renovável) |
| **Suporte múltiplos domínios** | **GRATUITO** | Ilimitado |

✅ **Vantagens:**
- Totalmente gratuito
- Reconhecido por todos os navegadores
- Renovação automática (via Certbot)
- Suporte para wildcard (*.seudominio.com.br)
- Criptografia de 256 bits
- TLS 1.3 suportado
- Sem limite de certificados

📝 **Como usar:**
```bash
# Com Certbot (ferramenta oficial)
sudo apt-get install certbot
sudo certbot certonly --standalone -d seudominio.com.br
```

#### Cloudflare SSL (⭐ Recomendado)

**Cloudflare** oferece SSL gratuito como parte de seu serviço de CDN e segurança.

| Item | Custo | Validade |
|------|-------|----------|
| **SSL Flexível** | **GRATUITO** | Ilimitado |
| **SSL Completo** | **GRATUITO** | Ilimitado |
| **Proteção DDoS** | **GRATUITO** | Ilimitado |
| **CDN Global** | **GRATUITO** | Ilimitado |
| **Cache** | **GRATUITO** | Ilimitado |

✅ **Vantagens:**
- Gratuito permanente (plano Free)
- Ativação em minutos
- Proteção contra DDoS incluída
- CDN global para melhor performance
- Gerenciamento de DNS gratuito
- Firewall de aplicação web (WAF) básico
- Certificado universal SSL

📝 **Como usar:**
1. Criar conta gratuita em [cloudflare.com](https://www.cloudflare.com/)
2. Adicionar seu domínio
3. Atualizar nameservers no Registro.br
4. Ativar SSL (automático no plano Free)
5. Configurar modo SSL: "Full" ou "Full (strict)"

#### ZeroSSL

Alternativa ao Let's Encrypt.

| Item | Custo | Validade |
|------|-------|----------|
| **Certificado SSL** | **GRATUITO** | 90 dias |
| **Até 3 certificados** | **GRATUITO** | - |

### 2.2 Opções Pagas (Para Comparação)

#### Certificados SSL Comerciais

| Provedor | Tipo | Custo Anual | Características |
|----------|------|-------------|-----------------|
| **Comodo PositiveSSL** | DV | ~R$ 150-300 | Validação de domínio |
| **RapidSSL** | DV | ~R$ 200-400 | Validação rápida |
| **Comodo EV SSL** | EV | ~R$ 1.500-3.000 | Validação estendida, barra verde |
| **DigiCert SSL Plus** | OV | ~R$ 1.000-2.000 | Validação organizacional |
| **Sectigo** | DV/OV | ~R$ 200-1.500 | Vários níveis |

**Observação:** Para o BASE250, certificados pagos NÃO são necessários. Let's Encrypt ou Cloudflare são suficientes.

---

## 3. 🏗️ Implementação de HTTPS

### 3.1 Cenário 1: Google Apps Script + Cloudflare (⭐ Recomendado)

**Arquitetura recomendada para BASE250:**

```
Usuário → Cloudflare (SSL/HTTPS) → Google Apps Script → Google Sheets
```

#### Custos
| Item | Custo |
|------|-------|
| Google Apps Script | **GRATUITO** (dentro dos limites) |
| Cloudflare Free | **GRATUITO** |
| Domínio .com.br | R$ 40,00/ano |
| **TOTAL ANUAL** | **R$ 40,00** |

#### Configuração
1. **Publicar Web App no Google Apps Script**
   ```javascript
   // No Apps Script
   function doGet() {
     return HtmlService.createHtmlOutputFromFile('index');
   }
   
   // Publicar como:
   // - Executar como: Eu
   // - Quem tem acesso: Qualquer pessoa
   ```

2. **Obter URL do Web App**
   ```
   https://script.google.com/macros/s/SEU_ID/exec
   ```

3. **Configurar Cloudflare**
   - Adicionar domínio no Cloudflare
   - Criar registro CNAME:
     - Nome: `app` ou `base250`
     - Destino: `script.google.com`
     - Proxy: Ativado (nuvem laranja)
   
4. **Configurar Workers (opcional)**
   - Criar Worker no Cloudflare para proxy reverso
   - Redirecionar para URL do Apps Script

5. **Ativar SSL**
   - Modo SSL: Full
   - Always Use HTTPS: Ativado
   - Automatic HTTPS Rewrites: Ativado

✅ **Vantagens:**
- Custo zero para SSL/HTTPS
- Performance melhorada com CDN
- Proteção DDoS incluída
- Fácil configuração
- Manutenção mínima

### 3.2 Cenário 2: Servidor Próprio + Let's Encrypt

Se precisar de servidor próprio no futuro:

#### Custos
| Item | Custo Mensal | Custo Anual |
|------|--------------|-------------|
| VPS básico (Contabo, DigitalOcean) | R$ 20-50 | R$ 240-600 |
| Domínio .com.br | - | R$ 40 |
| Let's Encrypt SSL | **GRATUITO** | **R$ 0** |
| **TOTAL ANUAL** | - | **R$ 280-640** |

**Observação:** NÃO recomendado para BASE250, pois o Google Apps Script já fornece hospedagem gratuita.

### 3.3 Cenário 3: Hosting Compartilhado

Se precisar de hospedagem web:

#### Provedores Brasileiros
| Provedor | Custo Mensal | SSL Incluído | Observações |
|----------|--------------|--------------|-------------|
| **Hostinger** | ~R$ 10-30 | ✅ Let's Encrypt | Bom custo-benefício |
| **HostGator BR** | ~R$ 15-40 | ✅ Let's Encrypt | Popular no Brasil |
| **UOL Host** | ~R$ 20-50 | ✅ SSL gratuito | Suporte em português |
| **Locaweb** | ~R$ 25-60 | ✅ SSL gratuito | Tradicional brasileira |

**Observação:** NÃO necessário para BASE250, mas listado para referência futura.

---

## 4. 📊 Resumo de Custos - Recomendação BASE250

### Opção Recomendada (Mais Econômica e Segura)

#### Configuração Atual Aprimorada

```
Google Apps Script (gratuito) + Cloudflare (gratuito) + Domínio .com.br
```

| Item | Custo Inicial | Custo Anual |
|------|---------------|-------------|
| **Domínio .com.br** | R$ 40,00 | R$ 40,00 |
| **SSL (Cloudflare)** | R$ 0,00 | R$ 0,00 |
| **Hospedagem (Google Apps Script)** | R$ 0,00 | R$ 0,00 |
| **CDN (Cloudflare)** | R$ 0,00 | R$ 0,00 |
| **Proteção DDoS** | R$ 0,00 | R$ 0,00 |
| **TOTAL** | **R$ 40,00** | **R$ 40,00/ano** |

#### Custos Projetados (5 anos)

| Ano | Custo |
|-----|-------|
| Ano 1 | R$ 40,00 |
| Ano 2 | R$ 40,00 |
| Ano 3 | R$ 40,00 |
| Ano 4 | R$ 40,00 |
| Ano 5 | R$ 40,00 |
| **TOTAL 5 ANOS** | **R$ 200,00** |

**Custo médio mensal:** R$ 3,33/mês

---

## 5. 🎯 Guia de Implementação Completo

### Fase 1: Registro de Domínio (Tempo: 1 dia)

#### Passo 1: Escolher o Domínio
```
Exemplo: base250.com.br
Alternativas: base250app.com.br, base250sistema.com.br
```

#### Passo 2: Verificar Disponibilidade
1. Acesse: https://registro.br/
2. Digite o nome desejado
3. Clique em "Buscar"
4. Verifique disponibilidade

#### Passo 3: Registrar
1. Clique em "Registrar"
2. Crie conta (se não tiver)
3. Preencha dados do titular
4. Configure DNS (pode usar padrão)
5. Pague R$ 40,00 (recomendado: PIX)

#### Passo 4: Aguardar Ativação
- Tempo médio: 1-24 horas
- Com PIX: geralmente instantâneo

### Fase 2: Configurar Cloudflare (Tempo: 30 minutos)

#### Passo 1: Criar Conta
1. Acesse: https://www.cloudflare.com/
2. Crie conta gratuita
3. Confirme email

#### Passo 2: Adicionar Domínio
1. Clique em "Add a Site"
2. Digite seu domínio: base250.com.br
3. Selecione plano "Free"
4. Clique em "Continue"

#### Passo 3: Configurar DNS
1. Cloudflare detecta registros DNS automáticos
2. Adicione registro para seu app:
   ```
   Tipo: CNAME
   Nome: app (ou @)
   Destino: script.google.com
   Proxy: Ativado
   ```

#### Passo 4: Atualizar Nameservers
1. Cloudflare fornecerá 2 nameservers:
   ```
   nameserver1.cloudflare.com
   nameserver2.cloudflare.com
   ```
2. Acesse Registro.br
3. Vá em "Gerenciar Domínio"
4. Altere nameservers para os do Cloudflare
5. Aguarde propagação (15min - 48h)

#### Passo 5: Ativar SSL
1. No painel Cloudflare, vá em "SSL/TLS"
2. Selecione modo: "Full"
3. Ative "Always Use HTTPS"
4. Ative "Automatic HTTPS Rewrites"

### Fase 3: Configurar Google Apps Script (Tempo: 15 minutos)

#### Passo 1: Publicar Web App
1. Abra seu projeto no Apps Script
2. Clique em "Implantar" → "Nova implantação"
3. Selecione tipo: "Web App"
4. Configure:
   ```
   Descrição: BASE250 Web App
   Executar como: Eu (seu email)
   Quem tem acesso: Qualquer pessoa
   ```
5. Clique em "Implantar"
6. Copie a URL gerada

#### Passo 2: Configurar Worker (Opcional)
Se precisar fazer proxy reverso:

```javascript
// Worker Cloudflare
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const gasUrl = 'https://script.google.com/macros/s/SEU_ID_AQUI/exec'
  
  // Adiciona query params
  const gasRequest = new Request(gasUrl + url.search, {
    method: request.method,
    headers: request.headers,
    body: request.body
  })
  
  return fetch(gasRequest)
}
```

### Fase 4: Testar (Tempo: 15 minutos)

#### Testes a Realizar
1. **Acesso HTTPS**
   ```
   https://app.base250.com.br (ou seu domínio)
   ```
   - ✅ Deve carregar com cadeado verde
   - ✅ Certificado válido
   - ✅ TLS 1.2 ou superior

2. **Redirecionamento HTTP → HTTPS**
   ```
   http://app.base250.com.br
   ```
   - ✅ Deve redirecionar automaticamente para HTTPS

3. **Performance**
   - Use [GTmetrix](https://gtmetrix.com/) ou [PageSpeed](https://pagespeed.web.dev/)
   - ✅ Verifique tempo de carregamento
   - ✅ Verifique cache do Cloudflare

4. **Segurança**
   - Use [SSL Labs](https://www.ssllabs.com/ssltest/)
   - ✅ Objetivo: Nota A ou A+

---

## 6. 🔐 Considerações de Segurança

### 6.1 Boas Práticas

#### SSL/TLS
- ✅ Use TLS 1.2 ou superior
- ✅ Desative protocolos antigos (SSL 2.0, SSL 3.0, TLS 1.0, TLS 1.1)
- ✅ Configure HSTS (HTTP Strict Transport Security)
- ✅ Use certificados de pelo menos 2048 bits

#### Cloudflare
```
Configurações recomendadas:
- SSL/TLS Mode: Full (strict)
- Always Use HTTPS: On
- Automatic HTTPS Rewrites: On
- Minimum TLS Version: 1.2
- Opportunistic Encryption: On
- TLS 1.3: Enabled
- HSTS: Enabled (max-age=31536000)
```

### 6.2 Headers de Segurança

Configure no Cloudflare (Page Rules ou Workers):

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## 7. 💡 Alternativas e Upgrade Futuro

### 7.1 Se Precisar Escalar

Quando o Google Apps Script atingir limites (improvável):

#### Opção A: Cloudflare Workers + Google Sheets
| Item | Custo |
|------|-------|
| Cloudflare Workers Free | 100.000 req/dia grátis |
| Adicional | US$ 0,50/milhão de requisições |

#### Opção B: Google Cloud Platform
| Item | Custo Estimado |
|------|----------------|
| Cloud Run | ~US$ 0 (dentro do free tier) |
| Cloud Functions | ~US$ 0 (dentro do free tier) |

### 7.2 Features Adicionais (Opcional)

| Feature | Provedor | Custo |
|---------|----------|-------|
| **Email profissional** | Google Workspace | ~R$ 30/mês/usuário |
| **Backup automatizado** | Backupify | ~US$ 3/mês |
| **Monitoramento uptime** | UptimeRobot | Gratuito (50 monitors) |
| **Analytics avançado** | Google Analytics | Gratuito |
| **Firewall avançado** | Cloudflare Pro | US$ 20/mês |

---

## 8. 📞 Suporte e Recursos

### 8.1 Documentação Oficial

#### Registro.br
- Site: https://registro.br/
- Documentação: https://registro.br/ajuda/
- Suporte: https://registro.br/suporte/
- FAQ: https://registro.br/faq/

#### Cloudflare
- Site: https://www.cloudflare.com/
- Docs: https://developers.cloudflare.com/
- Community: https://community.cloudflare.com/
- Status: https://www.cloudflarestatus.com/

#### Let's Encrypt
- Site: https://letsencrypt.org/
- Docs: https://letsencrypt.org/docs/
- Community: https://community.letsencrypt.org/

### 8.2 Ferramentas Úteis

#### Teste SSL/TLS
- **SSL Labs:** https://www.ssllabs.com/ssltest/
- **SSL Checker:** https://www.sslshopper.com/ssl-checker.html

#### Teste Performance
- **GTmetrix:** https://gtmetrix.com/
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **WebPageTest:** https://www.webpagetest.org/

#### Verificação DNS
- **DNSChecker:** https://dnschecker.org/
- **MXToolbox:** https://mxtoolbox.com/

---

## 9. 📋 Checklist de Implementação

### Antes de Começar
- [ ] Definir nome do domínio desejado
- [ ] Preparar dados para registro (CPF/CNPJ)
- [ ] Ter conta Google com Apps Script configurado
- [ ] Reservar 2-3 horas para implementação completa

### Registro de Domínio
- [ ] Verificar disponibilidade no Registro.br
- [ ] Criar conta no Registro.br
- [ ] Preencher dados do titular
- [ ] Realizar pagamento (R$ 40,00)
- [ ] Aguardar ativação (1-24h)

### Configuração Cloudflare
- [ ] Criar conta no Cloudflare
- [ ] Adicionar domínio
- [ ] Configurar DNS básico
- [ ] Atualizar nameservers no Registro.br
- [ ] Aguardar propagação (15min-48h)
- [ ] Ativar SSL (modo Full)
- [ ] Configurar Always Use HTTPS
- [ ] Testar HTTPS

### Configuração Apps Script
- [ ] Publicar Web App
- [ ] Copiar URL da publicação
- [ ] Configurar Worker (se necessário)
- [ ] Adicionar registro DNS no Cloudflare
- [ ] Testar acesso via domínio personalizado

### Testes Finais
- [ ] Testar HTTPS (cadeado verde)
- [ ] Testar redirecionamento HTTP→HTTPS
- [ ] Verificar certificado SSL (SSL Labs)
- [ ] Testar performance (GTmetrix)
- [ ] Verificar headers de segurança
- [ ] Testar em múltiplos dispositivos
- [ ] Documentar URLs finais

---

## 10. 🎓 Perguntas Frequentes (FAQ)

### Q1: Preciso mesmo de um domínio personalizado?
**R:** Não é obrigatório. O Google Apps Script fornece URLs funcionais. Mas um domínio personalizado oferece:
- Profissionalismo
- Marca própria
- Confiança dos usuários
- URLs memoráveis

### Q2: Por que Registro.br e não outras empresas?
**R:** Registro.br é o único provedor oficial para domínios .br. Outras empresas são apenas revendedores que cobram taxas adicionais.

### Q3: Let's Encrypt é realmente gratuito?
**R:** Sim, 100% gratuito. É uma iniciativa sem fins lucrativos apoiada por grandes empresas (Mozilla, Chrome, Cisco, etc.).

### Q4: Cloudflare é seguro?
**R:** Sim. Cloudflare é usado por milhões de sites, incluindo grandes empresas. O plano Free é confiável e robusto.

### Q5: Quanto tempo leva para configurar tudo?
**R:** 
- Registro de domínio: 1-24 horas
- Configuração Cloudflare: 30 minutos
- Propagação DNS: 15 minutos - 48 horas
- Total: 1-3 dias (incluindo esperas)

### Q6: E se eu não quiser usar Cloudflare?
**R:** Você pode usar:
- DNS do Registro.br (gratuito) + Let's Encrypt direto
- Google Cloud DNS + Cloud Load Balancer
- Outros provedores de DNS + Let's Encrypt

### Q7: O certificado Let's Encrypt expira?
**R:** Sim, a cada 90 dias. Mas a renovação é automática com Certbot ou Cloudflare.

### Q8: Posso ter email personalizado com meu domínio?
**R:** Sim, mas é um custo adicional:
- Google Workspace: ~R$ 30/mês/usuário
- Zoho Mail: Plano gratuito limitado ou ~US$ 1/mês
- ImprovMX: Gratuito (apenas encaminhamento)

### Q9: O que acontece se eu não renovar o domínio?
**R:** 
- 15 dias após vencimento: ainda funciona
- 30 dias: domínio entra em período de renovação
- 45 dias: domínio pode ser liberado para terceiros
- **Importante:** Configure lembretes para não perder!

### Q10: Posso migrar de domínio depois?
**R:** Sim, mas exige:
- Registrar novo domínio
- Configurar DNS no novo domínio
- Atualizar referências no sistema
- Manter domínio antigo por período de transição

---

## 11. 📊 Comparação: Com e Sem Domínio

### Sem Domínio Personalizado (Atual)

**URL de exemplo:**
```
https://script.google.com/macros/s/AKfycbzXYZ.../exec
```

❌ **Desvantagens:**
- URL longa e difícil de memorizar
- Menos profissional
- Falta de branding
- Credibilidade reduzida
- Difícil de compartilhar

✅ **Vantagens:**
- Gratuito
- Sem configuração adicional
- Funciona imediatamente

**Custo total:** R$ 0,00

### Com Domínio Personalizado (Recomendado)

**URL de exemplo:**
```
https://app.base250.com.br
```

✅ **Vantagens:**
- URL curta e memorável
- Profissional e confiável
- Branding próprio
- Maior credibilidade
- Fácil de compartilhar
- SSL incluído (Cloudflare)
- Proteção DDoS incluída
- CDN global incluído

❌ **Desvantagens:**
- Custo anual de R$ 40,00
- Requer configuração inicial (1-2 dias)

**Custo total:** R$ 40,00/ano (R$ 3,33/mês)

### Recomendação

✅ **VALE A PENA** investir R$ 40/ano por:
- Profissionalismo
- Credibilidade
- Experiência do usuário melhorada
- Segurança adicional (Cloudflare)
- Performance melhorada (CDN)

---

## 12. 📝 Conclusão

### Resumo Executivo

Para implementar um domínio personalizado com HTTPS no sistema BASE250:

#### Custos Totais
- **Custo inicial:** R$ 40,00 (domínio .com.br)
- **Custo anual recorrente:** R$ 40,00 (renovação)
- **SSL/HTTPS:** R$ 0,00 (gratuito via Cloudflare ou Let's Encrypt)
- **Hospedagem:** R$ 0,00 (Google Apps Script continua gratuito)

#### Investimento de Tempo
- **Configuração inicial:** 2-3 horas
- **Manutenção anual:** 15 minutos (renovação de domínio)

#### ROI (Retorno sobre Investimento)
Por apenas **R$ 3,33/mês**, você obtém:
- ✅ Domínio personalizado (.com.br)
- ✅ HTTPS/SSL gratuito
- ✅ Proteção DDoS
- ✅ CDN global
- ✅ Cache inteligente
- ✅ Profissionalismo e credibilidade

### Recomendação Final

✅ **RECOMENDAMOS** implementar a solução:
```
Registro.br (R$ 40/ano) + Cloudflare Free (R$ 0) + Google Apps Script (R$ 0)
```

Esta é a solução mais econômica e profissional para o BASE250, mantendo a gratuidade da hospedagem enquanto adiciona:
- Domínio próprio
- HTTPS seguro
- Performance otimizada
- Proteção contra ataques

### Próximos Passos

1. Decidir nome do domínio
2. Registrar em Registro.br
3. Configurar Cloudflare
4. Testar e validar
5. Comunicar novo endereço aos usuários

---

## 📚 Recursos Adicionais

### Links Úteis

- **Registro.br:** https://registro.br/
- **Cloudflare:** https://www.cloudflare.com/
- **Let's Encrypt:** https://letsencrypt.org/
- **SSL Labs Test:** https://www.ssllabs.com/ssltest/
- **GTmetrix:** https://gtmetrix.com/

### Documentação do Projeto

- [README.md](./README.md) - Visão geral do projeto
- [IMPLEMENTATION_NOTES.md](./IMPLEMENTATION_NOTES.md) - Notas de implementação
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Guia de migração V1→V2
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Resumo executivo

---

**Documento criado em:** Fevereiro de 2026  
**Última atualização:** Fevereiro de 2026  
**Versão:** 1.0  
**Validade dos preços:** Fevereiro de 2026 (verificar valores atuais na data de implementação)

---

© 2026 BASE250 - Sistema de Gestão de Imóveis

*Este documento fornece estimativas baseadas em preços de mercado em fevereiro de 2026. Os valores podem variar. Sempre verifique os preços atuais nos sites oficiais antes de realizar compras.*
