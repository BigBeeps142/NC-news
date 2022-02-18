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

exports.fetchArticles = ({ sort_by, order, topic, limit }) => {
  //MAIN QUERY
  let queryStr = `SELECT articles.article_id,articles.title,articles.topic,articles.author,articles.votes,articles.created_at,CAST(COUNT(comments.comment_id)AS int) AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id `;
  //SORT_BY
  let sortByStr = `ORDER BY articles.created_at `;
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

  //ORDER
  if (order) {
    if (!["ASC", "DECS"].includes(order)) {
      return Promise.reject({ status: 400, msg: "Invalid query" });
    }
    sortByStr += `${order} `;
  } else {
    sortByStr += `DESC `;
  }
  //TOPIC
  const queryValues = [];
  if (topic) {
    queryStr += `WHERE topic = $1 `;
    queryValues.push(topic);
  }
  //LIMIT
  let limitStr = ";";
  if (limit) {
    limitStr = `LIMIT ${limit};`;
  }

  //DO QUERY
  queryStr += `GROUP BY articles.article_id ` + sortByStr + limitStr;
  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.insertArticle = ({ author, title, body, topic }) => {
  return db
    .query(
      "INSERT INTO articles (author, title, body, topic ) VALUES ($1,$2,$3,$4) RETURNING *,0 AS comment_count;",
      [author, title, body, topic]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
