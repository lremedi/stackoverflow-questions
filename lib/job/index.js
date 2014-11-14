var q = require('q'),
  TimerJob = require('timer-jobs'),
  stackoverflowHelper = require('./stackoverflowHelper.js'),
  request = require('request'),
  EventStore = require('eventstore-client');

module.exports = function(config) {
  var endpoints = {};
  var that = this;
  var getFromDate = function(name) {
    var deferred = q.defer();

    var es = new EventStore({
      baseUrl: config.eventStoreBaseUrl,
      username: config.eventStoreUser,
      password: config.eventStorePassword
    });

    es.projection.getState({
      name: name
    }, function(error, response) {
      if (error) deferred.reject(error);
      if (response.statusCode != 200) {
        if (response.statusCode == 404)
          deferred.resolve(null);
        else
          deferred.reject(error);
      }
      var lastquestion = JSON.parse(response.body).lastquestion;
      if (lastquestion && lastquestion != 0)
        deferred.resolve(lastquestion);
    });

    return deferred.promise;
  }

  var getResultsFromSO = function(creation_date) {
    var deferred = q.defer();
    var filter = {
      key: '1f3aZ5AjRu1fCEH89MJdvg((',
      tagged: 'versionone',
      sort: 'creation',
      order: 'asc',
      fromdata: creation_date
    };
    stackoverflowHelper.init();
    stackoverflowHelper.get(filter, function(error, response) {
      if (error) deferred.reject(error);
      if (!results.items) deferred.reject(0);
      deferred.resolve(results.items);
      return deferred.promise;
    });
  }

  var pushToES = function(items) {
    var deferred = q.defer();
    var options = {
      url: that.endpoints.stackoverflowHook,
      body: JSON.stringify(results),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    request.post(options, function(err, response) {
      if (error) deferred.reject(error);
      deferred.resolve(response);
    });
    return deferred.promise;
  }

  return {
    init: function(config) {
      var stackoverflowQuestionsEndpoints = {
        stackoverflowHook: config.serverBaseUrl + "/api/stackoverflow-questions/hook?key=" + config.apiKey,
        stackoverflowStatus: config.serverBaseUrl + "/api/stackoverflow-questions/query?key=" + config.apiKey
      }
      that.endpoints = stackoverflowQuestionsEndpoints;
    },
    start: function() {
      var timer = new TimerJob({
        interval: 5000
      }, function(done) {
        that.getFromDate("stackoverflowquestions")
          .then(function(creation_date) {
            console.log(creation_date)
          })
          .fail(function(error) {
            console.log(error);
          });
        done();
      });
      timer.start();
    }
  }
}