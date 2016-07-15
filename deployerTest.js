
var http = require('http');
var leap = require('leapjs');

var nrOfFingersToDeploy = 5;
var inputLocked = false;
var inputLockTime = 500;
var buildInProgress = false;
var buildTimeout = 60 * 1000;
var apiBase = '/api/inputs';
var postParams = {
  host: 'localhost', //'192.168.21.92',
  port: 3000,
  method: 'POST'
}

function setupLeap() {
  var controller = new leap.Controller({ enableGestures: true });

  controller.on("gesture", function(gesture) {
      if (gesture.type === 'swipe') {
            calculateSwipe(gesture);
      }
  });

  controller.on('deviceFrame', function(frame) {
    var nrOfFingers = frame.fingers.filter(function(finger, index, fingers) {return finger.extended}).length;
    if (nrOfFingers === nrOfFingersToDeploy && !buildInProgress) {
      buildInProgress = true;
      button();
      buildLock();
    }
  });

  controller.connect();
}

function calculateSwipe(gesture) {
  if (gesture.state !== 'stop' || buildInProgress)
    return;

    var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
    if(isHorizontal) {
        (gesture.direction[0] > 0) ? right() : left();
    } else {
        (gesture.direction[1] > 0) ? up() : down();
    }

    inputLock();
}

// Inverted swipe direction
function up() {
  postParams.path = apiBase + '/down';
  post(postParams);
  console.log('up');
}

function down() {
  postParams.path = apiBase + '/up';
  post(postParams);
  console.log('down');
}

function left() {
  postParams.path = apiBase + '/right';
  post(postParams);
  console.log('left');
}

function right() {
  postParams.path = apiBase + '/left';
  post(postParams);
  console.log('right');
}

function button() {
  postParams.path = apiBase + '/button';
  post(postParams);
  console.log('button');
}

function post(data) {
  var req = http.request(data, function(res) {
      res.on('data', function (chunk) { });
  });

  req.write('');
  req.end();
}

function buildLock() {
  buildInProgress = true;
  setTimeout(function() {
    buildInProgress = false;
    console.log('build done');
  }, buildTimeout);
}

function inputLock() {
  inputLocked = true;
  setTimeout(function() {
    inputLocked = false;
  }, inputLockTime);
}

setupLeap();
