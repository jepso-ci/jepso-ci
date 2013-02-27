var express = require('express');
var socket = require('socket.io');
var debug = require('debug')('socket');

express.application.push = function (room, name, data) {
  var app = this;
  var io = app['socket-io'];
  while (app.parent && !io) {
    app = app.parent;
    io = app['socket-io'];
  }
  if (!io) {
    throw new Error('You must connect push to a server instance before you can push');
  }
  if (room === '' || room[0] === '/') 
    room = this.route + room.replace(/\/$/, '');//remove trailing `/`
  else if (room[0] === '~')
    room = room.substring(1).replace(/\/$/, '');//remove trailing `/`
  else
    throw new Error('Push path must start with "/" or "~/"');
  if (room === '') room = '/';
  io.sockets.in(room).emit(name, data);
};

module.exports = listen;
function listen(server, app) {
  var io = socket.listen(server, {'logger': logger});
  io.configure('production', function () {
    io.enable('browser client minification');
    io.enable('browser client etag');
    io.enable('browser client gzip');
  });
  app['socket-io'] = io;
  io.sockets.on('connection', function (socket) {
    socket.on('subscribe', function(room) { socket.join(room); })
    socket.on('unsubscribe', function(room) { socket.leave(room); })
  });
}

var logger = {
  log: function (type) {
    var colors = {
        'error': 31
      , 'warn': 33
      , 'info': 36
      , 'debug': 90
    };

    var message = '\033[' + colors[type] + 'm' + 
      padLogLevel(type) + 
      ' -\033[39m ' + 
      Array.prototype.slice.call(arguments, 1).join(' ');
    var prefix = '  \033[36msocket - \033[39m';
    if (debug.enabled || type === 'debug' || type === 'info') debug(message);
    else if (type === 'warn') console.warn(prefix + message);
    else console.error(prefix + message);

    return this;
  }
};
['error', 'warn', 'info', 'debug'].forEach(function (name) {
  logger[name] = function () {
    this.log.apply(this, [name].concat(Array.prototype.slice.call(arguments)));
  };
});

function padLogLevel (str) {
  var max = 5;

  if (str.length < max)
    return str + new Array(max - str.length + 1).join(' ');

  return str;
};