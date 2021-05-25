const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Sender of the conversation is required'],
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Receiver of the conversation is required'],
    },
    messages: {
      type: Array,
      default: [],
      required: [true, 'Messages Array is required for conversations'],
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model('conversation', conversationSchema);

module.exports = Conversation;
