var net = require('net');
var plist = require('plist');
var bplist_create = require('node-bplist-creator');
var bplist_parse = require('bplist-parser');
var bufferpack = require('bufferpack');
var uuid = require('node-uuid');
var colors = require('colors');
var util = require('util');

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

  log();
  log("=========== OUT ===========".blue);
  log(data);

  var plist = bplist_create(data);
  
  socket.write(bufferpack.pack('L', [plist.length]));
  socket.write(plist);
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
  log();
  log('handle', plist.__selector.slice(0, -1));
  (handlers[plist.__selector.slice(0, -1)] || noop)(plist);
};

/* SOCKET */

var recieved = new Buffer(0);
var read_pos = 0;

socket.on('data', function (data) {

  log();
  log('=========== data ==========='.red);
  log();

  recieved = Buffer.concat([recieved, data]);

  var data_left_over = true; 

  while( data_left_over ) {
  
    log('read_pos:', read_pos);
    log();

    var old_read_pos = read_pos;

    log();
    log('data');
    log(data);
    log(data.toString().green);
    log(data.length);
    log('/data');

    var prefix = recieved.slice(read_pos, read_pos + 4);
    var msg_length = bufferpack.unpack('L', prefix)[0];

    read_pos += 4;

    log();
    log('prefix');
    log(prefix);
    log(msg_length);
    log('%d -> %d', read_pos, read_pos + msg_length);
    log('slicing from %d -> %d', read_pos, read_pos + msg_length);
    log('/prefix');

    if( recieved.length < msg_length + read_pos ) {
      read_pos = old_read_pos;
      break;
    }

    var body = recieved.slice(read_pos, msg_length + read_pos);

    log();
    log('body');
    log(body);
    log(body.toString().green);
    log(body.length);
    log('/body');

    var plist;
    try {
      plist = bplist_parse.parseBuffer(body);
    } catch (e) {
      console.log(e);
    }

    if( plist.length === 1 ) {
      plist = plist[0];
    }

    log();
    log('plist');
    log(util.inspect(plist, false, null));
    log('/plist');

    read_pos += msg_length;

    var left_over = recieved.length - read_pos;

    if( left_over !== 0 ) {
      log('left_over');
      log('%d left over.', left_over);
      log('Read pos reset from %d', read_pos);
      var chunk = new Buffer(left_over);
      recieved.copy(chunk, 0, read_pos);
      recieved = chunk;
      read_pos = 0;
      log('Recieved now %d long', recieved.length);
      log('/left_over');
    } else {
      recieved = new Buffer(0);
      data_left_over = false;
    }
      read_pos = 0;

    // Now do something with the plist
    if( plist ) {
      handle(plist);
    }

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