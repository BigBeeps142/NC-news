const db = require("../db/connection");

exports.fetchCommentsByArticle = (articleId) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id=$1`, [articleId])
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentByArticle = (articleId, { username, body }) => {
  const queryStr = `INSERT INTO comments (body,votes,author,article_id)
  VALUES ($1 ,$2 ,$3 ,$4) RETURNING *`;

  return db.query(queryStr, [body, 0, username, articleId]).then(({ rows }) => {
    return rows[0];
  });
};
