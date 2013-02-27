var queues = require('../queues');
var store = require('dynostore');
var browsers = require('test-platforms');

var express = require('express');
var app = express();

var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

var getConfig = require('../config-loader');

function run(err) {
  app.push('/', 'polling for message');
  queues.builds.nextMessage()
    .then(function (message) {
      app.push('/', 'getting config', message.body);
      var user = message.body.user;
      var repo = message.body.repo;
      var tag = message.body.tag;
      return getConfig(user, repo, tag)
        .then(null, function (err) {
          if (!err.transient) {
            return message.delete().then(function () {
              throw err;
            });
          } else {
            err.message += ' (will retry)';
            throw err;
          }
        })
        .then(function () {
          app.push('/', 'creating build', message.body);
          return store.createBuild(user, repo, tag, Object.keys(browsers))
        })
        .then(function (buildID) {
          message.body.buildID = buildID;
          app.purge(user, repo, buildID);
          app.purge('all');//only temporary
          app.push('/', 'adding jobs', message.body);
          var result;
          Object.keys(browsers)
            .forEach(function (browser) {
              var prom = queues.jobs.send({user: user, repo: repo, tag: tag, buildID: buildID, browser: browser});
              if (result)
                result = result.then(function () { return prom; })
              else
                result = prom;
            });
        })
        .then(function () {
          return message.delete();
        })
        .then(function () {
          app.push('/', 'build queued', message.body);
        }, function (err) {
          console.error(err.message || err);
          message.body.err = err.message || err.toString();
          app.push('/', 'error', message.body);
        })
    })
    .then(null, function(err) {
      console.error(err.message || err);
      app.push('/', 'error reading queue', err.message || err);
    })
    .done(run);
}
setTimeout(run, 15000);//give rest of the app time to get up and running
module.exports = app;