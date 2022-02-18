const db = require("../db/connection");

exports.fetchCommentsByArticle = (articleId, { limit = 10, p }) => {
  let queryStr = `SELECT * FROM comments WHERE article_id=$1 `;
  //LIMIT
  if (limit) {
    if (!/\d/.test(limit)) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
    queryStr += `LIMIT ${limit} `;
  }
  //PAGE
  if (p) {
    queryStr += `OFFSET ${(p - 1) * limit} `;
  }
  return db.query(queryStr, [articleId]).then(({ rows }) => {
    return rows;
  });
};

exports.insertCommentByArticle = (articleId, { username, body }) => {
  if (typeof body !== "string") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const queryStr = `INSERT INTO comments (body,author,article_id)
  VALUES ($1 ,$2 ,$3 ) RETURNING *`;

  return db.query(queryStr, [body, username, articleId]).then(({ rows }) => {
    return rows[0];
  });
};

exports.removeComment = (commentId) => {
  return db.query("DELETE FROM comments WHERE comment_id=$1", [commentId]);
};

exports.updateComment = (commentId, { inc_votes }) => {
  return db
    .query(
      "UPDATE comments SET votes=votes+ $1 WHERE comment_id=$2 RETURNING *",
      [inc_votes, commentId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
