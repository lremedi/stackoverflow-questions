(function() {
  var _ = require('underscore'),
    moment = require('moment');

  module.exports = function(entries) {
    var questions = _.map(entries, function(entry) {
      var e = entry.content.data;
      return {
        question_id: e.question_id,
        title: e.title,
        link: e.link,
        creation_date: e.creation_date,
        last_activity_date: e.last_activity_date,
        is_answered: e.is_answered,
        answer_count: e.answer_count
      };
    });
    var response = {
      events: questions
    };
    return response;
  };
})();