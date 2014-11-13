//stackoverflowController
(function(stackoverflowController) {
  var bodyParser = require('body-parser'),
    EventStore = require('eventstore-client'),
    request = require('request');


  stackoverflowController.init = function(app, config) {
    app.post('/api/stackoverflow-questions/hook', bodyParser.json(), function(req, res) {

      var translator = require('./translators/stackoverflowTranslator');

      var events = JSON.stringify(translator.translateNotification(req.body));
      var es = new EventStore({
        baseUrl: config.eventStoreBaseUrl,
        username: config.eventStoreUser,
        password: config.eventStorePassword
      });

      es.stream.post({
        name: "stackoverflowquestions",
        events: events
      }, function(error, response) {
        res.json({
          message: 'Your stackoverflow question notification is in queue to be added to CommitStream.' + ' ' + response.statusCode
        });
        res.end();
      });

    });

    app.get('/api/stackoverflow-questions/query', function(req, res) {
      res.send('ok');
    });
  }
})(module.exports)