const express = require("express");
const app = express();
const { getApi, getTopics } = require("./api-controller");

app.get("/api", getApi);

app.get("/api/topics", getTopics)

module.exports = app;
