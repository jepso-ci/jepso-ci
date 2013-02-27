var sqs = require('simple-queue-service')();
exports.builds = sqs.createQueue('builds', {visibilityTimeout: '60 seconds'});
exports.jobs = sqs.createQueue('jobs', {visibilityTimeout: '60 seconds'});