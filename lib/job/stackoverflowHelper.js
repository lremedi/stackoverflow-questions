(function(stackoverflowHelper) {
  var stackexchange = require('stackexchange');
  var context;
  var that = this;
  stackoverflowHelper.init = function(options) {
    that.context = new stackexchange(options);
  }
  stackoverflowHelper.get = function(handler, filter, cb) {
    if (!that.context) console.log("Context not initialized.")
    that.context.questions.questions(filter, function(err, results) {
      if (err) console.log(err);
      handler(results, cb);
    });
  }
})(module.exports)