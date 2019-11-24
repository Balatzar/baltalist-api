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
