(function(stackoverflowTranslator) {
  var _ = require('underscore'),
    uuid = require('uuid-v4'),
    jsesc = require('jsesc');

  stackoverflowTranslator.translateNotification = function(notificationEvent) {
    var events = _.map(notificationEvent.items, function(item) {
      var question = {
        "question_id": item.question_id,
        "title": jsesc(item.title),
        "link": item.link,
        "creation_date": item.creation_date,
        "last_activity_date": item.last_activity_date,
        "is_answered": item.is_answered,
        "answer_count": item.answer_count
      };
      return {
        eventId: uuid(),
        eventType: 'stackoverflow-event',
        data: question
      }
    });
    return events;
  };
})(module.exports);