require('dotenv').config();
const {
  Sequelize
} = require('sequelize');



const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false,

})

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.user = require("./models/user.model")(sequelize, Sequelize);
db.book = require("./models/book.model")(sequelize, Sequelize);




module.exports = db;