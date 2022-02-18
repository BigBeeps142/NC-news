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
    fetchCommentsByArticle(articleId),
    checkExists("articles", "article_id", articleId),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
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
  updateComment(commentId, req.body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
