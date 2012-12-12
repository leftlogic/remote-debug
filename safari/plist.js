var net = require('net');
var plist = require('plist');
var bplist_create = require('node-bplist-creator');
var bplist_parse = require('bplist-parser');
var bufferpack = require('bufferpack');
var uuid = require('node-uuid');

var log = console.log.bind(console);
var noop = function () {};

// var extract_plist = function (str) {
//   var buffer = new Buffer(str.split(' ').map(function (val) { return parseInt(val, 16); }));
//   return bplist_parse.parseBuffer(buffer);
// };

var socket = new net.Socket({type: 'tcp6'});
var conn_id = uuid.v4();

/* SENDING */

var raw_send = function (socket, data) {

  log("OUT:");
  log(data);

  var plist = bplist_create(data);
  
  socket.write(bufferpack.pack('L', [plist.length]));
  socket.write(plist, 'binary');
};

var send = noop;

/* HANDLERS */

var handlers = {
  _rpc_reportConnectedApplicationList: function (plist) {
    send({
      __argument: {
        WIRConnectionIdentifierKey: conn_id,
        WIRApplicationIdentifierKey: 'com.apple.mobilesafari'
      },
      __selector : '_rpc_forwardGetListing:'
    });
  }
};

var handle = function (plist) {
  if( ! plist.__selector ) return;
  log('handle', plist.__selector.slice(0, -1));
  (handlers[plist.__selector.slice(0, -1)] || noop)(plist);
};

/* SOCKET */

socket.on('data', function(data) {
  log('\n\ndata');
  log('first 4:');
  log(data.slice(0, 4));
  log(bufferpack.unpack('L', data.slice(0, 4)));
  log('the rest:');
  log(data.slice(4));
  log(data.slice(4).toString());
  if( data.length <= 4 ) return;
  var plist = bplist_parse.parseBuffer(data.slice(4))[0];
  log(plist);
  if( plist ) {
    handle(plist);
  }
});

socket.on('close', function() {
  console.log('socket disconnected');
});

socket.connect(27753, '::1', function () {
  console.log("socket connected:", socket.remoteAddress + ':' + socket.remotePort);

  send = raw_send.bind(this, socket);

  send({
    __argument: {
      WIRConnectionIdentifierKey: conn_id
    },
    __selector : '_rpc_reportIdentifier:'
  });
});