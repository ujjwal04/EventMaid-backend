const mongoose = require('mongoose');

const verifiedNumberSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: [true, 'Number required for user'],
      unique: true,
    },
  },
  { timestamps: true }
);

const VerifiedNumber = mongoose.model('verified_number', verifiedNumberSchema);

module.exports = VerifiedNumber;
