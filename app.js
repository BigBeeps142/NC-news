const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes/api");

const {
  handle500s,
  handleNonPsqlErrors,
  handlePsqlErrors,
} = require("./controllers/errors");
const app = express();
app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handlePsqlErrors);
app.use(handleNonPsqlErrors);
app.use(handle500s);
module.exports = app;
