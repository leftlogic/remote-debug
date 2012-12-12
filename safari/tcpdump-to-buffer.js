var str = '0103 0304 0101 080a 3f6a b94e 0000 0000';

var str = '0x0000:  6000 0000 0020 0640 0000 0000 0000 0000  `......@........\n' + 
  '0x0010:  0000 0000 0000 0001 0000 0000 0000 0000  ................\n' +
  '0x0020:  0000 0000 0000 0001 e79e 6c69 f416 4d29  ..........li..M)\n' +
  '0x0030:  3665 a36e 8010 23d7 0028 0000 0101 080a  6e.n..#..(......\n' +
  '0x0040:  3f6a b94e 3f6a b94e                      ?j.N?j.N';

// clean up
var clean = [];
str.trim().split('\n').forEach(function (s) {
  clean.push(s.slice(9, 38));
});

var data = [];
clean.join(' ').split(' ').map(function (pair) {
  pair = pair.trim();
  if (pair) {
    data.push(parseInt(pair.slice(0,2), 16));
    data.push(parseInt(pair.slice(2), 16));
  }
})

console.log(new Buffer(data));
