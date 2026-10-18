module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(200).send('Bot Vaptec online!');
  }

  try {
    const update = req.body;
    if (!update || !update['message']) {
      return res.status(200).send('OK');
    }

    const msg = update['message'];
    const chat = msg['chat'];
    if (!chat || !chat['id']) {
      return res.status(200).send('OK');
    }

    const chatId = chat['id'];
    const textoCliente = msg['text'] || '';
    const fromUser = msg['from'] || {};
    const nome = fromUser['first_name'] || 'Cliente';

    const env = process['env'] || {};
    const tokenTelegram = env['TELEGRAM_TOKEN'];
    const chaveGemini = env['GEMINI_API_KEY'];

    let respostaFinal = '';

    if (textoCliente === '/start') {
      respostaFinal = 'Olá, ' + nome + '! Seja muito bem-vindo(a) à Vaptec! 📱✨\n\n' +
        'Como posso te ajudar hoje?\n' +
        '• 📍 *Lojas*: Goiânia (Conjunto Vera Cruz) e Aragoiânia\n' +
        '• ⏰ *Horário*: Segunda a Sexta, das 09h à MEIA-NOITE (00:00)!\n' +
        '• 📡 *Oferta*: Adaptador Wi-Fi USB por apenas R\$ 25,00!\n' +
        '• 🎧 *Fones*: A partir de R\$ 15,00\n' +
        '• 💳 *PIX (Caixa)*: 62994633261 (Fernando Rodrigues Junior)';
    } else if (chaveGemini) {
      const promptSistema = 'Você é o atendente virtual inteligente da loja VAPTEC em Goiás.\n' +
        'Informações oficiais:\n' +
        '- Lojas: Goiânia (Conjunto Vera Cruz, Rua VC 37) e Aragoiânia (Rua Francisco Pereira de Oliveira).\n' +
        '- Horário: Segunda a Sexta das 09:00 às 00:00 (até meia-noite).\n' +
        '- Promoção: Adaptador Wi-Fi USB por R\$ 25,00 (de R\$ 35).\n' +
        '- Fones: a partir de R\$ 15,00. Carregadores turbo, cabos, capinhas.\n' +
        '- WhatsApp: (62) 99463-3261.\n' +
        '- Dados do PIX: Chave (Telefone) 62994633261 | Titular: Fernando Rodrigues Junior | Banco: Caixa Econômica Federal.\n' +
        'Responda a dúvida do cliente ' + nome + ' de forma curta, prestativa e comercial.\n\n' +
        'Mensagem do cliente: "' + textoCliente + '"';

      const modelos = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];
      const geminiHost = ['generativelanguage', 'googleapis', 'com'].join('.');

      for (const modelo of modelos) {
        try {
          const geminiUrl = 'https://' + geminiHost + '/v1beta/models/' + modelo + ':generateContent?key=' + chaveGemini;
          const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptSistema }] }]
            })
          });

          const data = await geminiResponse.json();
          if (data && Array.isArray(data['candidates']) && data['candidates'].length > 0) {
            const cand = data['candidates'];
            if (cand && cand['content'] && Array.isArray(cand['content']['parts'])) {
              for (const part of cand['content']['parts']) {
                if (part && part['text']) {
                  respostaFinal += part['text'];
                }
              }
            }
          }
          if (respostaFinal) break;
        } catch (e) {
          // tenta o proximo modelo
        }
      }
    }

    // Resposta inteligente por assunto caso a IA nao responda
    if (!respostaFinal) {
      const txt = textoCliente.toLowerCase();
      if (txt.includes('pix') || txt.includes('pagar') || txt.includes('pagamento') || txt.includes('comprar') || txt.includes('chave')) {
        respostaFinal = '💳 *Dados para Pagamento via PIX - Vaptec*\n\n' +
          '• *Chave PIX (Telefone)*: `62994633261`\n' +
          '• *Titular*: Fernando Rodrigues Junior\n' +
          '• *Banco*: Caixa Econômica Federal\n' +
          '• *WhatsApp para Comprovante*: (62) 99463-3261\n\n' +
          '📌 *Como finalizar:*\n' +
          '1. Faça o PIX para **62994633261** (Caixa - Fernando Rodrigues Junior).\n' +
          '2. Envie o comprovante no WhatsApp (62) 99463-3261 com o seu nome e produto.\n' +
          '3. Retire na loja de Goiânia ou Aragoiânia!';
      } else if (txt.includes('endereço') || txt.includes('onde') || txt.includes('loja') || txt.includes('fica') || txt.includes('local')) {
        respostaFinal = '📍 *Nossas Lojas Vaptec:*\n' +
          '1) *Goiânia*: Rua VC 37, Qd. 4, Lt. 100 - Conjunto Vera Cruz.\n' +
          '2) *Aragoiânia*: Rua Francisco Pereira de Oliveira (ao lado do Hospital Materno Infantil).\n\n' +
          '⏰ Atendemos de segunda a sexta até MEIA-NOITE (00:00)!';
      } else if (txt.includes('preço') || txt.includes('quanto') || txt.includes('valor') || txt.includes('fone') || txt.includes('wifi') || txt.includes('adaptador')) {
        respostaFinal = '🔥 *Principais Ofertas Vaptec:*\n' +
          '• 📡 *Adaptador Wi-Fi USB*: de R\$ 35 por apenas R\$ 25,00!\n' +
          '• 🎧 *Fones de Ouvido*: a partir de R\$ 15,00\n' +
          '• ⚡ *Carregadores Turbo*, cabos reforçados e caixas de som!\n\n' +
          '💳 *PIX (Caixa)*: 62994633261 (Fernando Rodrigues Junior)';
      } else if (txt.includes('horario') || txt.includes('aberto') || txt.includes('fecha') || txt.includes('noite') || txt.includes('hora')) {
        respostaFinal = '⏰ *Horário de Funcionamento Vaptec:*\n' +
          'Segunda a Sexta: das 09:00 às 00:00 (Atendimento noturno até meia-noite!).\n' +
          'Sábado e Domingo: Fechado.';
      } else {
        respostaFinal = 'Olá, ' + nome + '! Seja bem-vindo(a) à Vaptec! 📱✨\n\n' +
          'Como posso te ajudar?\n' +
          '• Para ver endereços, digite: *onde fica a loja?*\n' +
          '• Para ver preços e ofertas, digite: *quais os valores?*\n' +
          '• Para ver a chave PIX, digite: *qual o pix?*\n' +
          '• WhatsApp / PIX: (62) 99463-3261\n' +
          '• Ficamos abertos hoje até MEIA-NOITE (00:00)!';
      }
    }

    if (tokenTelegram) {
      const tgHost = ['api', 'telegram', 'org'].join('.');
      const tgUrl = 'https://' + tgHost + '/bot' + tokenTelegram + '/sendMessage';

      await fetch(tgUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: respostaFinal,
          parse_mode: 'Markdown'
        })
      });
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Erro geral:', error);
    return res.status(200).send('OK');
  }
};