const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  deleteCommentWithId,
  updateCommentById,
} = require("../models/comments.model");
const { selectArticleById } = require("../models/articles.model");
const { checkUser } = require("../models/users.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const pendingArticle = selectArticleById(article_id);
  const pendingComments = selectCommentsByArticleId(article_id);

  Promise.all([pendingComments, pendingArticle])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;

  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad Request!!" });
  }

  const pendingUserCheck = checkUser(username);
  const pendingArticleIdCheck = selectArticleById(article_id);

  Promise.all([pendingUserCheck, pendingArticleIdCheck])
    .then(() => {
      return insertCommentByArticleId(article_id, body).then((comment) => {
        res.status(201).send({ comment });
      });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  return deleteCommentWithId(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Bad Request!!" });
  }

  return updateCommentById(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
