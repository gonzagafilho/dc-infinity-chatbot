const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor do chatbot DC rodando'
  });
});

module.exports = app;
