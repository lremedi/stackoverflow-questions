//stackoverflowController
(function(stackoverflowController) {
  var bodyParser = require('body-parser'),
    EventStore = require('eventstore-client'),
    request = require('request');


  stackoverflowController.init = function(app, config) {
    app.post('/api/stackoverflow-questions/hook', bodyParser.json(), function(req, res) {
      var translator = require('./translators/stackoverflowTranslator');
      var events = translator.translateNotification(req.body);
      events = JSON.stringify(events);
      var authorization = 'Basic ' + new Buffer('admin' + ':' + 'changeit').toString('base64');
      var eventStoreUrl = 'http://localhost:2113' + '/streams/jenkinsjob';
      var options = {
        url: eventStoreUrl,
        body: events,
        rejectUnauthorized: false,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/vnd.eventstore.events+json',
          'Content-Length': events.length,
          'Authorization': authorization
        }
      };
      request.post(options, function(error, response, body) {
        console.log(error);
        res.json({
          message: 'Your jenkins notification is in queue to be added to CommitStream.' + ' ' + response.statusCode
        });
        res.end();
      });
    });
    //just for fun delete after
    app.get('/api/stackoverflow-questions/query', function(req, res) {
      res.send('ok');
    });
  }
})(module.exports)