(function(stackoverflowJob) {
  var TimerJob = require('timer-jobs'),
    stackoverflowHelper = require('./stackoverflowHelper.js'),
    request = require('request'),
    EventStore = require('eventstore-client');
  var endpoints;
  var fromDate;
  var that = this;
  var config;

  var handleResults = function(results, cb) {
    var items = results.items;
    if (items) {
      var options = {
        url: that.endpoints.stackoverflowHook,
        body: JSON.stringify(results),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };
      request.post(options, function(err, response) {
        cb(items[items.length]);
      });
    }
  }

  stackoverflowJob.init = function(config) {
    that.config = config;
    var stackoverflowQuestionsEndpoints = {
      stackoverflowHook: config.serverBaseUrl + "/api/stackoverflow-questions/hook?key=" + config.apiKey,
      stackoverflowStatus: config.serverBaseUrl + "/api/stackoverflow-questions/query?key=" + config.apiKey
    }
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

    var es = new EventStore({
      baseUrl: that.config.eventStoreBaseUrl,
      username: that.config.eventStoreUser,
      password: that.config.eventStorePassword
    });

    es.projection.getState({
      name: 'stackoverflowquestions'
    }, function(error, response) {

      if (!error) {
        if (response.statusCode == 200) {

          if (response.body.lastquestion && response.body.lastquestion != 0)
            filter.fromdate = response.body.lastquestion;
          console.log(response.body);
          stackoverflowHelper.get(handleResults, filter, function(lastquestion) {
            filter.fromdate = lastquestion;
            console.log(filter);
          });
          /* var timer = new TimerJob({
             interval: 5000
           }, function(done) {

             stackoverflowHelper.get(handleResults, filter, function(lastquestion) {
               filter.fromdate = lastquestion;
             });
             done();
           });
           timer.start();*/
        }
      }
    })
  }
})(module.exports);