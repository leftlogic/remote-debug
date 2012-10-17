var spawn = require('child_process').spawn,
    path = '/Users/tom/dev/dragonkeeper/dragonkeeper/dragonkeeper.py',
    py = spawn('python', ['-u', path], {
      // cwd: '/Users/tom/dev/dragonfly/src'
    });

py.stdout.on('data', function (data) {
  console.log('' + data);
});

py.stderr.on('data', function (data) {
  console.log('' + data);
});

py.on('exit', function (code) {
  console.log('child process exited with code ' + code);
});