const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new Pool(
  connectionString ? connectionString : { database: "baltalist" }
);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
