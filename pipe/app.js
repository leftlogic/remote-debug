var WSC = require('websocket').client,
    WSS = require('websocket').server;

var request = require('request');
var http = require('http');

var client = new WSC();

var spawn = require('child_process').spawn,
    path = '/Users/tom/dev/dragonkeeper/dragonkeeper/dragonkeeper.py',
    py = spawn('python', [path], {
      cwd: '/Users/tom/dev/dragonfly/src'
    });

py.stdout.pipe(process.stdout);

setTimeout(function () {
  console.log("http://localhost:8002/services");
  request('http://localhost:8002/services', function (err, res, body) {
    console.log(body);
    console.log("http://localhost:8002/get-stp-version");
    request(
      'http://localhost:8002/get-stp-version?time=' + (new Date()).getTime(),
      function (err, res, body) {
        console.log(body);
      });
  });
}, 1000 * 20);

// Websocket server

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(7001, function() {
    console.log((new Date()) + ' Server is listening on port 7001');
});

wsServer = new WSS({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function(req) {

    var connection = req.accept();
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});