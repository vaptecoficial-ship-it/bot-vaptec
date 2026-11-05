export default function handler(req, res) {
  // 1. Validação do Webhook pelo Meta (GET)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Verifica se o token bate com o configurado
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      return res.status(200).send(challenge);
    } else {
      return res.status(403).end();
    }
  }

  // 2. Recebimento de mensagens dos clientes (POST)
  if (req.method === 'POST') {
    const body = req.body;
    console.log('Mensagem recebida:', JSON.stringify(body, null, 2));
    
    // Aqui roda a lógica do bot Vaptec / Gemini
    return res.status(200).send('EVENT_RECEIVED');
  }

  return res.status(405).end();
}
