var express = require('express');
var app = express();
var dynostore = require('dynostore');
var badge = require('test-results-badge').jepsoBadge;
var join = require('path').join;

function getBuild(user, repo) {
  return dynostore.getRepo(user, repo)
    .then(function (res) {
      var inProgress = res.currentBuild;
      var completed = res.latestBuild;
      return dynostore.getBuild(user, repo, completed || inProgress);
    })
}

app.purge('/:user/:repo.json');
app.get('/:user/:repo.json', function (req, res, next) {
  var user = req.params.user;
  var repo = req.params.repo;
  dynostore.getRepo(user, repo)
    .then(function (repo) {
      var currentBuild = repo.currentBuild;
      var latestBuild = repo.latestBuild;
      res.json({currentBuild: currentBuild, latestBuild: latestBuild});
    })
    .done(null, next);
});

app.purge('/:user/:repo/:build.json');
app.get('/:user/:repo/:build.json', function (req, res, next) {
  var user = req.params.user;
  var repo = req.params.repo;
  var build = req.params.build;
  dynostore.getBuild(user, repo, build)
    .then(function (build) {
      res.json(build);
    })
    .done(null, next);
});

app.purge('/:user/:repo.svg');
app.get('/:user/:repo.svg', function (req, res, next) {
  var user = req.params.user;
  var repo = req.params.repo;
  getBuild(user, repo)
    .then(function (build) {
      res.set('Content-Type', 'image/svg+xml');
      res.send(badge(build));
    })
    .done(null, next);
});

app.purge('/:user/:repo/current.svg');
app.get('/:user/:repo/current.svg', function (req, res, next) {
  var user = req.params.user;
  var repo = req.params.repo;
  dynostore.getRepo(user, repo)
    .then(function (res) {
      var currentBuild = res.currentBuild;
      return dynostore.getBuild(user, repo, currentBuild);
    })
    .then(function (build) {
      res.set('Content-Type', 'image/svg+xml');
      res.send(badge(build));
    })
    .done(null, next);
});

app.purge('/:user/:repo/:build.svg');
app.get('/:user/:repo/:build.svg', function (req, res, next) {
  var user = req.params.user;
  var repo = req.params.repo;
  var build = req.params.build;
  dynostore.getBuild(user, repo, build)
    .then(function (build) {
      res.set('Content-Type', 'image/svg+xml');
      res.send(badge(build));
    })
    .done(null, next);
});

app.get('/:user/:repo', function (req, res, next) {
  res.sendfile(join(__dirname, 'public', 'index.html'));
  /*
  var user = req.params.user;
  var repo = req.params.repo;
  dynostore.getRepo(user, repo)
    .then(function (repo) {
      var currentBuild = repo.currentBuild;
      var latestBuild = repo.latestBuild;
      res.json({currentBuild: currentBuild, latestBuild: latestBuild});
    })
    .done(null, next);
  */
});


module.exports = app;