const { ended } = require("../db/connection");
const endpoints = require("../endpoints.json");
const {
  selectTopics,
  selectArticle,
  selectArticlesX,
  selectComments,
  addComment,
  updateArticleVote
} = require("./app-model");

function getApi(req, res) {
  res.status(200).send({ endpoints });
}

function getTopics(req, res) {
  selectTopics().then((topics) => res.status(200).send({ topics }));
}

function getArticle(req, res) {
  const articleID = req.params.article_id;
  selectArticle(articleID).then((article) => res.status(200).send({ article }));
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

function patchArticleVote(req, res){
    const voteValue = req.body.inc_votes
    const articleID = req.params.article_id

    if (!voteValue) res.status(400).send({errorResponse: "Bad Request"})
    if (typeof(voteValue) !== "number") res.status(400).send({errorResponse: "Bad Request"})
    
    else updateArticleVote(voteValue, articleID).then((updatedArticle) => {
        res.status(200).send({updatedArticle})
    })
}

module.exports = {
  getApi,
  getTopics,
  getArticle,
  getArticlesX,
  getComments,
  postComment,
  patchArticleVote
};
