const { ended } = require("../db/connection");
const endpoints = require("../endpoints.json");
const {
  selectTopics,
  selectArticle,
  selectArticlesX,
  selectComments,
  addComment,
  updateArticleVote,
  removeCommentById,
  updateCommentVote
} = require("./app-model");

function getApi(req, res) {
  res.status(200).send({ endpoints });
}

function getTopics(req, res, next) {
  selectTopics()
    .then((topics) => res.status(200).send({ topics }))
    .catch((err) => {
      next(err);
    });
}

function getArticle(req, res, next) {
  const articleID = req.params.article_id;
  selectArticle(articleID)
    .then((article) => res.status(200).send({ article }))
    .catch((err) => {
      next(err);
    });
}

function getArticlesX(req, res) {
  selectArticlesX().then((articles) => res.status(200).send({ articles }));
}

function getComments(req, res) {
  const articleID = req.params.article_id;

  selectComments(articleID).then((comments) =>
    res.status(200).send({ comments })
  );
}

function postComment(req, res) {
  const comment = req.body;
  const articleID = req.params.article_id;
  addComment(comment, articleID).then((newComment) => {
    res.status(201).send({ newComment });
  });
}

function patchArticleVote(req, res, next) {
  const voteValue = req.body.inc_votes;
  const articleID = req.params.article_id;

  if (!voteValue) res.status(400).send({ errorResponse: "Bad Request" });
  if (typeof voteValue !== "number")
    res.status(400).send({ errorResponse: "Bad Request" });
  else
    updateArticleVote(voteValue, articleID)
      .then((updatedArticle) => {
        res.status(200).send({ updatedArticle });
      })
      .catch((err) => {
        next(err);
      });
}

function deleteArticleComment(req, res, next) {
  const commentID = req.params.comment_id;
  removeCommentById(commentID)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
}

function patchCommentVote(req, res, next) {
  const voteValue = req.body.inc_votes;
  const commentID = req.params.comment_id;

  updateCommentVote(voteValue, commentID)
    .then((updatedComment) => {
      res.status(200).send({ updatedComment });
    })
    .catch((err) => {
      next(err);
    });
}

// all controllers require .catch containing next

module.exports = {
  getApi,
  getTopics,
  getArticle,
  getArticlesX,
  getComments,
  postComment,
  patchArticleVote,
  deleteArticleComment,
  patchCommentVote,
};
