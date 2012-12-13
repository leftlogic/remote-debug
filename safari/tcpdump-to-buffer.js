var bplist_parse = require('bplist-parser');
var bufferpack = require('bufferpack');
var util = require('util');
var fs = require('fs');

var str = fs.readFileSync('packet.txt', 'utf-8');

// clean up
var clean = [];
str.trim().split('\n').forEach(function (s) {
  console.log(s.slice(9, 48));
  clean.push(s.slice(9, 48));
});

var data = [];
clean.join(' ').split(' ').map(function (pair) {
  pair = pair.trim();
  if (pair) {
    var first = parseInt(pair.slice(0,2), 16);
    var second = parseInt(pair.slice(2), 16);
    if( !isNaN(first) ) {
      data.push(first);
    }
    if( !isNaN(second) ) {
      data.push(second);
    }
  }
});

// console.log(data.join(','));
console.log(data.length);

var buf = new Buffer(data.slice(8));

console.log(buf);
console.log(buf.length);

var plist;
try {
  plist = bplist_parse.parseBuffer(buf);
} catch (e) {
  console.log(e);
}

console.log(util.inspect(plist, false, null));

if( plist[0].__argument.WIRSocketDataKey ) {
  console.log(plist[0].__argument.WIRSocketDataKey.toString());
}
if( plist[0].__argument.WIRMessageDataKey ) {
  console.log(plist[0].__argument.WIRMessageDataKey.toString());
}


