const { ended } = require("../db/connection");
const endpoints = require("../endpoints.json");
const {
  selectTopics,
  selectArticle,
  selectArticlesX,
  selectComments,
  addComment,
} = require("./app-model");

function getApi(req, res) {
  res.status(200).send({ endpoints });
}

function getTopics(req, res) {
  res.status(200);
  selectTopics().then((topics) => res.send({ topics }));
}

function getArticle(req, res) {
  res.status(200);
  const articleID = req.params.article_id;
  selectArticle(articleID).then((article) => res.send({ article }));
}

function getArticlesX(req, res) {
  res.status(200);
  selectArticlesX().then((articles) => res.send({ articles }));
}

function getComments(req, res) {
  const articleID = req.params.article_id;
  res.status(200);
  selectComments(articleID).then((comments) => res.send({ comments }));
}

function postComment(req, res) {
  const comment = req.body;
  const articleID = req.params.article_id;
  res.status(201);
  addComment(comment, articleID)
  .then((newComment) => {
    res.send({newComment});
  });
}

module.exports = {
  getApi,
  getTopics,
  getArticle,
  getArticlesX,
  getComments,
  postComment,
};
