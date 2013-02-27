var path = require('path');
var proxy = require('github-proxy');
var express = require('express');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
  var status = null;
  var oldEnd = res.end;
  var timeout;
  var done = false;
  timeout = setTimeout(function () {
    done = true;
    console.error('request timed out... ' + req.method + ': ' + req.path);
    app.push('/', 'request', {method: req.method, status: 504, path: req.path});//gateway timeout
  }, 60000);
  res.end = function () {
    clearTimeout(timeout);
    oldEnd.apply(this, arguments);
    if (!done) app.push('/', 'request', {method: req.method, status: res.statusCode, path: req.path});
  };
  next();
  //app.push('/', 'request', {method: req.method, path: req.path})
});

app.use(proxy.componentBuild);
app.use(proxy.transformContentType);

module.exports = app;