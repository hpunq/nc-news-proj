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
      return rows[0];
    });
}

function selectArticlesX() {
  return db
    .query(
      `SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles
        ORDER BY created_at DESC;
        
        SELECT * FROM COMMENTS;`
    )
    .then((response) => {
      const articleQuery = response[0].rows;
      const commentQuery = response[1].rows;

    const articles = articleQuery.map((article => {
        const matchComment = commentQuery.filter((comment) => comment.article_id === article.article_id)
        article.comment_count = matchComment.length
        return article
    }))
    return articles
    });
}

module.exports = { selectTopics, selectArticle, selectArticlesX };
