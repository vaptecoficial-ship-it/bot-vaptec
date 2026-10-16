module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(200).send('Bot Vaptec com IA online!');
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
      respostaFinal = 'Olá, <b>' + nome + '</b>! Seja muito bem-vindo(a) à <b>Vaptec</b>! 📱✨\n\n' +
        'Sou o assistente virtual inteligente da loja.\n' +
        'Como posso te ajudar hoje? Pode me perguntar sobre nossos produtos, valores, suporte técnico, endereços ou horários!';
    } else if (chaveGemini && textoCliente) {
      const promptSistema = 'Você é o atendente virtual inteligente da loja VAPTEC, especializada em acessórios para celular, eletrônicos e informática em Goiás.\n' +
        'Informações oficiais da Vaptec:\n' +
        '- Lojas físicas:\n' +
        '  1) Goiânia: Rua VC 37, Qd. 4, Lt. 100 - Conjunto Vera Cruz.\n' +
        '  2) Aragoiânia: Rua Francisco Pereira de Oliveira (ao lado do Hospital Materno Infantil).\n' +
        '- Horário de funcionamento: Segunda a Sexta, das 09:00 às 00:00 (atendimento noturno até meia-noite!). Sábado e domingo fechado.\n' +
        '- WhatsApp oficial para pedidos e suporte: (62) 99463-3261.\n' +
        '- Principais produtos e preços:\n' +
        '  • Fones de ouvido a partir de R$ 15,00.\n' +
        '  • Adaptador Wi-Fi USB por apenas R$ 35,00.\n' +
        '  • Carregadores turbo, cabos reforçados, capinhas de celular, caixas de som bluetooth e periféricos.\n' +
        '- Tom de voz: Muito educado, prestativo, acolhedor, comercial e objetivo. Use emojis com moderação. Chame o cliente pelo primeiro nome quando apropriado (' + nome + '). Responda de forma clara em 1 a 3 parágrafos curtos. Se o cliente relatar problemas técnicos (ex: microfone não funciona, Wi-Fi caindo), dê dicas práticas e sugira os acessórios ou uma visita à loja.\n\n' +
        'Mensagem do cliente: "' + textoCliente + '"';

      try {
        const geminiHost = ['generativelanguage', 'googleapis', 'com'].join('.');
        const geminiUrl = 'https://' + geminiHost + '/v1beta/models/gemini-1.5-flash:generateContent?key=' + chaveGemini;

        const geminiResponse = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptSistema }] }]
          })
        });

        const data = await geminiResponse.json();
        const candList = data ? data['candidates'] : null;
        if (Array.isArray(candList) && candList.length > 0) {
          const primeiro = candList[0];
          const partes = (primeiro && primeiro['content']) ? primeiro['content']['parts'] : null;
          if (Array.isArray(partes) && partes.length > 0) {
            respostaFinal = partes[0]['text'] || '';
          }
        }
      } catch (errAi) {
        console.error('Erro na IA:', errAi);
      }
    }

    if (!respostaFinal) {
      respostaFinal = 'Olá, <b>' + nome + '</b>! A Vaptec está à sua disposição. Atendemos de segunda a sexta até meia-noite (00:00). Nossas lojas ficam em Goiânia e Aragoiânia, e você pode falar direto conosco no WhatsApp: (62) 99463-3261.';
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
          parse_mode: 'HTML'
        })
      });
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Erro geral:', error);
    return res.status(200).send('OK');
  }
};