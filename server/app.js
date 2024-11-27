const express = require("express");
const app = express();
const { getApi, getTopics, getArticle, getArticlesX, getComments } = require("./api-controller");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getArticlesX);

app.get("/api/articles/:article_id/comments", getComments)


module.exports = app;
