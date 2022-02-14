const express = require("express");
const { getArticleById } = require("./controllers/articles");
const { handle500s, handlePsqlErrors } = require("./controllers/errors");
const { getTopics } = require("./controllers/topics");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handlePsqlErrors);
app.use(handle500s);
module.exports = app;
