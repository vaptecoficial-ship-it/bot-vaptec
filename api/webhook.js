module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(200).send('Bot Vaptec online!');
  }

  try {
    const update = req.body;

    if (!update || !update.message || ![link suspeito removido]) {
      return res.status(200).send('OK');
    }

    const chatId = [link suspeito removido];
    const nome = update.message.from ? (update.message.from.first_name || 'Cliente') : 'Cliente';

    let resposta = `Olá, <b>${nome}</b>! Seja muito bem-vindo(a) à <b>Vaptec</b> 📱✨\n\n`;
    resposta += `Aqui você encontra os melhores acessórios para celular, informática e eletrônicos!\n\n`;
    resposta += `🔥 <b>Destaques e Ofertas:</b>\n`;
    resposta += `• Fones de Ouvido: a partir de <b>R$ 15,00</b>\n`;
    resposta += `• Adaptador Wi-Fi USB: apenas <b>R$ 35,00</b>\n`;
    resposta += `• Carregadores turbo, cabos, capinhas e caixas de som\n\n`;
    resposta += `📍 <b>Nossas Lojas Físicas:</b>\n`;
    resposta += `• <b>Goiânia:</b> Rua VC 37, Qd. 4, Lt. 100 - Conjunto Vera Cruz\n`;
    resposta += `• <b>Aragoiânia:</b> Rua Francisco Pereira de Oliveira (ao lado do Hospital Materno Infantil)\n\n`;
    resposta += `⏰ <b>Horário Noturno Diferenciado:</b>\n`;
    resposta += `Segunda a Sexta, das <b>09:00 às 00:00</b> (atendemos até meia-noite!)\n\n`;
    resposta += `💬 <b>Atendimento no WhatsApp:</b> (62) 99463-3261`;

    const token = process.env.TELEGRAM_TOKEN;

    if (token) {
      const telegramUrl = 'https://' + 'api' + '.[link suspeito removido]' + token + '/sendMessage';

      await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: resposta,
          parse_mode: 'HTML'
        })
      });
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no processamento do webhook:', error);
    return res.status(200).send('OK');
  }
};