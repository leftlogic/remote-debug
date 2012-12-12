var net = require('net');
var plist = require('plist');
var bplist_create = require('node-bplist-creator');
var bplist_parse = require('bplist-parser');

var extract_plist = function (str) {
  var buffer = new Buffer(str.split(' ').map(function (val) { return parseInt(val, 16); }));
  return bplist_parse.parseBuffer(buffer);
};

var bufferpack = require('bufferpack');
var uuid = require('node-uuid');

var log = console.log.bind(console);

var socket = new net.Socket({type: 'tcp6'});

socket.on('data', function(data) {
  log('\n\n\ndata');
  console.log(data);
  console.log(data.slice(4).toString());
  log(data.slice(0, 4));
  plist = bplist_parse.parseBuffer(data.slice(4));
  log('plist', plist);
});

socket.on('close', function() {
  console.log('socket disconnected');
});

socket.connect(27753, '::1', function () {
  console.log("socket connected.");
  console.log(socket.remoteAddress + ':' + socket.remotePort);


  var plist = bplist_create({
    __argument: {
      WIRConnectionIdentifierKey: uuid.v4()
    },
    __selector : '_rpc_reportIdentifier:'
  });
  
  console.log(plist);
  console.log(plist.toString());
  console.log('Length: ', plist.length);
  console.log('Length buffer: ', bufferpack.pack('L', [plist.length]));

  socket.write(bufferpack.pack('L', [plist.length]));
  socket.write(plist, 'binary');

  log();
  log();
  log();
  log();

});