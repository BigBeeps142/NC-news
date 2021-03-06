const {
  fetchCommentsByArticle,
  insertCommentByArticle,
  removeComment,
  updateComment,
} = require("../models/comments");
const { checkExists } = require("../utils/utils");

exports.getCommentsByArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  Promise.all([
    fetchCommentsByArticle(articleId, req.query),
    checkExists("articles", "article_id", articleId),
  ])
    .then(([{ comments, total_count }]) => {
      res.status(200).send({ comments, total_count });
    })
    .catch(next);
};
exports.postCommentByArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  Promise.all([
    insertCommentByArticle(articleId, req.body),
    checkExists("users", "username", req.body.username),
  ])
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
exports.deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;
  Promise.all([
    removeComment(commentId),
    checkExists("comments", "comment_id", commentId),
  ])
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
exports.patchComment = (req, res, next) => {
  const commentId = req.params.comment_id;
  Promise.all([
    updateComment(commentId, req.body),
    checkExists("comments", "comment_id", commentId),
  ])
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
