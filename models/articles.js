const db = require("../db/connection");

exports.updateArticle = (article_id, { inc_votes }) => {
  return db
    .query(
      "UPDATE articles SET votes=votes + $1 WHERE article_id= $2 RETURNING *",
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Not found" });
      return rows[0];
    });
};

exports.fetchArticle = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Not found" });
      return rows[0];
    });
};

exports.fetchArticles = () => {
  return db.query(`SELECT * FROM articles`).then(({ rows }) => {
    return rows;
  });
};
