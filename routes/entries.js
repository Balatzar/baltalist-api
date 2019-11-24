const Router = require("express-promise-router");
const db = require("../db");

const router = new Router();

module.exports = router;

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { checked } = req.body;
  const {
    rows,
  } = await db.query("UPDATE entries SET checked = $1 WHERE id = $2", [
    checked,
    id,
  ]);
  res.send(rows);
});

router.post("/", async (req, res) => {
  const { list_id, text } = req.body;
  try {
    const {
      rows,
    } = await db.query(
      "INSERT INTO entries (list_id, text, created_at) VALUES ($1, $2, NOW()) RETURNING id as entries_id, text, checked",
      [list_id, text]
    );
    res.send(rows);
  } catch (error) {
    res.status(400).send(error.toString());
  }
});
