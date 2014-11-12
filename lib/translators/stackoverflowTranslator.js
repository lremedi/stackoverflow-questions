(function(stackoverflowTranslator) {
  var _ = require('underscore'),
    uuid = require('uuid-v4');

  stackoverflowTranslator.translateNotification = function(notificationEvent) {
    return [{
      eventId: uuid(),
      eventType: 'stackoverflow-event',
      data: notificationEvent
    }];
  };
})(module.exports);