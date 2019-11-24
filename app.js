const express = require("express");
const corser = require("corser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mountRoutes = require("./routes");
const app = express();
const port = process.env.PORT || 3000;

app.use(
  corser.create({
    methods: corser.simpleMethods.concat(["PUT", "DELETE"]),
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("tiny"));

mountRoutes(app);

app.get("/", (_req, res) => res.send("Connected"));

app.listen(port, () => console.log(`baltalist api listening on port ${port}`));
