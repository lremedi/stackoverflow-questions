(function(stackoverflowJob) {
  var TimerJob = require('timer-jobs'),
    stackoverflowHelper = require('./stackoverflowHelper.js'),
    request = require('request'),
    EventStore = require('eventstore-client');
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
  var es;
  stackoverflowJob.init = function(config) {
    var stackoverflowQuestionsEndpoints = {
      stackoverflowHook: config.serverBaseUrl + "/api/stackoverflow-questions/hook?key=" + config.apiKey,
      stackoverflowStatus: config.serverBaseUrl + "/api/stackoverflow-questions/query?key=" + config.apiKey
    }
    that.es = new EventStore({
      baseUrl: config.eventStoreBaseUrl,
      username: config.eventStoreUser,
      password: config.eventStorePassword
    });
    that.endpoints = stackoverflowQuestionsEndpoints;
  }
  stackoverflowJob.start = function(filter) {
    stackoverflowHelper.init();
    filter = filter || {
      key: '1f3aZ5AjRu1fCEH89MJdvg((',
      tagged: 'versionone',
      sort: 'creation',
      order: 'asc'
    };
    var options = {
      url: "http://localhost:2113/projection/stackoverflowquestions/state"
    }
    that.es.projection.getState({
      name: 'stackoverflowquestions'
    }, function(error, response) {
      if (!error) {
        if (response.statusCode == 200) {
          if (response.body.lastquestion && response.body.lastquestion != 0)
            filter.fromdate = response.body.lastquestion;
          var timer = new TimerJob({
            interval: 5000
          }, function(done) {
            stackoverflowHelper.get(handleResults, filter);
            done();
          });
          timer.start();
        }
      }
    })
  }
})(module.exports);