const sequelize = require('sequelize');
const db = require('./../database');

const user = db.define('user', {
  id: {
    type: sequelize.INTEGER(10),
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
});

module.exports = user;
