var express = require('express');
var cloudflare = require('cloudflare')
  .createClient({
    email: process.env.CF_EMAIL,
    token: process.env.CF_TOKEN
  });

var domain = process.env.CF_DOMAIN;//'jepso-ci.com';

var purges = [];
express.application.purge = function (user, repo, build) {
  if (arguments.length === 1) {
    if (user === 'all') return;
    purges.push(user);
    return this;
  } else {
    for (var i = 0; i < purges.length; i++) {
      var skip = false;
      var url = purges[i].replace(/\:([^\.\:\/\\]+)/g, function (_, key) {
        if (key === 'user' && user) return user;
        if (key === 'repo' && repo) return repo;
        if (key === 'build' && build) return build;
        skip = true;
      });
      if (!skip) {
        purge('https://jepso-ci.com' + url);
      }
    }
  }
};

function purge(url) {
  cloudflare.zoneFilePurge(domain, url, function (err, res) {
    console.log('Purged: ' + url);
    if (err) {
      console.error(err.stack || err.message || err);
    } else {
      console.log(res);
    }
  })
}