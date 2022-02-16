const db = require("../db/connection");

exports.fetchCommentsByArticle = (articleId) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id=$1`, [articleId])
    .then(({ rows }) => {
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
