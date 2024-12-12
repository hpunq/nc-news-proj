const express = require("express");
const app = express();
const { getApi, getTopics, getArticle, getArticlesX, getComments, postComment, patchArticleVote, deleteArticleComment } = require("./api-controller");
app.use(express.json())

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getArticlesX);

app.get("/api/articles/:article_id/comments", getComments)

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id", patchArticleVote)

app.delete("/api/comments/:comment_id", deleteArticleComment)

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({errorResponse: "Bad Request"})
    }
    else next(err)
})

app.use((err, req, res, next) => {
    if (err.status){
        res.status(err.status).send({errorResponse: err.errorResponse})
    }
    else next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send({errorResponse: "Internal server error"})
})

module.exports = app;
