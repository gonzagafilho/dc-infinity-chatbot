const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    from: { type: String, enum: ['user', 'bot'] },
    text: String,
    date: { type: Date, default: Date.now }
  },
  { _id: false }
);

const ConversationSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    state: { type: String, default: 'MENU' },
    messages: [MessageSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', ConversationSchema);
