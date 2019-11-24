const Router = require("express-promise-router");
const db = require("../db");

const router = new Router();

module.exports = router;

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    rows,
  } = await db.query(
    "SELECT *, entries.id as entries_id FROM lists INNER JOIN entries ON entries.list_id = lists.id WHERE lists.id = $1",
    [id]
  );
  res.send(rows);
});

router.get("/", async (_req, res) => {
  const { rows } = await db.query("SELECT * FROM lists");
  res.send(rows);
});

router.post("/", async (req, res, next) => {
  const { name } = req.body;
  try {
    const {
      rows,
    } = await db.query(
      "INSERT INTO lists (name, created_at) VALUES ($1, NOW()) RETURNING id, name",
      [name]
    );
    res.send(rows);
  } catch (error) {
    res.status(400).send(error.toString());
  }
});
