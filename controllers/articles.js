const {
  updateArticle,
  fetchArticle,
  fetchArticles,
  insertArticle,
} = require("../models/articles");

exports.patchArticle = (req, res, next) => {
  updateArticle(req.params.article_id, req.body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  fetchArticle(req.params.article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then(({ articles, total_count }) => {
      res.status(200).send({ articles, total_count });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  insertArticle(req.body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
