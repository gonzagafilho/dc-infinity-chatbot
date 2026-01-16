function isBusinessHours() {
  const now = new Date();
  const day = now.getDay(); // 0=Dom, 6=Sáb
  const hour = now.getHours();

  if (day === 0 || day === 6) return false;
  if (hour < 8 || hour >= 17) return false;

  return true;
}

const Conversation = require('../models/Conversation');

const GREETINGS = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite'];

async function processMessage(phone, message) {
  let conversation = await Conversation.findOne({ phone });

  if (!conversation) {
    conversation = await Conversation.create({
      phone,
      state: 'MENU',
      messages: []
    });
  }

  const text = message.trim().toLowerCase();

  // salva mensagem do usuário
  conversation.messages.push({ from: 'user', text: message });

  // reconhecer saudação em qualquer estado
  if (GREETINGS.includes(text)) {
    conversation.state = 'MENU';
    const reply = getMenu();
    conversation.messages.push({ from: 'bot', text: reply });
    await conversation.save();
    return reply;
  }

  // opção voltar global
  if (text === '0') {
    conversation.state = 'MENU';
    const reply = getMenu();
    conversation.messages.push({ from: 'bot', text: reply });
    await conversation.save();
    return reply;
  }

  let reply;

  switch (conversation.state) {
    case 'MENU':
      reply = handleMenu(conversation, text);
      break;

    case 'PLANOS':
      reply = handlePlanos(conversation, text);
      break;

    default:
      conversation.state = 'MENU';
      reply = getMenu();
  }

  conversation.messages.push({ from: 'bot', text: reply });
  await conversation.save();
  return reply;
}

function handleMenu(conversation, text) {
  if (text === '1') {
    conversation.state = 'PLANOS';
    return getPlanos();
  }

  if (text === '2') {
    return '🛠️ Suporte técnico em breve.\nDigite 0️⃣ para voltar.';
  }

  if (text === '3') {
    return '💳 Financeiro em breve.\nDigite 0️⃣ para voltar.';
  }

  if (text === '4') {
  if (isBusinessHours()) {
    conversation.waitingHuman = true;
    return '👨‍💼 Um atendente irá te atender em instantes.';
  } else {
    return `
⏰ Nosso atendimento humano funciona:
Segunda a Sexta, das 08h às 17h.

📩 Deixe sua mensagem que responderemos no próximo horário.
`;
  }
}

  if (text === '5') {
    return '📍 Informe seu bairro para verificar cobertura.\nDigite 0️⃣ para voltar.';
  }

  return '❌ Opção inválida.\n\n' + getMenu();
}

function handlePlanos(conversation, text) {
  return `
📶 Planos disponíveis:

1️⃣ 350 Mega – R$ 78,98
2️⃣ 400 Mega – R$ 88,98
3️⃣ 500 Mega – R$ 98,98
4️⃣ 600 Mega – R$ 119,98

Digite 0️⃣ para voltar
`;
}

function getMenu() {
  return `
👋 Olá! Seja bem-vindo à DC INFINITY 🚀

1️⃣ Planos de Internet
2️⃣ Suporte Técnico
3️⃣ Financeiro / Boleto
4️⃣ Falar com atendente
5️⃣ Endereço e cobertura
`;
}

function getPlanos() {
  return `
📶 Nossos planos:

1️⃣ 350 Mega – R$ 78,98
2️⃣ 400 Mega – R$ 88,98
3️⃣ 500 Mega – R$ 98,98
4️⃣ 600 Mega – R$ 119,98

Digite 0️⃣ para voltar
`;
}

module.exports = { processMessage };
