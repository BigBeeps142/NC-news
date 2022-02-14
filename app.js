const express = require("express");
const { patchArticle } = require("./controllers/aritcles");
const { getTopics } = require("./controllers/topics");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.patch("/api/articles/:article_id", patchArticle);
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});
module.exports = app;
