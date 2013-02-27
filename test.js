var request = require('request');
var requestsMade = 0;
var requestsCompleted = 0;
requestsMade+=5;
request('http://localhost:3000/api/proxy/ForbesLindesay/curry/master/test/tests.html', function (err, res) {
  if (err) console.warn(err.stack);
  else if (res.statusCode != 200) console.warn('Status Code: ' + 200);
  requestsCompleted++;
  console.log(requestsCompleted + ' / ' + requestsMade);
});
request('http://localhost:3000/api/proxy/ForbesLindesay/curry/master/test/mocha.css', function (err, res) {
  if (err) console.warn(err.stack);
  else if (res.statusCode != 200) console.warn('Status Code: ' + 200);
  requestsCompleted++;
  console.log(requestsCompleted + ' / ' + requestsMade);
});
request('http://localhost:3000/api/proxy/ForbesLindesay/curry/master/test/mocha.js', function (err, res) {
  if (err) console.warn(err.stack);
  else if (res.statusCode != 200) console.warn('Status Code: ' + 200);
  requestsCompleted++;
  console.log(requestsCompleted + ' / ' + requestsMade);
});
request('http://localhost:3000/api/proxy/ForbesLindesay/curry/master/test/test.js', function (err, res) {
  if (err) console.warn(err.stack);
  else if (res.statusCode != 200) console.warn('Status Code: ' + 200);
  requestsCompleted++;
  console.log(requestsCompleted + ' / ' + requestsMade);
});
request('http://localhost:3000/api/proxy/ForbesLindesay/curry/master/build/build.js', function (err, res) {
  if (err) console.warn(err.stack);
  else if (res.statusCode != 200) console.warn('Status Code: ' + 200);
  requestsCompleted++;
  console.log(requestsCompleted + ' / ' + requestsMade);
});
requestsMade+=5;
request('http://localhost:3000/api/proxy/ForbesLindesay/curry/master/test/tests.html', function (err, res) {
  if (err) console.warn(err.stack);
  else if (res.statusCode != 200) console.warn('Status Code: ' + 200);
  requestsCompleted++;
  console.log(requestsCompleted + ' / ' + requestsMade);
});
request('http://localhost:3000/api/proxy/ForbesLindesay/curry/master/test/mocha.css', function (err, res) {
  if (err) console.warn(err.stack);
  else if (res.statusCode != 200) console.warn('Status Code: ' + 200);
  requestsCompleted++;
  console.log(requestsCompleted + ' / ' + requestsMade);
});
request('http://localhost:3000/api/proxy/ForbesLindesay/curry/master/test/mocha.js', function (err, res) {
  if (err) console.warn(err.stack);
  else if (res.statusCode != 200) console.warn('Status Code: ' + 200);
  requestsCompleted++;
  console.log(requestsCompleted + ' / ' + requestsMade);
});
request('http://localhost:3000/api/proxy/ForbesLindesay/curry/master/test/test.js', function (err, res) {
  if (err) console.warn(err.stack);
  else if (res.statusCode != 200) console.warn('Status Code: ' + 200);
  requestsCompleted++;
  console.log(requestsCompleted + ' / ' + requestsMade);
});
request('http://localhost:3000/api/proxy/ForbesLindesay/curry/master/build/build.js', function (err, res) {
  if (err) console.warn(err.stack);
  else if (res.statusCode != 200) console.warn('Status Code: ' + 200);
  requestsCompleted++;
  console.log(requestsCompleted + ' / ' + requestsMade);
});
var interval;
interval = setInterval(function () {
  if(requestsMade >= 5000) clearInterval(interval);
  requestsMade++;
  request('http://localhost:3000/api/proxy/ForbesLindesay/curry/master/test/tests.html', function (err, res) {
    if (err) console.warn(err.stack);
    else if (res.statusCode != 200) console.warn('Status Code: ' + 200);
    requestsCompleted++;
    console.log(requestsCompleted + ' / ' + requestsMade);
  });
}, 2000);
