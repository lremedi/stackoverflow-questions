var q = require('q'),
  TimerJob = require('timer-jobs'),
  stackoverflowHelper = require('./stackoverflowHelper.js'),
  request = require('request'),
  EventStore = require('eventstore-client');

module.exports = function() {
  var endpoints = {};
  var that = this;
  var config = {};

  var getFromDate = function(name) {
    var deferred = q.defer();
    console.log("getFromDate:" + name);
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
      } else {
        if (response.body.length == 0) {
          deferred.resolve();
        } else {
          var lastquestion;
          try {
            lastquestion = JSON.parse(response.body).lastquestion;
          } catch (ex) {

          }
          if (lastquestion && lastquestion != 0)
            deferred.resolve(lastquestion);
          else
            deferred.resolve(null);
        }
      }

    });

    return deferred.promise;
  }

  var getResultsFromSO = function(creation_date) {
    var deferred = q.defer();
    console.log("getFromDate:" + creation_date);
    var filter = {
      key: '1f3aZ5AjRu1fCEH89MJdvg((',
      tagged: 'versionone',
      sort: 'creation',
      order: 'asc'
    };
    if (creation_date) filter.fromdate = creation_date + 1;
    stackoverflowHelper.init();
    stackoverflowHelper.get(filter, function(error, response) {
      if (error) deferred.reject(error);
      if (!response.items) deferred.reject();
      deferred.resolve(response);
    });
    return deferred.promise;
  }

  var pushToES = function(items) {
    console.log("pushToES:");
    console.log(items);
    var deferred = q.defer();
    console.log(endpoints.stackoverflowHook);
    var options = {
      url: endpoints.stackoverflowHook,
      body: JSON.stringify(items),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    request.post(options, function(error, response) {
      if (error) deferred.reject(error);
      deferred.resolve(response);
    });
    return deferred.promise;
  }

  var start = function() {
    var timer = new TimerJob({
      interval: 5000
    }, function(done) {
      getFromDate("stackoverflowquestions")
        .then(getResultsFromSO)
        .then(pushToES)
        .fail(function(error) {
          console.log(error);
        });
      done();
    });
    timer.start();
  }

  return {
    init: function(app, cfg) {
      config = cfg;
      endpoints = {
        stackoverflowHook: config.serverBaseUrl + "/api/stackoverflow-questions/hook?key=" + config.apiKey,
        stackoverflowStatus: config.serverBaseUrl + "/api/stackoverflow-questions/query?key=" + config.apiKey
      }
      start();
    }
  }
}()