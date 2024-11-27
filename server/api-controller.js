const { ended } = require("../db/connection");
const endpoints = require("../endpoints.json");
const { selectTopics, selectArticle, selectArticlesX } = require("./app-model");

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

module.exports = { getApi, getTopics, getArticle, getArticlesX };
