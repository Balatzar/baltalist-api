const lists = require("./lists");
const entries = require("./entries");

module.exports = app => {
  app.use("/lists", lists);
  app.use("/entries", entries);
};
