/* DEPENDENCIES */

var net = require('net');
    plist = require('plist'),
    bplist_create = require('node-bplist-creator'),
    bplist_parse = require('bplist-parser'),
    bufferpack = require('bufferpack'),
    uuid = require('node-uuid'),
    colors = require('colors'),
    util = require('util');

var log = console.log.bind(console);
var noop = function () {};

// ====================================
// CONFIG
// ====================================

var socket = new net.Socket({type: 'tcp6'});
var conn_id = '41DC39AA-55A7-4C85-9566-B58E6627DD62';
var sender_id = 'E0F4C128-F4FF-4D45-A538-BA382CD66017';

// ====================================
// MESSAGES
// ====================================

var msg = {};

// Connection

msg.set_connection_key = {
  __argument: {
    WIRConnectionIdentifierKey: conn_id
  },
  __selector : '_rpc_reportIdentifier:'
};

msg.connect_to_app = {
  __argument: {
    WIRConnectionIdentifierKey: conn_id,
    WIRApplicationIdentifierKey: 'com.apple.mobilesafari'
  },
  __selector : '_rpc_forwardGetListing:'
};

msg.set_sender_key = {
  __argument: {
    WIRApplicationIdentifierKey: 'com.apple.mobilesafari',
    WIRConnectionIdentifierKey: conn_id,
    WIRSenderKey: sender_id,
    WIRPageIdentifierKey: 1
  },
  __selector: '_rpc_forwardSocketSetup:'
};

// Action

msg.enable_runtime = {
  __argument: {
    WIRApplicationIdentifierKey: 'com.apple.mobilesafari',
    WIRSocketDataKey: {
      method: "Runtime.enable"
    },
    WIRConnectionIdentifierKey: conn_id,
    WIRSenderKey: sender_id,
    WIRPageIdentifierKey: 1
  },
  __selector: '_rpc_forwardSocketData:'
};

msg.send_alert = {
  __argument: {
    WIRApplicationIdentifierKey: 'com.apple.mobilesafari',
    WIRSocketDataKey: {
      method: "Runtime.evaluate",
      params: {
        expression: 'alert("Hello")',
        objectGroup: "console",
        includeCommandLineAPI: true,
        doNotPauseOnExceptionsAndMuteConsole: true,
        returnByValue: false
      }
    },
    WIRConnectionIdentifierKey: conn_id,
    WIRSenderKey: sender_id,
    WIRPageIdentifierKey: 1
  },
  __selector: '_rpc_forwardSocketData:'
};

// ====================================
// SENDING
// ====================================

var msg_id = 0;

var raw_send = function (socket, data, cb) {

  cb = cb || noop;

  if( data.__argument && data.__argument.WIRSocketDataKey ) {
    msg_id += 1;
    data.__argument.WIRSocketDataKey.id = msg_id;
    data.__argument.WIRSocketDataKey = JSON.stringify(data.__argument.WIRSocketDataKey);
  }

  log();
  log('out ====================================='.blue);
  log();
  log(data);

  var plist;
  try {
    plist = bplist_create(data);
  } catch(e) {
    return console.log(e);
  }
  
  socket.write(bufferpack.pack('L', [plist.length]));
  socket.write(plist, cb);
};

var send = function () {
  console.log("Send called before initialised.");
};

// ====================================
// HANDLERS
// ====================================

var handlers = {
  _rpc_reportConnectedApplicationList: function (plist) {
    // send(msg.enable_runtime);
  }
};

var handle = function (plist) {
  if( ! plist.__selector ) return;
  var selector = plist.__selector.slice(0, -1);

  log();
  log('handle'.cyan, selector);

  (handlers[selector] || noop)(plist);
};

// ====================================
// SOCKET
// ====================================

var recieved = new Buffer(0);
var read_pos = 0;

socket.on('data', function (data) {

  log();
  log('in ======================================='.red);

  // Append this new data to the existing Buffer
  recieved = Buffer.concat([recieved, data]);

  var data_left_over = true; 

  // Parse multiple messages in the same packet
  while( data_left_over ) {
  
    // Store a reference to where we were
    var old_read_pos = read_pos;

    // Read the prefix (plist length) to see how far to read next
    // It's always 4 bytes long
    var prefix = recieved.slice(read_pos, read_pos + 4);
    var msg_length;

    try {
      msg_length = bufferpack.unpack('L', prefix)[0];
    } catch(e) {
      return log(e);
    }

    // Jump forward 4 bytes
    read_pos += 4;

    // Is there enough data here?
    // If not, jump back to our original position and gtfo
    if( recieved.length < msg_length + read_pos ) {
      read_pos = old_read_pos;
      break;
    }

    // Extract the main body of the message (where the plist should be)
    var body = recieved.slice(read_pos, msg_length + read_pos);

    // Extract the plist
    var plist;
    try {
      plist = bplist_parse.parseBuffer(body);
    } catch (e) {
      console.log(e);
    }

    // bplist_parse.parseBuffer returns an array
    if( plist.length === 1 ) {
      plist = plist[0];
    }

    log();
    log('plist ===================================='.green);
    log();
    log(
      util.inspect(plist, false, null)
    );
    log();
    log('=========================================='.green);

    // Jump forward the length of the plist
    read_pos += msg_length;

    // Calculate how much buffer is left
    var left_over = recieved.length - read_pos;

    // Is there some left over?
    if( left_over !== 0 ) {

      // Copy what's left over into a new buffer, and save it for next time
      var chunk = new Buffer(left_over);
      recieved.copy(chunk, 0, read_pos);
      recieved = chunk;

    } else {

      // Otherwise, empty the buffer and get out of the loop
      recieved = new Buffer(0);
      data_left_over = false;

    }

    // Reset the read position
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

  // Connect to Mobile Safari
  send(msg.set_connection_key);
  send(msg.connect_to_app);
  send(msg.set_sender_key);
});