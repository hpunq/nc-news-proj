const { ended } = require("../db/connection");
const endpoints = require("../endpoints.json");
const { selectTopics, selectArticle } = require("./app-model");

function getApi(req, res) {
  res.status(200).send({ endpoints: endpoints });
}

function getTopics(req, res) {
  res.status(200);
  selectTopics().then(topics => res.send({topics}))
}

function getArticle(req, res){
    res.status(200)
    const articleID = req.params.article_id
    selectArticle(articleID)
    .then(article => res.send({article}))
}

module.exports = { getApi, getTopics, getArticle };
