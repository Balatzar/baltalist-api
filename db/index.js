const { Pool } = require("pg");
console.log(process.env.DATABASE_URL);
const connectionString = process.env.DATABASE_URL;
const pool = new Pool(
  connectionString
    ? { connectionString: connectionString }
    : { database: "baltalist" }
);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
