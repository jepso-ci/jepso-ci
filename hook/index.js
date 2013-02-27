var path = require('path');
var buildQueue = require('../queues').builds;
var express = require('express');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
app.post('/', function (req, res, next) {
  var payload = JSON.parse(req.body.payload); // see https://help.github.com/articles/post-receive-hooks
  var user = payload.repository.owner.name;
  var repo = payload.repository.name;
  var tag = payload.after;
  hook(user, repo, tag, res, next);
});

app.get('/:user/:repo/:tag', function (req, res, next) {
  var user = req.params.user;
  var repo = req.params.repo;
  var tag = req.params.tag;
  hook(user, repo, tag, res, next);
});


function hook(user, repo, tag, res, next) {
  buildQueue
    .send({user: user, repo: repo, tag: tag})
    .done(function () {
      res.send('build queued: {user: ' + user + ', repo: ' + repo + ', tag: ' + tag + '}');
      app.push('/', 'queued', {user: user, repo: repo, tag: tag});
    }, function (err) {
      app.push('/', 'err', {user: user, repo: repo, tag: tag, err: err.message || err.toString()});
      res.send(500, err.message || err);
    });
}

app.use(function (req, res, next) {
  app.push('/', '404', app.route.replace(/\/$/, '') + req.path);
  next();
});
app.use(function (err, req, res, next) {
  app.push('/', '500', err.message || err);
  next(err);
});
module.exports = app;