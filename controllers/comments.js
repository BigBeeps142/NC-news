const { fetchCommentsByArticle } = require("../models/comments");
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
