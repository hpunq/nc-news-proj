const { ended } = require("../db/connection");
const endpoints = require("../endpoints.json");
const { selectTopics } = require("./app-model");

function getApi(req, res) {
  res.status(200).send({ endpoints: endpoints });
}

function getTopics(req, res) {
  res.status(200);
  selectTopics().then(topics => res.send({topics: topics}))
}

module.exports = { getApi, getTopics };
