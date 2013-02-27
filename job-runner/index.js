var queues = require('../queues');
var store = require('dynostore');;

var express = require('express');
var app = express();
if (!app.push) app.push = function(){};

var throttle = require('throat')(3);

var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

var getConfig = require('../config-loader');
var test = require('sauce-runner');

function source() {
  return queues.jobs.nextMessage({visibilityTimeout: '10 minutes'});
}
var n = 0;
function worker(message) {
  var i = n++;
  var user = message.body.user;
  var repo = message.body.repo;
  var tag = message.body.tag;
  var buildID = message.body.buildID;
  var browser = message.body.browser;
  app.push('/', 'start', message.body);
  console.log('testing %s/%s/%s: %s', user, repo, tag, message.body.browser);
  return store.getRepo(user, repo)
    .then(function (rep) {
      if (rep.currentBuild !== buildID) return message.delete();
      return getConfig(user, repo, tag)
        .then(function (config) {
          return test(browser,
                      'http://jepso-ci.com/api/proxy/' + user + '/' + repo + '/' + tag + config.url,
                      user + '/' + repo + '/' + tag,
                      [],
                      function (b) {
                        message.extendTimeout('10 minutes');
                        store.updateBuild(user, repo, buildID, browser, 'testing ' + b.version, false)
                          .then(function () {
                            app.purge(user, repo, buildID);
                          })
                          .done(null, function (err) { console.warn('Error updating db:' + err); });
                        app.push('/' + user + '/' + repo + '/', 'update', {buildID: buildID, tag: tag, browser: browser, testing: b.version});
                        message.body.version = b.version;
                        app.push('/', 'update', message.body);
                        console.log('testing ' + b.version);
                      });
        })
        .then(function (result) {
          console.log('res %s: %j', browser, result);
          var state = result.passed ? 'passed' : (result.passedVersion ? result.passedVersion + '/' + result.failedVersion : 'failed');
          app.push('/' + user + '/' + repo + '/', 'done', {buildID: buildID, tag: tag, browser: browser, state: state})
          return store.updateBuild(user, repo, buildID, browser, state, true);
        })
        .then(function () {
          app.purge(user, repo, buildID);
          app.purge('all');//only temporary
          return message.delete();
        })
        .then(function () {
          console.log('tested %s/%s/%s: %s', user, repo, tag, message.body.browser);
          app.push('/', 'end', message.body);
        });
    })
    .then(null, function (err) {
      message.body.err = err.message || err;
      app.push('/', 'job error', message.body);
      throw err;
    });
}

setTimeout(function () {
  throttle.workOn(source, worker).done();
}, 15000);//give rest of the app time to get up and running
module.exports = app;