console.log("populating db");
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new Pool(
  connectionString
    ? { connectionString: connectionString }
    : { database: "baltalist" }
);

(async () => {
  // note: we don't try/catch this because if connecting throws an exception
  // we don't need to dispose of the client (it will be undefined)
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const createTables = `
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      ${
        process.env.NODE_ENV === "production"
          ? ""
          : "DROP TABLE IF EXISTS users CASCADE;"
      }
      CREATE TABLE ${
        process.env.NODE_ENV === "production" ? "IF EXISTS " : ""
      }users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ
      );
      ${
        process.env.NODE_ENV === "production"
          ? ""
          : "DROP TABLE IF EXISTS lists CASCADE;"
      }
      CREATE TABLE ${
        process.env.NODE_ENV === "production" ? "IF EXISTS " : ""
      }lists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR (50) NOT NULL CHECK (LENGTH(name) >= 1),
        user_id UUID,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
      ${
        process.env.NODE_ENV === "production"
          ? ""
          : "DROP TABLE IF EXISTS entries CASCADE;"
      }
      CREATE TABLE ${
        process.env.NODE_ENV === "production" ? "IF EXISTS " : ""
      }entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        text VARCHAR (500),
        checked BOOLEAN NOT NULL DEFAULT false,
        list_id UUID NOT NULL,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ,
        FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE
      )
    `;
    // create our table
    await client.query(createTables);

    await client.query("INSERT INTO users(created_at) VALUES(NOW())");
    const { rows: userRows } = await client.query("SELECT * FROM users");
    console.log("users");
    console.log(userRows);

    const queryLists = {
      text:
        "INSERT INTO lists(name, user_id, created_at) VALUES($1, $2, NOW())",
      values: ["Courses", userRows[userRows.length - 1].id],
    };
    await client.query(queryLists);
    const { rows: listRows } = await client.query("SELECT * FROM lists");
    console.log("lists");
    console.log(listRows);

    const listId = listRows[listRows.length - 1].id;
    const queryEntries = {
      text:
        "INSERT INTO entries(text, list_id, created_at) VALUES ($1, $2, NOW()), ($3, $4, NOW()), ($5, $6, NOW()), ($7, $8, NOW())",
      values: ["Chips", listId, "Oeufs", listId, "Pates", listId, "PQ", listId],
    };
    await client.query(queryEntries);
    const { rows: entryRows } = await client.query("SELECT * FROM entries");
    console.log("entries");
    console.log(entryRows);

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
})().catch(e => console.error(e.stack));
