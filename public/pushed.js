var pushed = {};
(function () {
    var socket = io.connect();
    var subscriptions = [];
    var connected = false;
    function connect() {
      connected = true;
      for (var i = 0; i < subscriptions.length; i++) {
        socket.emit('subscribe', subscriptions[i]);
      }
    }
    socket.on('connect', connect);
    socket.on('reconnect', connect);
    function subscribe(topic) {
      topic = (topic === '/') ? '/' : topic.replace(/\/$/, '');
      if (connected) socket.emit('subscribe', topic);
      for (var i = 0; i < subscriptions.length; i++) {
        if (subscriptions[i] === topic) return;
      }
      subscriptions.push(topic);
    }
    subscribe(location.pathname);
    pushed.on = socket.on.bind(socket);
    pushed.subscribe = subscribe;
}());