const commentsRouter = require("express").Router({ mergeParams: true });
const {
  getCommentsByArticle,
  postCommentByArticle,
  deleteCommentById,
  patchComment,
} = require("../controllers/comments");

commentsRouter.route("/").get(getCommentsByArticle).post(postCommentByArticle);

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchComment);

module.exports = commentsRouter;
