const db = require("../db/connection");

function selectTopics() {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
}

function selectArticle(articleID) {
  return db
    .query(
      `SELECT * FROM articles
        WHERE article_id = ${articleID};`
    )
    .then(({ rows }) => {
      return rows[0]
    });
}

module.exports = { selectTopics, selectArticle };
