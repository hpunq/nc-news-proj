const { ended } = require("../db/connection");
const endpoints = require("../endpoints.json");
const {
  selectTopics,
  selectArticle,
  selectArticlesX,
  selectComments,
} = require("./app-model");

function getApi(req, res) {
  res.status(200).send({ endpoints: endpoints });
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

module.exports = { getApi, getTopics, getArticle, getArticlesX, getComments };
