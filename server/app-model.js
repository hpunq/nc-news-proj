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
        WHERE article_id = $1;`,
      [articleID]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          errorResponse: "Article does not exist",
        });
      }
      return rows[0];
    });
}

function selectArticlesX() {
  return db
    .query(
      `SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles
        ORDER BY created_at DESC;
        
        SELECT article_id FROM COMMENTS;`
    )
    .then((response) => {
      const articleQuery = response[0].rows;
      const commentQuery = response[1].rows;

      const articles = articleQuery.map((article) => {
        const matchComment = commentQuery.filter(
          (comment) => comment.article_id === article.article_id
        );
        article.comment_count = matchComment.length;
        return article;
      });
      return articles;
    });
}

function selectComments(articleID) {
  return db
    .query(
      `
        SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`,
      [articleID]
    )
    .then(({ rows }) => {
      return rows;
    });
}

function addComment(comment, articleID) {
  return db
    .query(
      `
        INSERT INTO comments(author, body, article_id)
        VALUES ($1, $2, $3)
        RETURNING *;`,
      [comment.username, comment.body, articleID]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function updateArticleVote(voteValue, articleID) {
  return db
    .query(
      `UPDATE articles
        SET
        votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
        `,
      [voteValue, articleID]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          errorResponse: "Article does not exist",
        });
      }
      return rows[0];
    });
}

function removeCommentById(commentID) {
  return db
    .query(
      `DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
    `,
      [commentID]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          errorResponse: "Comment not found",
        });
      }
    });
}

function updateCommentVote(voteValue, commentID) {
  return db
    .query(
      `UPDATE comments
    SET
    votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;
    `,
      [voteValue, commentID]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          errorResponse: "Comment does not exist",
        });
      }
      console.log(rows)
      return rows[0];
    });
}

module.exports = {
  selectTopics,
  selectArticle,
  selectArticlesX,
  selectComments,
  addComment,
  updateArticleVote,
  removeCommentById,
  updateCommentVote,
};
