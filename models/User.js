const sequelize = require('sequelize');
const db = require('./../database');

const user = db.define('user', {
  id: {
    type: sequelize.INTEGER(10),
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: sequelize.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: 'please give a valid name' },
    },
  },
  dob: {
    type: sequelize.DATEONLY,
    allowNull: false,
    validate: {
      notNull: { msg: 'please give a valid birth date' },
    },
  },
  number: {
    type: sequelize.INTEGER(10),
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'please give a valid phone number' },
    },
  },
});

module.exports = user;
