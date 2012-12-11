var net = require('net');

// var socket = new net.Socket({type: 'tcp6'});

var counter = 0;

var raw_send = function (socket, method, params) {
  counter += 1;
  var msg_str = JSON.stringify({
    id: counter,
    method: method,
    params: params
  });
  console.log('OUT:', msg_str);
  socket.write(msg_str);
};

var send = function () {};

// socket.on('data', function(data) {
//   console.log('data');
//   console.log(data.toString());
//   socket.end();
// });

// socket.on('end', function() {
//   console.log('socket disconnected');
// });

// socket.connect(27753, '::1', function () {
//   console.log("socket connected.");
//   console.log(socket.remoteAddress + ':' + socket.remotePort);
//   send = raw_send.bind(this, socket);
//   // send('Runtime.evaluate', {
//   //   expression: 'alert("hello!")',
//   //   objectGroup: 'console'
//   // });
// });

var client = net.connect({port: 27753, host: '::1'}, function() {
  console.log('client connected');
  send = raw_send.bind(this, client);
  send('Runtime.evaluate', {
    expression: 'alert("hello!")',
    objectGroup: 'console'
  });
});
client.on('data', function(data) {
  console.log(data.toString());
});
client.on('end', function() {
  console.log('client disconnected');
});