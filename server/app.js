const express = require("express");
const app = express();
const { getApi, getTopics, getArticle, getArticlesX, getComments, postComment, patchArticleVote } = require("./api-controller");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getArticlesX);

app.get("/api/articles/:article_id/comments", getComments)

app.use(express.json())

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id", patchArticleVote)

module.exports = app;
