const { fetchCommentsByArticle } = require("../models/comments");

exports.getCommentsByArticle = (req, res, next) => {
  fetchCommentsByArticle(req.params.article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
