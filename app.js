const express = require("express");



const { getArticleById,patchArticle  } = require("./controllers/articles");
const {
  handle500s,
  handlePsqlErrors,
  handleNonPsqlErrors,
} = require("./controllers/errors");
const { getTopics } = require("./controllers/topics");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticle);
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handlePsqlErrors);
app.use(handleNonPsqlErrors);
app.use(handle500s);
module.exports = app;
