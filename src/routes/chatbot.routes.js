const express = require('express');
const { processMessage } = require('../services/chatbot.service');

const router = express.Router();

router.post('/message', async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: 'phone e message são obrigatórios' });
  }

  const response = await processMessage(phone, message);

  res.json({ reply: response });
});

module.exports = router;
