const fetch = require('node-fetch');

// Token que o @BotFather te entregou no Telegram
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { message } = req.body;

    if (message && message.text) {
      const chatId = [link suspeito removido];
      const text = message.text.toLowerCase();
      let reply = "Olá! Seja bem-vindo à Vaptec! 📱✨\n\nComo podemos te ajudar hoje?\n1 - Ver Produtos e Preços\n2 - Nossos Endereços e Horários\n3 - Falar com o Fernando no WhatsApp";

      if (text.includes('1') || text.includes('produto') || text.includes('preço')) {
        reply = "🛍️ *Destaques Vaptec:*\n\n• Headsets/Fones: a partir de R\$ 15,00\n• Caixinha de Som: R\$ 35,00\n• Adaptador Wi-Fi USB: R\$ 35,00\n• Cabos reforçados e Carregadores Turbo\n• Perfumes de Alta Qualidade\n\nPeça direto no WhatsApp: (62) 99463-3261";
      } else if (text.includes('2') || text.includes('endereço') || text.includes('onde')) {
        reply = "📍 *Unidades Vaptec:*\n\n1️⃣ *Goiânia:* Rua VC 37, Qd. 4, Lt. 100 - Conjunto Vera Cruz\n2️⃣ *Aragoiânia:* Rua Francisco Pereira de Oliveira (ao lado do Hospital Materno Infantil)\n\n🕒 *Horário:* Segunda a Sexta, das 09:00 às 00:00 (Aberto até meia-noite!)";
      } else if (text.includes('3') || text.includes('whatsapp') || text.includes('contato')) {
        reply = "💬 Fale direto com o Fernando pelo WhatsApp:\n[link suspeito removido]: (62) 99463-3261";
      }

      // Envia a resposta de volta ao Telegram
      await fetch(`[suspicious link removed]{TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: reply,
          parse_mode: 'Markdown'
        })
      });
    }

    return res.status(200).send('OK');
  }

  return res.status(200).send('Bot Vaptec Online!');
};