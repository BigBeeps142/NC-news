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
    .query(
      `SELECT articles.* ,COUNT(comments.comment_id) AS comment_count FROM articles
    JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Not found" });
      return rows[0];
    });
};

exports.fetchArticles = ({ sort_by }) => {
  let queryStr = `SELECT articles.* ,CAST(COUNT(comments.comment_id)AS int) AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id `;
  let sortByStr = `ORDER BY created_at `;
  if (sort_by) {
    if (
      !["title", "article_id", "topic", "author", "body", "votes"].includes(
        sort_by
      )
    ) {
      return Promise.reject({ status: 400, msg: "Invalid query" });
    }
    sortByStr = `ORDER BY ${sort_by} `;
  }
  sortByStr += `DESC;`;

  queryStr += sortByStr;
  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};
