(function(stackoverflowJob) {
  var TimerJob = require('timer-jobs'),
    stackoverflowHelper = require('./stackoverflowHelper.js'),
    request = require('request');
  var endpoints;
  var fromDate;
  var that = this;
  var handleResults = function(results) {
    if (results.items) {
      var options = {
        url: that.endpoints.stackoverflowHook,
        body: JSON.stringify(results),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };
      request.post(options, function(err, response) {
        // body...
      });
    }
  }

  var getStatus = function() {
    request.get(that.endpoints.stackoverflowStatus, function(err, request, response) {
      if (err) throw err;
      that.fromDate = request.status.fromDate;
    });
  }
  stackoverflowJob.init = function(endpoints) {
    that.endpoints = endpoints;
  }
  stackoverflowJob.start = function(filter) {
    stackoverflowHelper.init();
    var timer = new TimerJob({
      interval: 5000
    }, function(done) {
      stackoverflowHelper.get(handleResults, filter);
      done();
    });
    timer.start();
  }
})(module.exports);