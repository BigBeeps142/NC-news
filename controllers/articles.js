const {
  updateArticle,
  fetchArticle,
  fetchArticles,
  insertArticle,
} = require("../models/articles");
const { checkExists } = require("../utils/utils");

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
  Promise.all([
    fetchArticles(req.query),
    req.query.topic ? checkExists("topics", "slug", req.query.topic) : "",
  ])
    .then(([{ articles, total_count }]) => {
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
