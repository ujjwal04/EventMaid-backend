const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Sender of the conversation is required'],
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Receiver of the conversation is required'],
    },
    messages: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'chat',
        },
      ],
      default: [],
      required: [true, 'Messages Array is required for conversations'],
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model('conversation', conversationSchema);

module.exports = Conversation;
