var pusher = require('./pusher');
var purger = require('./purger');
var express = require('express');
var http = require('http');
//http.globalAgent.maxSockets = 1;
var app = express();
var server = http.createServer(app);

var path = require('path');

var proxy = require('./proxy');
var hook = require('./hook');
var jobMaker = require('./job-maker');
var jobRunner = require('./job-runner');
var repos = require('./repos');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/proxy', proxy);
app.use('/api/hook', hook);
app.use('/api/job-maker', jobMaker);
app.use('/api/job-runner', jobRunner);
app.use('/', repos);

app.configure('development', function(){
  app.use(express.errorHandler());
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
pusher(server, app);