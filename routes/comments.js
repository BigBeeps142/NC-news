const commentsRouter = require("express").Router();
const {
  getCommentsByArticle,
  postCommentByArticle,
  deleteCommentById,
} = require("./controllers/comments");

commentsRouter.route("/").get(getCommentsByArticle).post(postCommentByArticle);

commentsRouter.route("/:comment_id").delete(deleteCommentById);

module.exports = commentsRouter;
