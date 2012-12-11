var net = require('net');

var build_packet = function (packet) {
  var packet_str = JSON.stringify(packet);
  return '' + packet_str.length + ':' + packet_str;
};

var write = function (client, packet) {
  console.log("OUT:", build_packet(packet));
  console.log("\n");
  client.write(build_packet(packet));
};

var get_tabs = function (client) {
  write(client, {
    to: "root",
    type: "listTabs"
  });
};

var attach = function (client, actor) {
  write(client, {
    to: actor,
    type: "attach"
  });
};

var detach = function (client, actor) {
  write(client, {
    to: actor,
    type: "detach"
  });
};

var get_frames = function (client, actor) {
  write(client, {
    to: actor,
    type: "frames"
  });
};

var resume = function (client, actor) {
  write(client, {
    to: actor,
    type: "resume"
  });
};

var interrupt = function (client, actor) {
  write(client, {
    to: actor,
    type: "interrupt"
  });
};

var start_listeners = function (client, actor) {
  write(client, {
    to: actor,
    type: "startListeners",
    listeners: ["ConsoleAPI"]
  });
};

var evaluate_js = function (client, actor, js) {
  write(client, {
    to: actor,
    type: "evaluateJS",
    text: js
  });
};

var opts = {
  host: 'localhost',
  port: 6002
};

var client = net.connect(opts, function() {
  console.log('client connected');
});

client.on('data', function(data) {
  var data_str = data.toString();
  var packet = JSON.parse(data_str.slice(data_str.indexOf(':') + 1));
  console.log(packet);
  console.log('\n\n');
  if( packet.applicationType === "browser" ) {
    get_tabs(client);
  }
  if( packet.tabs ) {
    start_listeners(client, packet.tabs[1].consoleActor);
  }
  if( packet.nativeConsoleAPI ) {
    evaluate_js(client, packet.from, 'document.title = "Hello.";');
  }
});

client.on('end', function() {
  console.log('client disconnected');
});