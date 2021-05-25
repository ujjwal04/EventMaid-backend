// const sequelize = require('sequelize');

// const db = new sequelize({
//   dialect: 'mysql',
//   database: process.env.db,
//   host: process.env.host,
//   username: process.env.user,
//   password: process.env.password,
//   define: { charset: 'utf8mb4', dialectOptions: { collate: 'utf8mb4_bin' } },
// });

// db.sync()
//   .then(() => {
//     console.log('DB connection successful!!');
//   })
//   .catch((err) => console.log(err));

// module.exports = db;

const mongoose = require('mongoose');

const DB = process.env.DB.replace('<password>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => console.log('DB connection successful !!'))
  .catch((err) => console.log('DB Connection error !!'));
