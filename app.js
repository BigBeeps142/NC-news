const express = require("express");
const apiRouter = require("./routes/api");

const {
  handle500s,
  handleNonPsqlErrors,
  handlePsqlErrors,
} = require("./controllers/errors");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);
// //API
// app.get("/api", getEndpoints);

// //TOPICS
// app.get("/api/topics", getTopics);

// //ARTICLES
// app.get("/api/articles", getArticles);
// app.get("/api/articles/:article_id", getArticleById);
// app.patch("/api/articles/:article_id", patchArticle);

// //USERS
// app.get("/api/users", getUsers);

// //COMMENTS
// app.get("/api/articles/:article_id/comments", getCommentsByArticle);
// app.post("/api/articles/:article_id/comments", postCommentByArticle);
// app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handlePsqlErrors);
app.use(handleNonPsqlErrors);
app.use(handle500s);
module.exports = app;
