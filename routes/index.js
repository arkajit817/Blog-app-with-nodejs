var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost:27017/nodeblog');

/* GET home page and display blog posts. */
router.get('/',ensureAuthenticated, function(req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({}, {}, function(err, posts) {
    res.render('index', {
      "posts": posts
    });
  });
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
