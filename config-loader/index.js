var conf = require('jepso-ci-config');

var memCacheSize = 5;
var memCacheClear = [];
var memCache = {};

module.exports = getConfig;
function getConfig(user, repo, tag) {
  var id = user + '/' + repo + '/' + tag;
  if (memCache[id]) return memCache[id];
  memCacheClear.push(id);
  if (memCacheClear.length > memCacheSize && memCache[memCacheClear[0]]) delete memCache[memCacheClear.shift()];
  return memCache[id] = conf.loadRemote(user, repo, tag)
    .fail(function (err) {
      if (memCache[id]) delete memCache[id];
      throw err;
    });
}

