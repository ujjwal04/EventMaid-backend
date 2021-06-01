const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    data: {
      type: String,
      required: [true, 'Chat must have some data'],
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model('chat', conversationSchema);

module.exports = Conversation;
