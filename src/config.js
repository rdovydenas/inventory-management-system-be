require("dotenv").config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  mysqlConfig: {
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
  },
};
