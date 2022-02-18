const articlesRouter = require("express").Router();
const commentsRouter = require("./comments");
const {
  getArticleById,
  patchArticle,
  getArticles,
  postArticle,
} = require("../controllers/articles");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter.use("/:article_id/comments", commentsRouter);

module.exports = articlesRouter;
