const articlesRouter = require("express").Router();
const commentsRouter = require("./comments");
const {
  getArticleById,
  patchArticle,
  getArticles,
} = require("../controllers/articles");

articlesRouter.route("/").get(getArticles);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter.use("/:article_id/comments", commentsRouter);

module.exports = articlesRouter;
