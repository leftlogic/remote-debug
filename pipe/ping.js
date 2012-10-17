var request = require('request');
var http = require('http');

var get_url = function (path, time) {
  if (time === undefined) time = true;
  return 'http://localhost:8002' + path + (time ? '?time=' + (new Date()).getTime() : '');
};

var post_id = 0;
var post_url = function (path) {
  var id = post_id;
  post_id++;
  return 'http://localhost:8002' + path + '/' + id;
};

var do_post = function (path, body, done) {
  done = done || function () {};
  request.post({
    method: 'post',
    url: post_url(path),
    body: body,
    headers: {
      'Content-Length': body.length
    }
  }, function (err, res, body) {
    if (err) console.log(err);
    console.log(body);
    done(post_id);
  });
};


var poll_data = [];
var poll_loop = function () {
  request(get_url('/get-message'), function (err, res, body) {
    console.log('\n\npoll_loop:\n');
    poll_data[post_id] = body;
    console.log(body);
    setTimeout(function () {
      poll_loop();
    }, 100);
  });
};

var get_services = function (done) {
  console.log("http://localhost:8002/services");
  request('http://localhost:8002/services', function (err, res, body) {
    console.log('get_services:', body);
    if (body.length < 22) {
      setTimeout(function () {
        get_services(done);
      }, 100);
    } else {
      done();
    }
  });
};

var get_stp_version = function (done) {
  console.log(get_url('/get-stp-version'));
  request(get_url('/get-stp-version'), function (err, res, body) {
    console.log('get_stp_version:', body);
    done();
  });
};

var get_enable = function (done) {
  request(get_url('/enable/stp-1', false), function (err, res, body) {
    console.log('get_enable:', body);
    done();
  });
};

var post_hostinfo = function (done) {
  do_post('/post-command/scope/10', '[]', done);
};

var post_connect = function (done) {
  do_post('/post-command/scope/3', '[]', done);
};

get_services(function () {
  post_hostinfo(function () {
    // Enable ecmascript
    do_post('/post-command/scope/5', '["ecmascript"]', function () {
      do_post('/post-command/ecmascript/1', '[[]]');
      // Eval
      do_post('/post-command/ecmascript/2', '[4,"alert(\\\"hello\\\")",[]]', function (id) {
        console.log('done.');
      });
    });
  });
  poll_loop();
});

