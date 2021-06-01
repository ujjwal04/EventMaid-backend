const mongoose = require('mongoose');
const DateOnly = require('mongoose-dateonly')(mongoose);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name required for user'],
    },
    dob: {
      type: Date,
      required: [true, 'DOB required for user'],
    },
    number: {
      type: Number,
      required: [true, 'Number required for user'],
      unique: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('user', userSchema);

module.exports = User;
