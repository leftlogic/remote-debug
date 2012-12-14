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
    WIRPageIdentifierKey: 1,
    WIRSenderKey: sender_id
  },
  __selector: '_rpc_forwardSocketSetup:'
};

// Action

msg.enable_runtime = {
  __argument: {
    WIRApplicationIdentifierKey: 'com.apple.mobilesafari',
    WIRSocketDataKey: new Buffer(JSON.stringify({
      method: "Runtime.enable",
      id: 1
    })),
    WIRConnectionIdentifierKey: conn_id,
    WIRSenderKey: sender_id,
    WIRPageIdentifierKey: 1
  },
  __selector: '_rpc_forwardSocketData:'
};

msg.send_alert = {
  __argument: {
    WIRApplicationIdentifierKey: 'com.apple.mobilesafari',
    WIRSocketDataKey: new Buffer('{"method":"Runtime.evaluate","params":{"expression":"alert(\"Hello\")","objectGroup":"console","includeCommandLineAPI":true,"doNotPauseOnExceptionsAndMuteConsole":true,"returnByValue":false},"id":1}'),
    WIRConnectionIdentifierKey: conn_id,
    WIRSenderKey: sender_id,
    WIRPageIdentifierKey: 1
  },
  __selector: '_rpc_forwardSocketData:'
};

// ====================================
// SENDING
// ====================================

var raw_send = function (socket, data, cb) {

  cb = cb || noop;

  log();
  log("=========== OUT ===========".blue);
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

var handlers = {};

var handle = function (plist) {
  if( ! plist.__selector ) return;
  var selector = plist.__selector.slice(0, -1);

  log();
  log('handle'.green, selector);

  (handlers[selector] || noop)(plist);
};

// ====================================
// SOCKET
// ====================================

var recieved = new Buffer(0);
var read_pos = 0;

socket.on('data', function (data) {

  log();
  log('=========== data ==========='.red);
  log();

  // Append this new data to the existing Buffer
  recieved = Buffer.concat([recieved, data]);

  var data_left_over = true; 

  // Parse multiple messages in the same packet
  while( data_left_over ) {
  
    // log('read_pos:', read_pos);
    // log();

    // Store a reference to where we were
    var old_read_pos = read_pos;

    // log();
    // log('data');
    // log(data);
    // log(data.toString().green);
    // log(data.length);
    // log('/data');

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

    // log();
    // log('prefix');
    // log(prefix);
    // log(msg_length);
    // log('%d -> %d', read_pos, read_pos + msg_length);
    // log('slicing from %d -> %d', read_pos, read_pos + msg_length);
    // log('/prefix');

    // Is there enough data here?
    // If not, jump back to our original position and gtfo
    if( recieved.length < msg_length + read_pos ) {
      read_pos = old_read_pos;
      break;
    }

    // Extract the main body of the message (where the plist should be)
    var body = recieved.slice(read_pos, msg_length + read_pos);

    // log();
    // log('body');
    // log(body);
    // log(body.toString().green);
    // log(body.length);
    // log('/body');

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
    log(util.inspect(plist, false, null));
    log('=========================================='.green);

    // Jump forward the length of the plist
    read_pos += msg_length;

    // Calculate how much buffer is left
    var left_over = recieved.length - read_pos;

    // Is there some left over?
    if( left_over !== 0 ) {

      // log('left_over');
      // log('%d left over.', left_over);
      // log('Read pos reset from %d', read_pos);

      // Copy what's left over into a new buffer, and save it for next time
      var chunk = new Buffer(left_over);
      recieved.copy(chunk, 0, read_pos);
      recieved = chunk;

      // log('Recieved now %d long', recieved.length);
      // log('/left_over');

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