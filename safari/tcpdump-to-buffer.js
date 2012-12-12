var bplist_parse = require('bplist-parser');
var bufferpack = require('bufferpack');
var util = require('util')

var str = '0103 0304 0101 080a 3f6a b94e 0000 0000';

var str = '0x0000:  6000 0000 0020 0640 0000 0000 0000 0000  `......@........\n' + 
  '0x0010:  0000 0000 0000 0001 0000 0000 0000 0000  ................\n' +
  '0x0020:  0000 0000 0000 0001 e79e 6c69 f416 4d29  ..........li..M)\n' +
  '0x0030:  3665 a36e 8010 23d7 0028 0000 0101 080a  6e.n..#..(......\n' +
  '0x0040:  3f6a b94e 3f6a b94e                      ?j.N?j.N';

var str =
  "0x0040:  40c1 060f 40c1 060f 6270 6c69 7374 3030  @...@...bplist00\n" +
  "0x0050:  d201 0203 0c5a 5f5f 6172 6775 6d65 6e74  .....Z__argument\n" +
  "0x0060:  5a5f 5f73 656c 6563 746f 72d4 0405 0607  Z__selector.....\n" +
  "0x0070:  0809 0a0b 5f10 1b57 4952 4170 706c 6963  ...._..WIRApplic\n" +
  "0x0080:  6174 696f 6e49 6465 6e74 6966 6965 724b  ationIdentifierK\n" +
  "0x0090:  6579 5f10 1557 4952 496e 6469 6361 7465  ey_..WIRIndicate\n" +
  "0x00a0:  456e 6162 6c65 644b 6579 5f10 1a57 4952  EnabledKey_..WIR\n" +
  "0x00b0:  436f 6e6e 6563 7469 6f6e 4964 656e 7469  ConnectionIdenti\n" +
  "0x00c0:  6669 6572 4b65 795f 1014 5749 5250 6167  fierKey_..WIRPag\n" +
  "0x00d0:  6549 6465 6e74 6966 6965 724b 6579 5f10  eIdentifierKey_.\n" +
  "0x00e0:  1663 6f6d 2e61 7070 6c65 2e6d 6f62 696c  .com.apple.mobil\n" +
  "0x00f0:  6573 6166 6172 6908 5f10 2436 4339 4236  esafari._.$6C9B6\n" +
  "0x0100:  4446 412d 3730 4532 2d34 3033 442d 3845  DFA-70E2-403D-8E\n" +
  "0x0110:  3836 2d45 4246 3837 4446 3233 3845 3210  86-EBF87DF238E2.\n" +
  "0x0120:  015f 101c 5f72 7063 5f66 6f72 7761 7264  ._.._rpc_forward\n" +
  "0x0130:  496e 6469 6361 7465 5765 6256 6965 773a  IndicateWebView:\n" +
  "0x0140:  080d 1823 2c4a 627f 96af b0d7 d900 0000  ...#,Jb.........\n" +
  "0x0150:  0000 0001 0100 0000 0000 0000 0d00 0000  ................\n" +
  "0x0160:  0000 0000 0000 0000 0000 0000 f8         .............";

// var str =
//   "0x0040:  40c0 d748 40c0 d748 6270 6c69 7374 3030  @..H@..Hbplist00\n" +
//   "0x0050:  d201 0203 045a 5f5f 7365 6c65 6374 6f72  .....Z__selector\n" +
//   "0x0060:  5a5f 5f61 7267 756d 656e 745f 1011 5f72  Z__argument_.._r\n" +
//   "0x0070:  7063 5f72 6570 6f72 7453 6574 7570 3ad2  pc_reportSetup:.\n" +
//   "0x0080:  0506 0708 5f10 1357 4952 5369 6d75 6c61  ...._..WIRSimula\n" +
//   "0x0090:  746f 724e 616d 654b 6579 5f10 1457 4952  torNameKey_..WIR\n" +
//   "0x00a0:  5369 6d75 6c61 746f 7242 7569 6c64 4b65  SimulatorBuildKe\n" +
//   "0x00b0:  795f 1010 6950 686f 6e65 2053 696d 756c  y_..iPhone.Simul\n" +
//   "0x00c0:  6174 6f72 5631 3041 3430 3308 0d18 2337  atorV10A403...#7\n" +
//   "0x00d0:  3c52 697c 0000 0000 0000 0101 0000 0000  <Ri|............\n" +
//   "0x00e0:  0000 0009 0000 0000 0000 0000 0000 0000  ................\n" +
//   "0x00f0:  0000 0083                                ....";

// var str =
//     "0x0040:  40c0 d74a 40c0 d74a 6270 6c69 7374 3030  @..J@..Jbplist00\n" +
//     "0x0050:  d201 0203 045a 5f5f 7365 6c65 6374 6f72  .....Z__selector\n" +
//     "0x0060:  5a5f 5f61 7267 756d 656e 745f 101c 5f72  Z__argument_.._r\n" +
//     "0x0070:  7063 5f61 7070 6c69 6361 7469 6f6e 5365  pc_applicationSe\n" +
//     "0x0080:  6e74 4c69 7374 696e 673a d205 0607 085f  ntListing:....._\n" +
//     "0x0090:  101b 5749 5241 7070 6c69 6361 7469 6f6e  ..WIRApplication\n" +
//     "0x00a0:  4964 656e 7469 6669 6572 4b65 795d 5749  IdentifierKey]WI\n" +
//     "0x00b0:  524c 6973 7469 6e67 4b65 795f 1016 636f  RListingKey_..co\n" +
//     "0x00c0:  6d2e 6170 706c 652e 6d6f 6269 6c65 7361  m.apple.mobilesa\n" +
//     "0x00d0:  6661 7269 d109 0a51 31d3 0b0c 0d0e 0f10  fari...Q1.......\n" +
//     "0x00e0:  5f10 1457 4952 5061 6765 4964 656e 7469  _..WIRPageIdenti\n" +
//     "0x00f0:  6669 6572 4b65 795b 5749 5254 6974 6c65  fierKey[WIRTitle\n" +
//     "0x0100:  4b65 7959 5749 5255 524c 4b65 7910 0156  KeyYWIRURLKey..V\n" +
//     "0x0110:  476f 6f67 6c65 5f10 1868 7474 703a 2f2f  Google_..http://\n" +
//     "0x0120:  7777 772e 676f 6f67 6c65 2e63 6f2e 756b  www.google.co.uk\n" +
//     "0x0130:  2f08 0d18 2342 4765 738c 8f91 98af bbc5  /...#BGes.......\n" +
//     "0x0140:  c7ce 0000 0000 0000 0101 0000 0000 0000  ................\n" +
//     "0x0150:  0011 0000 0000 0000 0000 0000 0000 0000  ................\n" +
//     "0x0160:  00e9                                     ..\n";

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


