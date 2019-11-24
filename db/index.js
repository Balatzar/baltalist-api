const { Pool } = require("pg");
const pool = new Pool({ database: "baltalist" });
module.exports = {
  query: (text, params) => pool.query(text, params),
};
